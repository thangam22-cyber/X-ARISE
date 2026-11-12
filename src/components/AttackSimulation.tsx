import { useState, useEffect } from "react";
import {
  Flame,
  Play,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ShieldCheck,
  DollarSign,
  Activity,
  RotateCcw,
  Zap,
  Layers,
  Server,
  Database,
  FileText,
  Download,
  Terminal,
  ChevronRight,
  TrendingDown,
  Lock,
  Radio,
  Sliders,
  Sparkles,
  ArrowUpRight,
  BarChart3,
  Network,
  AlertOctagon,
} from "lucide-react";
import { AttackScenario, CompanyProfile, KillChainStep, MultiVectorSimulationResult } from "../types";
import { runMultiVectorStressTest } from "../utils/attackSimulationEngine";
import { validateCanRunLiveTest, connectDemoArchitecture, getCompanyIntegrationState } from "../utils/architectureIntegrations";
import { ArchitectureNotHookedUpModal } from "./ArchitectureNotHookedUpModal";
import confetti from "canvas-confetti";

interface AttackSimulationProps {
  company: CompanyProfile;
  scenarios: AttackScenario[];
  onOpenIntegration?: () => void;
}

interface LiveSocEvent {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "CRITICAL" | "BLOCKED";
  message: string;
  sourceIp: string;
  targetService: string;
}

