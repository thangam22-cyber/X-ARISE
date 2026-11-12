import { useState, useEffect, useRef } from "react";
import {
  X,
  Activity,
  ShieldAlert,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Radio,
  Clock,
  Terminal,
  Play,
  Pause,
  RotateCcw,
  Server,
  Lock,
  Wifi,
  ExternalLink,
  ChevronRight,
  Network,
  AlertOctagon
} from "lucide-react";
import { CompanyProfile } from "../types";
import { validateCanRunLiveTest, connectDemoArchitecture, getCompanyIntegrationState } from "../utils/architectureIntegrations";
import { ArchitectureNotHookedUpModal } from "./ArchitectureNotHookedUpModal";
import confetti from "canvas-confetti";

export interface LiveStreamEvent {
  id: string;
  timestamp: string;
  title: string;
  category: "Zero-Day" | "Ransomware" | "Supply Chain" | "Identity" | "API / Cloud" | "DDoS";
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  severityScore: number;
  sourceIp: string;
  targetAsset: string;
  exposureSurgeUSD: number;
  status: "Active" | "Investigating" | "Contained" | "Blocked";
  logMessage: string;
  mitigationPlaybook: string;
}

interface RealTimeEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyProfile;
  onApplyEventImpact: (exposureDeltaUSD: number, eventName: string) => void;
  onOpenIntegration?: () => void;
}

const PRESET_DRILL_SCENARIOS = [
  {
    id: "zero-day-2026",
    title: "Zero-Day Edge RCE (CVE-2026-9041)",
    severity: "CRITICAL 9.8",
    category: "Zero-Day",
    vector: "Remote Code Execution via Auth Gateway",
    blastRadiusDeltaMillions: 3.45,
    sourceIp: "185.220.101.44 (Tor Exit Node)",
    targetAsset: "auth-gateway-cluster.internal",
    impactDesc: "Exploit payload observed bypassing perimeter WAF. Lateral movement attempt initiated against primary data lake and user credential database.",
    mitigationAction: "Trigger SOAR Playbook: Revoke all active API tokens, isolate auth gateway VPC, and force hardware MFA re-authentication."
  },
  {
    id: "msp-breach",
    title: "Tier-1 MSP Remote Support Compromise",
    severity: "CRITICAL 9.2",
    category: "Supply Chain",
    vector: "Supply Chain / Stolen Admin Credentials",
    blastRadiusDeltaMillions: 5.20,
    sourceIp: "94.156.65.12 (External Cloud Relay)",
    targetAsset: "core-domain-dc01.corp",
    impactDesc: "Third-party MSP technician account hijacked with remote RDP tunnel established to core domain controllers and database hypervisors.",
    mitigationAction: "Immediately sever site-to-site IPsec VPN tunnel, revoke federated SAML assertions, and kill active RDP sessions."
  },
  {
    id: "deepfake-bec",
    title: "AI Voice Deepfake BEC Wire Attack",
    severity: "HIGH 8.5",
    category: "Identity",
    vector: "Synthetic Voice impersonating CFO to Treasury",
    blastRadiusDeltaMillions: 1.80,
    sourceIp: "198.51.100.78 (Spoofed SIP Trunk)",
    targetAsset: "treasury-wire-portal.fin",
    impactDesc: "Real-time generative voice clone attempted fraudulent $1.8M wire routing approval via automated phone channel and forged confirmation hash.",
    mitigationAction: "Enforce out-of-band cryptographic signature verification on all wires exceeding $100k and lock treasury approval pipeline."
  },
  {
    id: "snowflake-iam",
    title: "Cloud IAM Token Exfiltration & S3 Dump",
    severity: "CRITICAL 9.4",
    category: "API / Cloud",
    vector: "Compromised Service Account JWT Token",
    blastRadiusDeltaMillions: 4.10,
    sourceIp: "104.244.42.1 (Anonymized Proxy)",
    targetAsset: "prod-analytics-lake-us-east-1",
    impactDesc: "Stolen Long-Lived OAuth refresh token used to execute bulk SELECT * queries across 1.4 million customer financial tables.",
    mitigationAction: "Rotate IAM master KMS keys, terminate all federated OAuth sessions, and enable IP-restricted VPC endpoints."
  }
];

