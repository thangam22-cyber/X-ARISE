import { Shield, Cpu, GitBranch, Flame, SlidersHorizontal, Clock, DollarSign, ArrowRight, AlertTriangle, CheckCircle2, TrendingUp, Zap, Sparkles, Activity } from "lucide-react";
import { CompanyProfile, CyberDnaMatch, SecurityControl, SecurityDebtItem, AttackScenario } from "../types";

interface DashboardOverviewProps {
  company: CompanyProfile;
  dnaMatches: CyberDnaMatch[];
  controls: SecurityControl[];
  debtItems: SecurityDebtItem[];
  attackScenarios: AttackScenario[];
  vendorBlastRadiusUSD: number;
  totalAnnualizedLoss: number;
  onNavigateTab: (tab: string) => void;
  onOpenRealTimeEvent: () => void;
  onOpenAiAdvisor: () => void;
}

export function DashboardOverview({
  company,
  dnaMatches,
  controls,
  debtItems,
  attackScenarios,
  vendorBlastRadiusUSD,
  totalAnnualizedLoss,
  onNavigateTab,
  onOpenRealTimeEvent,
  onOpenAiAdvisor
}: DashboardOverviewProps) {
  const topDna = dnaMatches[0];
  const activeDebt = debtItems.filter(d => !d.isResolved);
  const totalCompoundedDebt = activeDebt.reduce((acc, d) => acc + d.currentCompoundedRisk, 0);
  const dailyDebtAccrual = activeDebt.reduce((acc, d) => acc + (d.principalRisk * d.dailyInterestRate), 0);

  const avgControlScore = Math.round(
    controls.reduce((acc, c) => acc + c.compositeScore, 0) / Math.max(1, controls.length)
  );

  const totalPreventedDamage = attackScenarios.reduce((acc, s) => acc + s.preventedDamage, 0);

  return (
    <div className="space-y-8">
      {/* Hero Executive Status Banner - 3D Glass Surface */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 shadow-2xl specular-highlight">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 shadow-inner">
                Continuous Risk Overview
              </span>
              <span className="text-xs text-slate-300 font-mono bg-slate-900/60 px-3 py-1 rounded-full border border-white/10">
                {company.industry} Sector • {company.employeeCount.toLocaleString()} Employees
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
              Security Investment Allocator
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Quantitative risk management platform mapping technical vulnerabilities and vendor dependencies into annualized financial exposure and ROI-prioritized defenses.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab("attack-sim")}
              className="px-4 py-2.5 bg-gradient-to-b from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold rounded-2xl shadow-lg shadow-rose-950/60 flex items-center gap-2 transition active:scale-95 border border-rose-400/30 cursor-pointer"
            >
              <Flame className="h-4 w-4 animate-pulse text-rose-200" />
              Simulation Threat Run
            </button>
            <button
              onClick={onOpenRealTimeEvent}
              className="px-4 py-2.5 bg-slate-900/80 hover:bg-slate-800 text-rose-300 border border-rose-500/40 text-xs font-bold rounded-2xl shadow-lg shadow-rose-950/40 flex items-center gap-2 transition active:scale-95 border cursor-pointer backdrop-blur-xl"
            >
              <Activity className="h-4 w-4 text-rose-400" />
              Live Incursions
            </button>
            <button
              onClick={onOpenAiAdvisor}
              className="px-4 py-2.5 bg-slate-900/80 hover:bg-slate-800 text-cyan-200 border border-cyan-400/30 text-xs font-bold rounded-2xl shadow-lg shadow-cyan-950/40 flex items-center gap-2 transition active:scale-95 cursor-pointer backdrop-blur-xl group"
            >
              <Sparkles className="h-4 w-4 text-cyan-300 group-hover:rotate-12 transition-transform" />
              CISO Board Memo
            </button>
          </div>
        </div>
      </div>

      {/* Connected Intelligence Engines - 3D Glass Grid */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
            Core Intelligence Engines
          </h2>
          <span className="text-xs text-slate-400 font-medium">Select any module to inspect</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* 1. Cyber DNA Similarity Engine */}
          <div
            onClick={() => onNavigateTab("cyber-dna")}
            className="group p-6 rounded-3xl glass-panel-interactive border border-white/10 hover:border-cyan-400/40 shadow-xl cursor-pointer flex flex-col justify-between specular-highlight"
          >
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-950/80 text-cyan-300 flex items-center justify-center border border-cyan-400/30 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-cyan-500/25 transition-all duration-300">
                  <Cpu className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 shadow-inner">
                  ML Twin Match
                </span>
              </div>
              <h3 className="font-bold text-slate-100 text-base group-hover:text-cyan-300 transition">
                Cyber DNA Matching
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Vector similarity against verified historical incidents.
              </p>
              
              <div className="mt-5 p-3.5 bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/5">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-400">Twin Match:</span>
                  <span className="text-xs font-bold text-cyan-200 truncate max-w-[150px]">{topDna?.incident.name || 'WannaCry'}</span>
                </div>
                <div className="flex justify-between items-baseline mt-2">
                  <span className="text-xs text-slate-400">Similarity Index:</span>
                  <span className="text-base font-extrabold text-cyan-300 font-mono">{topDna?.similarityScore || 84}%</span>
                </div>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between text-xs text-cyan-300 font-semibold pt-3 border-t border-white/5">
              <span>View Feature Vector</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* 2. Vendor Network Graph Engine */}
          <div
            onClick={() => onNavigateTab("vendor-risk")}
            className="group p-6 rounded-3xl glass-panel-interactive border border-white/10 hover:border-indigo-400/40 shadow-xl cursor-pointer flex flex-col justify-between specular-highlight"
          >
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-indigo-950/80 text-indigo-300 flex items-center justify-center border border-indigo-400/30 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-indigo-500/25 transition-all duration-300">
                  <GitBranch className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-400/30 shadow-inner">
                  Graph Blast Radius
                </span>
              </div>
              <h3 className="font-bold text-slate-100 text-base group-hover:text-indigo-300 transition">
                Vendor Risk Network
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Multi-tier dependency cascade and transitive liability.
              </p>
              
              <div className="mt-5 p-3.5 bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/5">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-400">Systemic Exposure:</span>
                  <span className="text-base font-extrabold text-rose-400 font-mono">${(vendorBlastRadiusUSD / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between items-baseline mt-2">
                  <span className="text-xs text-slate-400">High Risk Nodes:</span>
                  <span className="text-xs font-bold text-amber-300">4 Critical Vendors</span>
                </div>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between text-xs text-indigo-300 font-semibold pt-3 border-t border-white/5">
              <span>Inspect Topology Graph</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* 3. Attack Simulation & Threat Run Sandbox */}
          <div
            onClick={() => onNavigateTab("attack-sim")}
            className="group p-6 rounded-3xl glass-panel-interactive border border-white/10 hover:border-rose-400/40 shadow-xl cursor-pointer flex flex-col justify-between specular-highlight ring-1 ring-rose-500/10 hover:ring-rose-500/30"
          >
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-rose-500/20 to-rose-950/80 text-rose-300 flex items-center justify-center border border-rose-400/30 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-rose-500/25 transition-all duration-300">
                  <Flame className="h-5 w-5 animate-pulse text-rose-400" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-400/30 shadow-inner">
                  Live Threat Run
                </span>
              </div>
              <h3 className="font-bold text-slate-100 text-base group-hover:text-rose-300 transition">
                Simulation Threat Run
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Adversary campaigns, real-time kill chains, and financial defense testing.
              </p>
              
              <div className="mt-5 p-3.5 bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/5">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-400">Prevented Loss:</span>
                  <span className="text-base font-extrabold text-emerald-400 font-mono">${(totalPreventedDamage / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between items-baseline mt-2">
                  <span className="text-xs text-slate-400">Mean Detection:</span>
                  <span className="text-xs font-bold text-amber-300 font-mono">23.6 mins</span>
                </div>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between text-xs text-rose-300 font-semibold pt-3 border-t border-white/5">
              <span>Execute Threat Run</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* 4. Multi-Factor Control Scorer (MCDA) */}
          <div
            onClick={() => onNavigateTab("control-score")}
            className="group p-6 rounded-3xl glass-panel-interactive border border-white/10 hover:border-emerald-400/40 shadow-xl cursor-pointer flex flex-col justify-between specular-highlight"
          >
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-950/80 text-emerald-300 flex items-center justify-center border border-emerald-400/30 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300">
                  <SlidersHorizontal className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 shadow-inner">
                  5-Factor MCDA
                </span>
              </div>
              <h3 className="font-bold text-slate-100 text-base group-hover:text-emerald-300 transition">
                Security Controls
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Configuration, incident history, team maturity & telemetry.
              </p>
              
              <div className="mt-5 p-3.5 bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/5">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-400">Composite Score:</span>
                  <span className="text-base font-extrabold text-emerald-300 font-mono">{avgControlScore}/100</span>
                </div>
                <div className="flex justify-between items-baseline mt-2">
                  <span className="text-xs text-slate-400">Risk Multiplier:</span>
                  <span className="text-xs font-bold text-amber-300 font-mono">1.35x Factor</span>
                </div>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between text-xs text-emerald-300 font-semibold pt-3 border-t border-white/5">
              <span>Review Control Scores</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* 5. Temporal Security Debt Calculator */}
          <div
            onClick={() => onNavigateTab("security-debt")}
            className="group p-6 rounded-3xl glass-panel-interactive border border-white/10 hover:border-amber-400/40 shadow-xl cursor-pointer flex flex-col justify-between specular-highlight"
          >
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-950/80 text-amber-300 flex items-center justify-center border border-amber-400/30 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-amber-500/25 transition-all duration-300">
                  <Clock className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30 shadow-inner">
                  Temporal Accrual
                </span>
              </div>
              <h3 className="font-bold text-slate-100 text-base group-hover:text-amber-300 transition">
                Security Debt
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Principal risk, compounding interest & exploit timelines.
              </p>
              
              <div className="mt-5 p-3.5 bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/5">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-400">Accrued Debt:</span>
                  <span className="text-base font-extrabold text-amber-300 font-mono">${(totalCompoundedDebt / 1000).toFixed(0)}k</span>
                </div>
                <div className="flex justify-between items-baseline mt-2">
                  <span className="text-xs text-slate-400">Daily Accrual:</span>
                  <span className="text-xs font-bold text-rose-400 font-mono">+${Math.round(dailyDebtAccrual).toLocaleString()}/day</span>
                </div>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between text-xs text-amber-300 font-semibold pt-3 border-t border-white/5">
              <span>View Debt Curve</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* 6. Financial Loss & Investment ROI */}
          <div
            onClick={() => onNavigateTab("financial-roi")}
            className="group p-6 rounded-3xl glass-panel-interactive border border-white/10 hover:border-cyan-400/40 shadow-xl cursor-pointer flex flex-col justify-between specular-highlight"
          >
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-950/80 text-cyan-300 flex items-center justify-center border border-cyan-400/30 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-cyan-500/25 transition-all duration-300">
                  <DollarSign className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 shadow-inner">
                  FAIR Model
                </span>
              </div>
              <h3 className="font-bold text-slate-100 text-base group-hover:text-cyan-300 transition">
                Financial Loss & ROI
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Loss quantification vs prevention investment optimization.
              </p>
              
              <div className="mt-5 p-3.5 bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/5">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-400">Annual Exposure:</span>
                  <span className="text-base font-extrabold text-rose-400 font-mono">${(totalAnnualizedLoss / 1000000).toFixed(2)}M</span>
                </div>
                <div className="flex justify-between items-baseline mt-2">
                  <span className="text-xs text-slate-400">Target Savings:</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">+$4.47M (1,080% ROI)</span>
                </div>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between text-xs text-cyan-300 font-semibold pt-3 border-t border-white/5">
              <span>Optimize Investments</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

        </div>
      </div>

      {/* Unified Architecture Pipeline Map - 3D Glass Container */}
      <div className="p-6 sm:p-7 rounded-3xl glass-panel border border-white/10 shadow-2xl specular-highlight">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
              Unified X-Arise Risk Pipeline Architecture (SIH26105)
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Continuous end-to-end data transformation from raw enterprise assets to optimized board investments.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 pt-2">
          {[
            { step: "1", title: "Cyber DNA", desc: "Similarity Vector", tab: "cyber-dna", border: "hover:border-cyan-400/40" },
            { step: "2", title: "Vendor Graph", desc: "Risk Propagation", tab: "vendor-risk", border: "hover:border-indigo-400/40" },
            { step: "3", title: "Attack Sandbox", desc: "Control Testing", tab: "attack-sim", border: "hover:border-rose-400/40" },
            { step: "4", title: "MCDA Scorer", desc: "5-Factor Multiplier", tab: "control-score", border: "hover:border-emerald-400/40" },
            { step: "5", title: "Security Debt", desc: "Temporal Trajectory", tab: "security-debt", border: "hover:border-amber-400/40" },
            { step: "6", title: "ROI Optimizer", desc: "FAIR Financial Loss", tab: "financial-roi", border: "hover:border-teal-400/40" }
          ].map((item) => (
            <div
              key={item.step}
              onClick={() => onNavigateTab(item.tab)}
              className={`p-3.5 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-white/10 ${item.border} hover:bg-slate-900/80 hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-md`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">Step 0{item.step}</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:text-white transition" />
              </div>
              <div className="mt-3">
                <div className="text-xs font-bold text-slate-200 group-hover:text-white transition">{item.title}</div>
                <div className="text-[10px] text-slate-400 truncate">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