export function AttackSimulation({ company, scenarios, onOpenIntegration }: AttackSimulationProps) {
  const [selectedScenario, setSelectedScenario] = useState<AttackScenario>(scenarios[0]);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [isRealTimeLive, setIsRealTimeLive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [simulationCompleted, setSimulationCompleted] = useState<boolean>(false);
  const [liveElapsedSec, setLiveElapsedSec] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"killchain" | "financials" | "technical" | "remediation">("killchain");
  const [liveSocLogs, setLiveSocLogs] = useState<LiveSocEvent[]>([]);

  // Architecture Connection Error Modal State
  const [showArchErrorModal, setShowArchErrorModal] = useState<boolean>(false);
  const [archErrorMissingReqs, setArchErrorMissingReqs] = useState<string[]>([]);
  const [archErrorMessage, setArchErrorMessage] = useState<string>("");
  const [integrationVersion, setIntegrationVersion] = useState<number>(0);

  // Multi-Vector Cyber Storm State
  const [isMultiVectorRunning, setIsMultiVectorRunning] = useState<boolean>(false);
  const [multiVectorProgress, setMultiVectorProgress] = useState<number>(0);
  const [multiVectorResult, setMultiVectorResult] = useState<MultiVectorSimulationResult | null>(null);
  const [showMultiVectorModal, setShowMultiVectorModal] = useState<boolean>(false);

  // Simulated Control Fix State
  const [remediatedControls, setRemediatedControls] = useState<Record<string, boolean>>({});

  const currentIntegration = getCompanyIntegrationState(company.id);


  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSimulating && !isPaused) {
      timer = setInterval(() => {
        setLiveElapsedSec((prev) => prev + 1);
      }, isRealTimeLive ? 1000 : 150);
    }
    return () => clearInterval(timer);
  }, [isSimulating, isPaused, isRealTimeLive]);

  // Real-Time event emitter for live stream
  useEffect(() => {
    let logInterval: NodeJS.Timeout;
    if (isSimulating && !isPaused && isRealTimeLive && activeStepIndex >= 0) {
      const step = selectedScenario.killChainSteps[activeStepIndex];
      if (step) {
        logInterval = setInterval(() => {
          const ips = ["198.51.100.42", "203.0.113.88", "185.220.101.5", "45.154.255.99", "10.0.4.12"];
          const services = ["API Gateway", "Auth-0 OAuth", "K8s Ingress", "Postgres Vault", "EDR Sensor"];
          const randomIp = ips[Math.floor(Math.random() * ips.length)];
          const randomSvc = services[Math.floor(Math.random() * services.length)];
          const newEvent: LiveSocEvent = {
            id: Math.random().toString(36).substring(7),
            timestamp: new Date().toLocaleTimeString(),
            level: step.controlStatus === "Blocked" ? "BLOCKED" : step.controlStatus === "Detected" ? "WARN" : "CRITICAL",
            message: `[${step.stage.toUpperCase()}] ${step.iocTelemetry || step.description}`,
            sourceIp: randomIp,
            targetService: randomSvc,
          };
          setLiveSocLogs((prev) => [newEvent, ...prev.slice(0, 19)]);
        }, 1800);
      }
    }
    return () => clearInterval(logInterval);
  }, [isSimulating, isPaused, isRealTimeLive, activeStepIndex, selectedScenario]);

  const filteredScenarios = scenarios.filter((sc) => {
    if (categoryFilter === "All") return true;
    if (categoryFilter === "Ransomware") return sc.category.includes("Ransomware");
    if (categoryFilter === "Zero-Day & Edge") return sc.category.includes("Zero-Day");
    if (categoryFilter === "Supply Chain") return sc.category.includes("Supply Chain");
    if (categoryFilter === "Cloud & API") return sc.category.includes("Cloud") || sc.category.includes("API");
    if (categoryFilter === "Identity & BEC") return sc.category.includes("Deepfake") || sc.category.includes("Credential");
    if (categoryFilter === "OT & APT") return sc.category.includes("Industrial") || sc.category.includes("APT");
    return true;
  });

  const handleStartFastSimulation = () => {
    setIsRealTimeLive(false);
    setIsPaused(false);
    setIsSimulating(true);
    setSimulationCompleted(false);
    setActiveStepIndex(0);
    setLiveElapsedSec(0);
    setActiveTab("killchain");
    setLiveSocLogs([]);

    const steps = selectedScenario.killChainSteps;
    steps.forEach((_, idx) => {
      setTimeout(() => {
        setActiveStepIndex(idx);
        if (idx === steps.length - 1) {
          setTimeout(() => {
            setIsSimulating(false);
            setSimulationCompleted(true);
            try {
              confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
            } catch (e) {}
          }, 600);
        }
      }, (idx + 1) * 900);
    });
  };

  const handleStartRealTimeRunEvent = () => {
    // 1. Strict Architectural Pre-Flight Verification
    const validation = validateCanRunLiveTest(company.id);
    if (!validation.allowed) {
      // DO NOT RUN LIVE TEST
      setArchErrorMissingReqs(validation.missingRequirements);
      setArchErrorMessage(validation.errorMessage || "");
      setShowArchErrorModal(true);
      return;
    }

    setIsRealTimeLive(true);
    setIsPaused(false);
    setIsSimulating(true);
    setSimulationCompleted(false);
    setActiveStepIndex(0);
    setLiveElapsedSec(0);
    setActiveTab("killchain");
    
    // Seed initial event
    setLiveSocLogs([
      {
        id: "init-0",
        timestamp: new Date().toLocaleTimeString(),
        level: "INFO",
        message: `[SOC Event Stream Initialized] Connected to live enterprise architecture pipeline. Monitoring vector: ${selectedScenario.name}`,
        sourceIp: "Internal Sensor-01 (Verified Gateway)",
        targetService: selectedScenario.targetVector,
      }
    ]);

    const steps = selectedScenario.killChainSteps;
    // Advance each step with a realistic 3.5s pacing for real-time live event observation
    steps.forEach((_, idx) => {
      setTimeout(() => {
        setActiveStepIndex(idx);
        if (idx === steps.length - 1) {
          setTimeout(() => {
            setIsSimulating(false);
            setSimulationCompleted(true);
            try {
              confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
            } catch (e) {}
          }, 2500);
        }
      }, (idx + 1) * 3500);
    });
  };

  const handleConnectDemoSandboxFromModal = () => {
    connectDemoArchitecture(company.id);
    setIntegrationVersion((prev) => prev + 1);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleReset = () => {
    setIsSimulating(false);
    setIsRealTimeLive(false);
    setIsPaused(false);
    setActiveStepIndex(-1);
    setSimulationCompleted(false);
    setLiveElapsedSec(0);
    setLiveSocLogs([]);
  };

  const handleRunMultiVectorStressTest = () => {
    setIsMultiVectorRunning(true);
    setMultiVectorProgress(10);
    setShowMultiVectorModal(true);

    const interval = setInterval(() => {
      setMultiVectorProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          const res = runMultiVectorStressTest(company);
          setMultiVectorResult(res);
          setIsMultiVectorRunning(false);
          try {
            confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
          } catch (e) {}
          return 100;
        }
        return prev + 15;
      });
    }, 250);
  };

  const toggleRemediateControl = (action: string) => {
    setRemediatedControls((prev) => ({
      ...prev,
      [action]: !prev[action]
    }));
  };

  const calculateRemediationSavings = () => {
    const count = Object.values(remediatedControls).filter(Boolean).length;
    return count * Math.round(selectedScenario.financialBreakdown.totalFinancialLossUSD * 0.28);
  };

  const handleDownloadPostMortem = () => {
    const reportText = `# X-ARISE CISO EXECUTIVE INCIDENT POST-MORTEM & LOSS AUDIT
Organization: ${company.name} (${company.industry} Sector)
Annual Revenue: $${(company.revenue / 1000000).toFixed(1)}M USD
Generated On: ${new Date().toUTCString()}

=======================================================
1. SIMULATED ATTACK PROFILE
=======================================================
Attack Name: ${selectedScenario.name}
Threat Classification: ${selectedScenario.category}
Threat Actor Attribution: ${selectedScenario.threatActor || "Unknown Syndicate"}
Severity Rating: ${selectedScenario.severity}
Target Attack Vector: ${selectedScenario.targetVector}
Mean Time to Detect (MTTD): ${Math.round(selectedScenario.mttdSec / 60)} minutes
Mean Time to Respond (MTTR): ${(selectedScenario.mttrSec / 3600).toFixed(1)} hours
Overall Defense Bypass Rate: ${selectedScenario.bypassRatePercent}%

=======================================================
2. TECHNICAL BLAST RADIUS & OPERATIONAL IMPACT
=======================================================
- Production Endpoints Compromised/Encrypted: ${selectedScenario.technicalImpact.endpointsEncryptedOrCompromised}
- Sensitive Customer Database Records Exfiltrated: ${selectedScenario.technicalImpact.recordsExfiltratedCount.toLocaleString()}
- Total Business Operations Downtime: ${selectedScenario.technicalImpact.systemDowntimeHours} hours
- Privileged Service Accounts Hijacked: ${selectedScenario.technicalImpact.serviceAccountsHijacked}
- Regulatory Notifications Mandatory: ${selectedScenario.technicalImpact.regulatoryNotificationTriggered.join(", ") || "None"}
- Affected Infrastructure: ${selectedScenario.technicalImpact.affectedSubnetsOrClouds.join(" | ")}

=======================================================
3. QUANTIFIED POST-SIMULATION FINANCIAL LOSS (FAIR MODEL)
=======================================================
- Business Downtime & Disruption: $${(selectedScenario.financialBreakdown.businessDowntimeUSD / 1000000).toFixed(2)}M
- Ransom Demand / Direct Extortion Outflow: $${(selectedScenario.financialBreakdown.ransomOrExtortionUSD / 1000000).toFixed(2)}M
- Emergency Incident Response DFIR Retainers: $${(selectedScenario.financialBreakdown.incidentResponseDFIRUSD / 1000).toFixed(0)}K
- Regulatory Non-Compliance Fines (GDPR/SEC): $${(selectedScenario.financialBreakdown.regulatoryFinesUSD / 1000000).toFixed(2)}M
- Customer Notification & 2-Yr Identity Protection: $${(selectedScenario.financialBreakdown.customerNotificationUSD / 1000).toFixed(0)}K
- Class-Action Litigation & Settlement Fund: $${(selectedScenario.financialBreakdown.legalAndClassActionUSD / 1000000).toFixed(2)}M
- 12-Month ARR Customer Churn & Reputation Loss: $${(selectedScenario.financialBreakdown.reputationalChurnUSD / 1000000).toFixed(2)}M
- IT Infrastructure Restoration & Re-imaging: $${(selectedScenario.financialBreakdown.assetRestorationUSD / 1000).toFixed(0)}K
-------------------------------------------------------
TOTAL UNMITIGATED GROSS LOSS: $${(selectedScenario.potentialLoss / 1000000).toFixed(2)}M USD
PREVENTED FINANCIAL DAMAGE (ACTIVE CONTROLS): $${(selectedScenario.preventedDamage / 1000000).toFixed(2)}M USD
NET RESIDUAL FINANCIAL EXPOSURE: $${(selectedScenario.financialBreakdown.totalFinancialLossUSD / 1000000).toFixed(2)}M USD
DEFENSIVE SECURITY STACK ROI: ${selectedScenario.financialBreakdown.roiOnSecurityStackUSD}%

=======================================================
4. RECOMMENDED EXECUTIVE MITIGATION ROADMAP
=======================================================
${selectedScenario.recommendedRemediations.map((r, i) => `${i + 1}. ${r}`).join("\n")}

Report certified by X-ARISE Automated Attack Validation Engine.`;

    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `X-ARISE-Incident-PostMortem-${selectedScenario.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: KillChainStep["controlStatus"]) => {
    switch (status) {
      case "Blocked":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-700/50">
            <CheckCircle2 className="h-3.5 w-3.5" /> Blocked
          </span>
        );
      case "Detected":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-700/50">
            <AlertCircle className="h-3.5 w-3.5" /> Detected
          </span>
        );
      case "Bypassed":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-700/50">
            <XCircle className="h-3.5 w-3.5" /> Bypassed
          </span>
        );
    }
  };

  const remediationSavings = calculateRemediationSavings();
  const adjustedResidualLoss = Math.max(0, selectedScenario.financialBreakdown.totalFinancialLossUSD - remediationSavings);

  return (
    <div className="space-y-6">
      {/* Engine Header with Quick Action Bar - 3D Glass Surface */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 specular-highlight">
        <div>
          <div className="flex items-center space-x-2 text-rose-300 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <Flame className="h-4 w-4 text-rose-400 animate-pulse" />
            <span className="bg-rose-500/15 px-2.5 py-0.5 rounded-full border border-rose-400/30">Live Simulation Threat Run</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Simulation Threat Run & Incursion Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Execute weaponized adversary playbooks against defensive controls in real-time. Measure kill-chain efficacy, packet-level IoCs, and quantify residual financial blast radius.
          </p>
        </div>

        {/* Global Multi-Vector Cyber Storm Button */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleRunMultiVectorStressTest}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-rose-950/60 transition-all border border-rose-400/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Zap className="h-4 w-4 text-amber-300 animate-pulse" />
            <span>Simulate All Attacks (Cyber Storm)</span>
          </button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-semibold shrink-0 mr-1">Filter Vectors:</span>
        {["All", "Ransomware", "Zero-Day & Edge", "Supply Chain", "Cloud & API", "Identity & BEC", "OT & APT"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl shrink-0 font-medium transition ${
              categoryFilter === cat
                ? "bg-rose-500/20 text-rose-300 font-bold border border-rose-400/40 shadow-inner"
                : "bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-white/5"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Scenario Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {filteredScenarios.map((sc) => {
          const isSelected = selectedScenario.id === sc.id;
          return (
            <div
              key={sc.id}
              onClick={() => {
                if (!isSimulating) {
                  setSelectedScenario(sc);
                  handleReset();
                }
              }}
              className={`cursor-pointer rounded-2xl p-4 transition-all duration-200 border text-left flex flex-col justify-between ${
                isSelected
                  ? "glass-panel bg-rose-950/40 border-rose-400/50 shadow-xl shadow-rose-950/30 ring-1 ring-rose-400/30 scale-[1.01]"
                  : "bg-slate-950/60 border-white/5 hover:border-white/15 hover:bg-slate-900/80"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-500/30 truncate">
                    {sc.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      sc.severity === "CRITICAL"
                        ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        : sc.severity === "HIGH"
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    }`}
                  >
                    {sc.severity}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">{sc.name}</h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">Actor: {sc.threatActor || "Unknown"}</p>
              </div>

              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-mono">Bypass: {sc.bypassRatePercent}%</span>
                <span className="text-emerald-400 font-mono font-bold">
                  -${(sc.preventedDamage / 1000000).toFixed(1)}M Saved
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Simulation Viewport */}
      <div className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-7 space-y-6 shadow-2xl specular-highlight">
        {/* Active Scenario Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold uppercase text-rose-300 bg-rose-950/80 px-3 py-0.5 rounded-full border border-rose-400/30">
                {selectedScenario.category}
              </span>
              <span className="text-xs text-slate-400">• Attacking Vector: <span className="text-slate-200 font-mono">{selectedScenario.targetVector}</span></span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-1">{selectedScenario.name}</h3>
          </div>

          {/* Action Control Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            {!isSimulating && (
              <>
                <button
                  onClick={handleStartFastSimulation}
                  className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-b from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-rose-950/50 transition active:scale-95 border border-rose-400/30 cursor-pointer"
                  title="Run accelerated scenario simulation drill"
                >
                  <Play className="h-4 w-4 fill-white" />
                  <span>Run Fast Simulation</span>
                </button>
                <button
                  onClick={handleStartRealTimeRunEvent}
                  className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg transition active:scale-95 border cursor-pointer ${
                    currentIntegration.isHookedUp
                      ? "bg-gradient-to-b from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white shadow-cyan-950/50 border-cyan-400/30"
                      : "bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-amber-500/40 shadow-slate-950/50"
                  }`}
                  title={
                    currentIntegration.isHookedUp
                      ? "Stream actual real-time SOC incident telemetry and packets"
                      : "Architecture Not Hooked Up - Click to configure integration"
                  }
                >
                  <Radio className={`h-4 w-4 ${currentIntegration.isHookedUp ? "animate-pulse text-cyan-200" : "text-amber-400"}`} />
                  <span>Actual Real-Time Run Event</span>
                  {!currentIntegration.isHookedUp && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30">
                      Requires Hookup
                    </span>
                  )}
                </button>
              </>
            )}

            {isSimulating && (
              <div className="flex items-center space-x-2">
                <div className={`flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold border ${
                  isRealTimeLive 
                    ? "bg-cyan-950/60 border-cyan-500/50 text-cyan-300 shadow-lg shadow-cyan-950/40" 
                    : "bg-rose-950/60 border-rose-500/50 text-rose-300 shadow-lg shadow-rose-950/40"
                }`}>
                  <Radio className={`h-4 w-4 animate-spin ${isRealTimeLive ? "text-cyan-400" : "text-rose-400"}`} />
                  <span>{isRealTimeLive ? "Live SOC Stream Active" : "Fast Simulation"} ({liveElapsedSec}s)</span>
                </div>
                {isRealTimeLive && (
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-white border border-white/10"
                  >
                    {isPaused ? "Resume" : "Pause"}
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                  title="Cancel & Reset"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            )}

            {simulationCompleted && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleStartFastSimulation}
                  className="flex items-center space-x-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-semibold text-xs border border-white/10 transition"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Re-run Sim</span>
                </button>
                <button
                  onClick={handleStartRealTimeRunEvent}
                  className="flex items-center space-x-1.5 px-3 py-2 bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 rounded-xl font-bold text-xs border border-cyan-500/40 transition"
                >
                  <Radio className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Live Event Run</span>
                </button>
                <button
                  onClick={handleDownloadPostMortem}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition shadow-md border border-emerald-400/30"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export Audit</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab("killchain")}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === "killchain"
                  ? "bg-rose-500/20 text-rose-300 border border-rose-400/40 shadow-inner"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Kill-Chain Telemetry ({selectedScenario.killChainSteps.length} Stages)</span>
            </button>
            <button
              onClick={() => setActiveTab("technical")}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === "technical"
                  ? "bg-rose-500/20 text-rose-300 border border-rose-400/40 shadow-inner"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Server className="h-3.5 w-3.5" />
              <span>Technical Blast Radius & Impact</span>
            </button>
            <button
              onClick={() => setActiveTab("financials")}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === "financials"
                  ? "bg-rose-500/20 text-rose-300 border border-rose-400/40 shadow-inner"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <DollarSign className="h-3.5 w-3.5" />
              <span>Post-Simulation Financial Loss</span>
            </button>
            <button
              onClick={() => setActiveTab("remediation")}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === "remediation"
                  ? "bg-rose-500/20 text-rose-300 border border-rose-400/40 shadow-inner"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Control Fixer & ROI</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center space-x-3 text-xs font-mono text-slate-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
            <span>MTTD: <strong className="text-white">{Math.round(selectedScenario.mttdSec / 60)}m</strong></span>
            <span>•</span>
            <span>MTTR: <strong className="text-white">{(selectedScenario.mttrSec / 3600).toFixed(1)}h</strong></span>
          </div>
        </div>

        {/* TAB 1: Kill-Chain Step-by-Step Telemetry */}
        {activeTab === "killchain" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {selectedScenario.killChainSteps.map((step, idx) => {
                const isStepActive = isSimulating && activeStepIndex === idx;
                const isStepPassed = activeStepIndex > idx || simulationCompleted;
                const isStepPending = !simulationCompleted && activeStepIndex < idx;

                return (
                  <div
                    key={idx}
                    className={`rounded-xl p-4 border transition-all ${
                      isStepActive
                        ? "bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/30 scale-[1.01]"
                        : isStepPassed
                        ? "bg-slate-950/80 border-slate-800"
                        : "bg-slate-950/40 border-slate-900 opacity-60"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono shrink-0 ${
                            isStepPassed
                              ? "bg-slate-800 text-slate-300"
                              : isStepActive
                              ? "bg-rose-600 text-white animate-bounce"
                              : "bg-slate-900 text-slate-600"
                          }`}
                        >
                          0{step.step}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                              {step.stage}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">({step.durationSec}s)</span>
                          </div>
                          <p className="text-xs text-slate-300 mt-0.5">{step.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 self-end sm:self-auto shrink-0">
                        <div className="text-right">
                          <div className="text-[10px] text-slate-500 uppercase font-semibold">Tested Control</div>
                          <div className="text-xs font-mono font-medium text-slate-300">{step.testedControl}</div>
                        </div>
                        {isStepPassed ? getStatusBadge(step.controlStatus) : isStepActive ? (
                          <span className="text-xs text-amber-400 font-mono animate-pulse">Testing Control...</span>
                        ) : (
                          <span className="text-xs text-slate-600 font-mono">Pending</span>
                        )}
                      </div>
                    </div>

                    {/* IoC Forensic Log */}
                    {step.iocTelemetry && (isStepPassed || isStepActive) && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-start space-x-2 text-[11px] font-mono text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg">
                        <Terminal className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span><strong className="text-cyan-400">IoC / Forensic Signal:</strong> {step.iocTelemetry}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Real-Time Live SOC Event Console */}
            {liveSocLogs.length > 0 && (
              <div className="mt-6 rounded-2xl bg-slate-950/90 border border-cyan-500/30 p-4 shadow-xl space-y-3 specular-highlight">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-xs font-mono font-bold uppercase text-cyan-300 tracking-wider">
                      Live Real-Time SOC Incident Event Stream
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                    {liveSocLogs.length} Events Captured
                  </span>
                </div>
                <div className="space-y-1.5 font-mono text-[11px] max-h-48 overflow-y-auto pr-1">
                  {liveSocLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start justify-between gap-3 p-2 rounded-lg bg-slate-900/80 border border-white/5 hover:border-cyan-500/30 transition"
                    >
                      <div className="flex items-center space-x-2 min-w-0">
                        <span className="text-[10px] text-slate-500 shrink-0">{log.timestamp}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                            log.level === "BLOCKED"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                              : log.level === "CRITICAL"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                              : log.level === "WARN"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                              : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                          }`}
                        >
                          {log.level}
                        </span>
                        <span className="text-slate-300 truncate">{log.message}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 shrink-0 font-mono">
                        {log.sourceIp} &rarr; {log.targetService}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Technical Blast Radius & Operational Impact */}
        {activeTab === "technical" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Endpoints Encrypted / Down</span>
                  <Server className="h-4 w-4 text-rose-400" />
                </div>
                <div className="text-2xl font-extrabold text-white mt-1 font-mono">
                  {selectedScenario.technicalImpact.endpointsEncryptedOrCompromised} <span className="text-xs font-normal text-slate-500">hosts</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Workstations & Hypervisors</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Exfiltrated Records</span>
                  <Database className="h-4 w-4 text-amber-400" />
                </div>
                <div className="text-2xl font-extrabold text-amber-400 mt-1 font-mono">
                  {selectedScenario.technicalImpact.recordsExfiltratedCount.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">PII, PHI & Banking Rows</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Downtime Duration</span>
                  <Clock className="h-4 w-4 text-purple-400" />
                </div>
                <div className="text-2xl font-extrabold text-purple-400 mt-1 font-mono">
                  {selectedScenario.technicalImpact.systemDowntimeHours} <span className="text-xs font-normal text-slate-500">hours</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">~{(selectedScenario.technicalImpact.systemDowntimeHours / 24).toFixed(1)} Days Outage</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Service Accounts Hijacked</span>
                  <Lock className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-extrabold text-cyan-400 mt-1 font-mono">
                  {selectedScenario.technicalImpact.serviceAccountsHijacked}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">OAuth & Domain Admin Tokens</div>
              </div>
            </div>

            {/* Regulatory Triggers and Forensic IoCs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase">
                  <AlertCircle className="h-4 w-4" />
                  <span>Mandatory Regulatory Reporting Triggers</span>
                </div>
                <div className="space-y-2">
                  {selectedScenario.technicalImpact.regulatoryNotificationTriggered.map((reg, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs text-slate-300 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                      <span>{reg}</span>
                    </div>
                  ))}
                  {selectedScenario.technicalImpact.regulatoryNotificationTriggered.length === 0 && (
                    <div className="text-xs text-slate-500">No mandatory cross-border filings triggered.</div>
                  )}
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase">
                  <Terminal className="h-4 w-4" />
                  <span>Observed Forensic IoCs & Artifacts</span>
                </div>
                <div className="space-y-1.5 font-mono text-[11px] text-slate-300">
                  {selectedScenario.technicalImpact.forensicIoCs.map((ioc, i) => (
                    <div key={i} className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 truncate">
                      {ioc}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Post-Simulation Financial Loss Model */}
        {activeTab === "financials" && (
          <div className="space-y-6">
            {/* Top Level Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400 font-semibold">Unmitigated Gross Loss (0 Controls)</div>
                <div className="text-2xl font-extrabold text-rose-400 mt-1 font-mono">
                  ${(selectedScenario.potentialLoss / 1000000).toFixed(2)}M USD
                </div>
                <div className="text-[11px] text-slate-500 mt-1">If all defenses were non-existent</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400 font-semibold">Prevented Financial Damage</div>
                <div className="text-2xl font-extrabold text-emerald-400 mt-1 font-mono">
                  ${(selectedScenario.preventedDamage / 1000000).toFixed(2)}M USD
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Saved by active blocked killchain controls</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400 font-semibold">Actual Residual Financial Loss</div>
                <div className="text-2xl font-extrabold text-amber-400 mt-1 font-mono">
                  ${(selectedScenario.financialBreakdown.totalFinancialLossUSD / 1000000).toFixed(2)}M USD
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Empirical residual impact post-mitigation</div>
              </div>
            </div>

            {/* Granular Loss Category Breakdown Table */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Granular FAIR Model Cost Factor Analysis
                </h4>
                <span className="text-xs text-slate-400 font-mono">Company Rev: ${(company.revenue / 1000000).toFixed(1)}M</span>
              </div>

              <div className="divide-y divide-slate-800/60 text-xs">
                {[
                  {
                    name: "1. Business Interruption & Downtime Cost",
                    desc: `${selectedScenario.technicalImpact.systemDowntimeHours} hours operational downtime & worker productivity halt`,
                    val: selectedScenario.financialBreakdown.businessDowntimeUSD,
                    color: "text-rose-400"
                  },
                  {
                    name: "2. Ransom Demand & Fraud Extortion Risk",
                    desc: "Estimated extortion demand or direct wire routing loss",
                    val: selectedScenario.financialBreakdown.ransomOrExtortionUSD,
                    color: "text-amber-400"
                  },
                  {
                    name: "3. Emergency DFIR & Containment Retainer",
                    desc: "External forensic incident responders, malware containment & crisis team",
                    val: selectedScenario.financialBreakdown.incidentResponseDFIRUSD,
                    color: "text-blue-400"
                  },
                  {
                    name: "4. Regulatory Fines & Compliance Penalties",
                    desc: "Mandatory GDPR Art. 83, SEC non-disclosure, HIPAA enforcement penalties",
                    val: selectedScenario.financialBreakdown.regulatoryFinesUSD,
                    color: "text-purple-400"
                  },
                  {
                    name: "5. Customer Notification & 2-Year Identity Protection",
                    desc: "Certified postal mail, call center provisioning, and credit monitoring ($27.50/record)",
                    val: selectedScenario.financialBreakdown.customerNotificationUSD,
                    color: "text-cyan-400"
                  },
                  {
                    name: "6. Class-Action Litigation & Settlement Fund",
                    desc: "Defense legal fees, deposition costs, and consumer class settlement escrow",
                    val: selectedScenario.financialBreakdown.legalAndClassActionUSD,
                    color: "text-indigo-400"
                  },
                  {
                    name: "7. Reputational Churn & 12-Month ARR Erosion",
                    desc: "Client contract non-renewals and elevated customer acquisition cost (CAC)",
                    val: selectedScenario.financialBreakdown.reputationalChurnUSD,
                    color: "text-rose-300"
                  },
                  {
                    name: "8. IT Asset Restoration & Clean Re-imaging",
                    desc: `${selectedScenario.technicalImpact.endpointsEncryptedOrCompromised} workstations/servers wiped, OS reloaded & backups restored`,
                    val: selectedScenario.financialBreakdown.assetRestorationUSD,
                    color: "text-emerald-400"
                  }
                ].map((item, i) => (
                  <div key={i} className="p-3.5 flex items-center justify-between hover:bg-slate-900/50 transition">
                    <div>
                      <div className="font-bold text-white">{item.name}</div>
                      <div className="text-[11px] text-slate-400">{item.desc}</div>
                    </div>
                    <div className={`font-mono font-bold text-sm ${item.color}`}>
                      ${(item.val / 1000000).toFixed(2)}M
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Remediation Gap Fixer & Dynamic ROI Simulator */}
        {activeTab === "remediation" && (
          <div className="space-y-6">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase mb-2">
                <Sparkles className="h-4 w-4" />
                <span>Interactive Security Remediation Simulator</span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Toggle the proposed architectural fixes below to immediately recalculate reduced financial loss and examine the return on investment (ROI).
              </p>

              <div className="space-y-3">
                {selectedScenario.recommendedRemediations.map((rem, i) => {
                  const isFixed = remediatedControls[rem] || false;
                  return (
                    <div
                      key={i}
                      onClick={() => toggleRemediateControl(rem)}
                      className={`cursor-pointer p-3.5 rounded-xl border transition flex items-center justify-between ${
                        isFixed
                          ? "bg-emerald-950/40 border-emerald-500/60 text-emerald-300"
                          : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                            isFixed ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {isFixed ? "✓" : "+"}
                        </div>
                        <span className="text-xs font-medium">{rem}</span>
                      </div>

                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {isFixed ? "Remediated (-28% Risk)" : "Click to Deploy"}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Recalculated Summary */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-400">Recalculated Residual Loss Post-Remediation:</div>
                  <div className="text-xl font-extrabold text-emerald-400 font-mono">
                    ${(adjustedResidualLoss / 1000000).toFixed(2)}M USD
                    {remediationSavings > 0 && (
                      <span className="text-xs font-normal text-emerald-300 ml-2">
                        (-${(remediationSavings / 1000000).toFixed(2)}M Savings)
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleDownloadPostMortem}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition"
                >
                  <FileText className="h-4 w-4 text-cyan-400" />
                  <span>Generate Board Remediation Memo</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Multi-Vector Stress Test Modal */}
      {showMultiVectorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel border border-white/10 rounded-3xl w-full max-w-4xl p-6 sm:p-7 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto specular-highlight">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Full Enterprise Cyber Storm Stress-Test</h3>
                  <p className="text-xs text-slate-300">Simulating 14 attack vectors across all enterprise attack surfaces</p>
                </div>
              </div>
              <button
                onClick={() => setShowMultiVectorModal(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl text-xs bg-white/5 border border-white/10 transition"
              >
                ✕ Close
              </button>
            </div>

            {/* Progress Bar */}
            {isMultiVectorRunning && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-slate-300">
                  <span>Executing Multi-Vector Attack Engines...</span>
                  <span className="text-rose-400 font-bold">{multiVectorProgress}%</span>
                </div>
                <div className="w-full bg-slate-950/80 rounded-full h-3 overflow-hidden border border-white/10">
                  <div
                    className="bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${multiVectorProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Completed Multi-Vector Results */}
            {multiVectorResult && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/10 text-center">
                    <div className="text-xs text-slate-400 uppercase font-semibold">Enterprise Survival Score</div>
                    <div className="text-3xl font-extrabold text-cyan-400 font-mono mt-1">
                      {multiVectorResult.enterpriseSurvivalScore} / 100
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">{multiVectorResult.resilienceRating}</div>
                  </div>

                  <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/10 text-center">
                    <div className="text-xs text-slate-400 uppercase font-semibold">Total Potential Loss</div>
                    <div className="text-2xl font-extrabold text-rose-400 font-mono mt-1">
                      ${(multiVectorResult.totalGrossPotentialLossUSD / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">Gross Cumulative Exposure</div>
                  </div>

                  <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/10 text-center">
                    <div className="text-xs text-slate-400 uppercase font-semibold">Prevented Loss</div>
                    <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
                      ${(multiVectorResult.totalPreventedFinancialDamageUSD / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">Saved by Security Stack</div>
                  </div>

                  <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/10 text-center">
                    <div className="text-xs text-slate-400 uppercase font-semibold">Mean Time to Detect</div>
                    <div className="text-2xl font-extrabold text-purple-400 font-mono mt-1">
                      {Math.round(multiVectorResult.overallMttdSec / 60)}m
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">MTTR: {(multiVectorResult.overallMttrSec / 3600).toFixed(1)}h</div>
                  </div>
                </div>

                {/* Vector Results Breakdown Table */}
                <div className="bg-slate-950/60 rounded-2xl border border-white/10 overflow-hidden">
                  <div className="p-3.5 bg-slate-900/80 border-b border-white/10 text-xs font-bold text-slate-200">
                    Attack Vector Resilience Matrix (14 Scenarios Tested)
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-white/5 text-xs font-mono">
                    {multiVectorResult.vectorResults.map((v) => (
                      <div key={v.id} className="p-3.5 flex items-center justify-between hover:bg-slate-900/40 transition">
                        <div>
                          <div className="font-bold text-white">{v.name}</div>
                          <div className="text-[10px] text-slate-400">{v.category} • Bypassed: {v.bypassedSteps}/{v.totalSteps} stages</div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              v.status === "Blocked"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : v.status === "Partially Contained"
                                ? "bg-amber-500/20 text-amber-400"
                                : "bg-rose-500/20 text-rose-400"
                            }`}
                          >
                            {v.status}
                          </span>
                          <span className="text-emerald-400 font-bold">
                            +${(v.preventedUSD / 1000000).toFixed(1)}M
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Architecture Connection Error Modal */}
      <ArchitectureNotHookedUpModal
        isOpen={showArchErrorModal}
        onClose={() => setShowArchErrorModal(false)}
        company={company}
        missingRequirements={archErrorMissingReqs}
        errorMessage={archErrorMessage}
        onOpenIntegrationModal={() => {
          if (onOpenIntegration) onOpenIntegration();
        }}
        onConnectDemoArchitecture={handleConnectDemoSandboxFromModal}
      />
    </div>
  );
}