const STREAMING_TEMPLATES = [
  {
    title: "Suspicious Kerberoasting Ticket Request",
    category: "Identity" as const,
    severity: "HIGH" as const,
    severityScore: 8.4,
    sourceIp: "10.0.14.82",
    targetAsset: "active-directory-krbtgt",
    exposureSurgeUSD: 850000,
    logMessage: "TGS-REQ for SPN MSSQLSvc/sql-cluster.prod with RC4_HMAC encryption downgrade detected from unmanaged workstation.",
    mitigationPlaybook: "Isolate host 10.0.14.82 and rotate kerberos service ticket passwords."
  },
  {
    title: "BOLA / IDOR API Parameter Tampering",
    category: "API / Cloud" as const,
    severity: "CRITICAL" as const,
    severityScore: 9.1,
    sourceIp: "45.154.255.89",
    targetAsset: "api.customer-portal/v2/accounts",
    exposureSurgeUSD: 1450000,
    logMessage: "Automated sequence iterating through 85,000 tenant IDs returning 200 OK with sensitive PII payload.",
    mitigationPlaybook: "Deploy rate-limit rule & inject JWT scope validation filter on API gateway."
  },
  {
    title: "Cobalt Strike Beacon Ingress Observed",
    category: "Zero-Day" as const,
    severity: "CRITICAL" as const,
    severityScore: 9.6,
    sourceIp: "193.106.191.22",
    targetAsset: "endpoint-ws-9021.finance",
    exposureSurgeUSD: 2200000,
    logMessage: "Encrypted HTTPS beaconing with 60s jitter to known threat actor C2 profile. Process injection into svchost.exe.",
    mitigationPlaybook: "Trigger automated EDR network containment and memory process dump."
  },
  {
    title: "Unauthorized S3 Bucket Policy Modification",
    category: "API / Cloud" as const,
    severity: "HIGH" as const,
    severityScore: 8.7,
    sourceIp: "185.191.171.12",
    targetAsset: "s3://prod-backup-snapshots-archive",
    exposureSurgeUSD: 1200000,
    logMessage: "PutBucketPolicy API invoked granting s3:GetObject to Principal: * without MFA authorization.",
    mitigationPlaybook: "Apply SCP deny policy and restore default private bucket ACL."
  },
  {
    title: "DDoS HTTP/2 Rapid Reset Stream Spike",
    category: "DDoS" as const,
    severity: "MEDIUM" as const,
    severityScore: 7.2,
    sourceIp: "Distributed Botnet (14,200 Nodes)",
    targetAsset: "edge-ingress-lb.global",
    exposureSurgeUSD: 450000,
    logMessage: "RST_STREAM frame flood exceeding 180,000 req/sec attempting resource exhaustion on reverse proxy.",
    mitigationPlaybook: "Activate Cloudflare under-attack rate mitigation and reset HTTP/2 stream multiplexing."
  }
];

export function RealTimeEventModal({
  isOpen,
  onClose,
  company,
  onApplyEventImpact,
  onOpenIntegration
}: RealTimeEventModalProps) {
  const [activeMode, setActiveMode] = useState<"realtime" | "drill">("realtime");

  // Architecture Connection Error Modal State
  const [showArchErrorModal, setShowArchErrorModal] = useState<boolean>(false);
  const [archErrorMissingReqs, setArchErrorMissingReqs] = useState<string[]>([]);
  const [archErrorMessage, setArchErrorMessage] = useState<string>("");
  const [integrationVersion, setIntegrationVersion] = useState<number>(0);

  const currentIntegration = getCompanyIntegrationState(company.id);

  // Real-Time Streaming State
  const [isLiveStreamActive, setIsLiveStreamActive] = useState<boolean>(true);
  const [streamEvents, setStreamEvents] = useState<LiveStreamEvent[]>([
    {
      id: "evt-init-1",
      timestamp: new Date(Date.now() - 45000).toLocaleTimeString(),
      title: "Cobalt Strike Beacon Ingress Observed",
      category: "Zero-Day",
      severity: "CRITICAL",
      severityScore: 9.6,
      sourceIp: "193.106.191.22",
      targetAsset: "endpoint-ws-9021.finance",
      exposureSurgeUSD: 2200000,
      status: "Active",
      logMessage: "Encrypted HTTPS beaconing with 60s jitter to known threat actor C2 profile. Process injection into svchost.exe.",
      mitigationPlaybook: "Trigger automated EDR network containment and memory process dump."
    },
    {
      id: "evt-init-2",
      timestamp: new Date(Date.now() - 120000).toLocaleTimeString(),
      title: "Suspicious Kerberoasting Ticket Request",
      category: "Identity",
      severity: "HIGH",
      severityScore: 8.4,
      sourceIp: "10.0.14.82",
      targetAsset: "active-directory-krbtgt",
      exposureSurgeUSD: 850000,
      status: "Contained",
      logMessage: "TGS-REQ for SPN MSSQLSvc/sql-cluster.prod with RC4_HMAC encryption downgrade detected from unmanaged workstation.",
      mitigationPlaybook: "Isolate host 10.0.14.82 and rotate kerberos service ticket passwords."
    }
  ]);
  const [selectedStreamEventId, setSelectedStreamEventId] = useState<string>("evt-init-1");
  const [tickerTime, setTickerTime] = useState<string>(new Date().toLocaleTimeString());

  // Manual Drill Simulation State
  const [selectedDrillIndex, setSelectedDrillIndex] = useState<number>(0);
  const [isDrillInjecting, setIsDrillInjecting] = useState<boolean>(false);
  const [drillTriggered, setDrillTriggered] = useState<boolean>(false);
  const [drillContained, setDrillContained] = useState<boolean>(false);

  // Live Auto-Stream Timer
  useEffect(() => {
    if (!isOpen) return;

    const clockInterval = setInterval(() => {
      setTickerTime(new Date().toLocaleTimeString());
    }, 1000);

    let eventInterval: NodeJS.Timeout;
    if (isLiveStreamActive && activeMode === "realtime") {
      eventInterval = setInterval(() => {
        const randTemplate = STREAMING_TEMPLATES[Math.floor(Math.random() * STREAMING_TEMPLATES.length)];
        const newEvt: LiveStreamEvent = {
          id: `evt-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          title: randTemplate.title,
          category: randTemplate.category,
          severity: randTemplate.severity,
          severityScore: randTemplate.severityScore,
          sourceIp: randTemplate.sourceIp,
          targetAsset: randTemplate.targetAsset,
          exposureSurgeUSD: randTemplate.exposureSurgeUSD,
          status: "Active",
          logMessage: randTemplate.logMessage,
          mitigationPlaybook: randTemplate.mitigationPlaybook
        };

        setStreamEvents((prev) => [newEvt, ...prev.slice(0, 19)]);
      }, 7000);
    }

    return () => {
      clearInterval(clockInterval);
      if (eventInterval) clearInterval(eventInterval);
    };
  }, [isOpen, isLiveStreamActive, activeMode]);

  if (!isOpen) return null;

  const currentDrill = PRESET_DRILL_SCENARIOS[selectedDrillIndex];
  const activeStreamEvent = streamEvents.find((e) => e.id === selectedStreamEventId) || streamEvents[0];
  const activeThreatsCount = streamEvents.filter((e) => e.status === "Active").length;
  const totalLiveSurgeUSD = streamEvents
    .filter((e) => e.status === "Active")
    .reduce((acc, e) => acc + e.exposureSurgeUSD, 0);

  const handleContainStreamEvent = (id: string) => {
    setStreamEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "Contained" } : e))
    );
    try {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleTriggerDrill = () => {
    // Validate architecture connection before injecting live drill test
    const validation = validateCanRunLiveTest(company.id);
    if (!validation.allowed) {
      setArchErrorMissingReqs(validation.missingRequirements);
      setArchErrorMessage(validation.errorMessage || "");
      setShowArchErrorModal(true);
      return; // DO NOT RUN LIVE TEST
    }

    setIsDrillInjecting(true);
    setTimeout(() => {
      setIsDrillInjecting(false);
      setDrillTriggered(true);
      setDrillContained(false);
      onApplyEventImpact(currentDrill.blastRadiusDeltaMillions * 1000000, currentDrill.title);
    }, 1000);
  };

  const handleConnectDemoSandboxFromModal = () => {
    connectDemoArchitecture(company.id);
    setIntegrationVersion((prev) => prev + 1);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleContainDrill = () => {
    setDrillContained(true);
    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-rose-950 text-rose-400 flex items-center justify-center border border-rose-800/40">
              <Activity className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-base">Real-Time Threat Incursion Engine</h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/40 animate-pulse">
                  LIVE TELEMETRY
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span>Target Org: <strong className="text-slate-200">{company.name}</strong></span>
                <span>•</span>
                <span className="font-mono text-cyan-400">{tickerTime}</span>
                <span>•</span>
                <button
                  onClick={() => {
                    if (onOpenIntegration) onOpenIntegration();
                  }}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition cursor-pointer ${
                    currentIntegration.isHookedUp
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse"
                  }`}
                >
                  <Network className="h-3 w-3" />
                  {currentIntegration.isHookedUp ? "Arch Connected" : "Arch Unhooked (Click to Fix)"}
                </button>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setActiveMode("realtime")}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
                  activeMode === "realtime"
                    ? "bg-rose-600/30 text-rose-300 border border-rose-500/40 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Radio className="h-3.5 w-3.5" />
                <span>Live Event Stream</span>
              </button>
              <button
                onClick={() => setActiveMode("drill")}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
                  activeMode === "drill"
                    ? "bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Zap className="h-3.5 w-3.5" />
                <span>Manual Drill Simulator</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* MODE 1: Continuous Real-Time Streaming Feed */}
        {activeMode === "realtime" && (
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {/* Top Quick Status Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 font-semibold">Active Incursions</div>
                <div className="text-xl font-bold text-rose-400 font-mono mt-0.5">
                  {activeThreatsCount} <span className="text-xs font-normal text-slate-500">uncontained</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 font-semibold">Active Loss Surge</div>
                <div className="text-xl font-bold text-amber-400 font-mono mt-0.5">
                  +${(totalLiveSurgeUSD / 1000000).toFixed(2)}M
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 font-semibold">Mean Time to Detect (MTTD)</div>
                <div className="text-xl font-bold text-purple-400 font-mono mt-0.5">
                  18.2 <span className="text-xs font-normal text-slate-500">sec</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400 font-semibold">Live Feed Status</div>
                  <div className="text-xs font-mono font-bold text-emerald-400 mt-0.5 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    {isLiveStreamActive ? "Streaming" : "Paused"}
                  </div>
                </div>
                <button
                  onClick={() => setIsLiveStreamActive(!isLiveStreamActive)}
                  className={`p-2 rounded-lg text-xs font-bold border transition ${
                    isLiveStreamActive
                      ? "bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800"
                      : "bg-emerald-600 text-white border-emerald-500"
                  }`}
                  title={isLiveStreamActive ? "Pause Feed" : "Resume Feed"}
                >
                  {isLiveStreamActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Split Screen: Live Event Feed & Active Incursion Telemetry Detail */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* Left Column: Streaming Events Feed List */}
              <div className="lg:col-span-5 bg-slate-950 rounded-xl border border-slate-800 p-3 space-y-2 max-h-80 overflow-y-auto">
                <div className="flex items-center justify-between pb-1 border-b border-slate-800/80 text-[11px] text-slate-400 font-mono">
                  <span>LIVE EVENT TELEMETRY</span>
                  <span>{streamEvents.length} events logged</span>
                </div>

                {streamEvents.map((evt) => {
                  const isSelected = activeStreamEvent?.id === evt.id;
                  return (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedStreamEventId(evt.id)}
                      className={`cursor-pointer p-3 rounded-lg border text-left transition ${
                        isSelected
                          ? "bg-rose-950/40 border-rose-500/80 shadow-md"
                          : evt.status === "Active"
                          ? "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                          : "bg-slate-900/40 border-slate-800/40 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-500">{evt.timestamp}</span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                            evt.status === "Active"
                              ? "bg-rose-500/20 text-rose-400"
                              : "bg-emerald-500/20 text-emerald-400"
                          }`}
                        >
                          {evt.status}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-white mt-1 line-clamp-1">{evt.title}</h5>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
                        <span>{evt.category}</span>
                        <span className="text-amber-400">+${(evt.exposureSurgeUSD / 1000).toFixed(0)}K</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Selected Incursion Detail & SOAR Containment */}
              <div className="lg:col-span-7 bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-4 flex flex-col justify-between">
                {activeStreamEvent && (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/50">
                              {activeStreamEvent.severity} ({activeStreamEvent.severityScore})
                            </span>
                            <span className="text-xs text-slate-400 font-mono">• {activeStreamEvent.category}</span>
                          </div>
                          <h4 className="text-base font-bold text-white mt-1">{activeStreamEvent.title}</h4>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-slate-500 uppercase">Exposure Impact</span>
                          <div className="text-base font-extrabold text-amber-400 font-mono">
                            +${(activeStreamEvent.exposureSurgeUSD / 1000000).toFixed(2)}M
                          </div>
                        </div>
                      </div>

                      {/* Technical Targets & Origin */}
                      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/90 p-3 rounded-lg border border-slate-800/80 font-mono">
                        <div>
                          <span className="text-slate-500 block text-[10px]">ATTACKER ORIGIN IP</span>
                          <span className="text-rose-400">{activeStreamEvent.sourceIp}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">TARGET ASSET / SERVICE</span>
                          <span className="text-cyan-400 truncate block">{activeStreamEvent.targetAsset}</span>
                        </div>
                      </div>

                      {/* Forensic Packet Log */}
                      <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 space-y-1">
                        <span className="text-[10px] font-mono text-slate-400 font-semibold flex items-center gap-1.5">
                          <Terminal className="h-3 w-3 text-cyan-400" />
                          SIEM / EDR Forensic Stream
                        </span>
                        <p className="text-xs text-slate-300 font-mono leading-relaxed">
                          {activeStreamEvent.logMessage}
                        </p>
                      </div>

                      {/* Recommended SOAR Action */}
                      <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 space-y-1">
                        <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                          <ShieldCheck className="h-3 w-3" />
                          Automated SOAR Remediation Playbook
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {activeStreamEvent.mitigationPlaybook}
                        </p>
                      </div>
                    </div>

                    {/* Containment Action Trigger */}
                    <div className="pt-2 border-t border-slate-800/80">
                      {activeStreamEvent.status === "Active" ? (
                        <button
                          onClick={() => handleContainStreamEvent(activeStreamEvent.id)}
                          className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                        >
                          <ShieldCheck className="h-4 w-4" />
                          Execute 1-Click SOAR Neutralization Playbook
                        </button>
                      ) : (
                        <div className="p-2.5 bg-emerald-950/80 rounded-xl border border-emerald-600/70 flex items-center justify-center space-x-2 text-emerald-300 text-xs font-bold font-mono">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          <span>Threat Contained • Blast Radius Neutralized</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

            </div>
          </div>
        )}

        {/* MODE 2: Manual Incursion Drill Simulator */}
        {activeMode === "drill" && (
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Select Zero-Day or Supply Chain Scenario to Inject
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {PRESET_DRILL_SCENARIOS.map((evt, idx) => (
                  <button
                    key={evt.id}
                    onClick={() => {
                      setSelectedDrillIndex(idx);
                      setDrillTriggered(false);
                      setDrillContained(false);
                    }}
                    className={`p-3 rounded-xl border text-left transition ${
                      selectedDrillIndex === idx
                        ? "bg-cyan-950/60 border-cyan-500 text-cyan-200 shadow-md"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold text-cyan-400 block">{evt.severity}</span>
                    <span className="text-xs font-bold truncate block mt-0.5">{evt.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Drill Card */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                    {currentDrill.severity}
                  </span>
                  <h4 className="text-base font-bold text-white mt-1.5">{currentDrill.title}</h4>
                  <span className="text-xs text-slate-400 font-mono">{currentDrill.vector}</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase">Immediate Exposure Surge</span>
                  <div className="text-lg font-black text-rose-400 font-mono">
                    +${currentDrill.blastRadiusDeltaMillions}M USD
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 font-mono">
                <div>
                  <span className="text-slate-500 text-[10px] block">ATTACK ORIGIN</span>
                  <span className="text-rose-400">{currentDrill.sourceIp}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">PRIMARY TARGET</span>
                  <span className="text-cyan-400">{currentDrill.targetAsset}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 bg-slate-900/90 p-3 rounded-xl border border-slate-800 leading-relaxed">
                {currentDrill.impactDesc}
              </p>

              {/* If Injected, show live state */}
              {drillTriggered && !drillContained && (
                <div className="p-4 bg-rose-950/80 rounded-xl border border-rose-600/70 space-y-3">
                  <div className="flex items-center space-x-2 text-rose-300 text-xs font-bold uppercase tracking-wider">
                    <ShieldAlert className="h-4 w-4 animate-bounce" />
                    <span>ALERT: Incursion Active Across Live Telemetry</span>
                  </div>
                  <p className="text-xs text-rose-200/90">{currentDrill.mitigationAction}</p>
                  <button
                    onClick={handleContainDrill}
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    1-Click SOAR Automated Containment & Isolation
                  </button>
                </div>
              )}

              {drillContained && (
                <div className="p-4 bg-emerald-950/80 rounded-xl border border-emerald-600/70 flex items-center space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-emerald-300 block">
                      Incursion Successfully Neutralized!
                    </span>
                    <p className="text-xs text-emerald-200/80 mt-0.5">
                      SOAR containment executed. Malicious sessions terminated and exposure surge neutralized.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Trigger Action */}
            {!drillTriggered && (
              <button
                onClick={handleTriggerDrill}
                disabled={isDrillInjecting}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Zap className="h-4 w-4" />
                {isDrillInjecting ? "Injecting Live Incursion Telemetry..." : "Inject Live Real-Time Drill"}
              </button>
            )}
          </div>
        )}

      </div>

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
