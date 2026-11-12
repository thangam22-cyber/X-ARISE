import { Shield, Activity, Flame, Sparkles, Database, Layers, GitBranch, Cpu, DollarSign, Clock, SlidersHorizontal, PlusCircle, Network } from "lucide-react";
import { CompanyProfile } from "../types";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  selectedCompany: CompanyProfile;
  setSelectedCompany: (company: CompanyProfile) => void;
  presetCompanies: CompanyProfile[];
  onOpenRealTimeEvent: () => void;
  onOpenAiAdvisor: () => void;
  onOpenCustomCompany: () => void;
  onOpenIntegration: () => void;
  isArchitectureHookedUp: boolean;
  activeThreatCount: number;
  totalAnnualizedLoss: number;
}

export function Navbar({
  currentTab,
  setCurrentTab,
  selectedCompany,
  setSelectedCompany,
  presetCompanies,
  onOpenRealTimeEvent,
  onOpenAiAdvisor,
  onOpenCustomCompany,
  onOpenIntegration,
  isArchitectureHookedUp,
  activeThreatCount,
  totalAnnualizedLoss
}: NavbarProps) {
  const tabs = [
    { id: "overview", label: "Overview", icon: Layers, badge: "Summary" },
    { id: "attack-sim", label: "Simulation Threat Run", icon: Flame, badge: "Live Simulator" },
    { id: "cyber-dna", label: "Cyber DNA", icon: Cpu, badge: "Matches" },
    { id: "vendor-risk", label: "Vendor Risk", icon: GitBranch, badge: "Supply Chain" },
    { id: "control-score", label: "Controls", icon: SlidersHorizontal, badge: "Scorecard" },
    { id: "security-debt", label: "Security Debt", icon: Clock, badge: "Accrual" },
    { id: "financial-roi", label: "Financial Loss", icon: DollarSign, badge: "FAIR Model" },
    { id: "historical-db", label: "Threat Intel", icon: Database, badge: "Archive" }
  ];

  return (
    <header className="sticky top-0 z-40 glass-nav-bar text-slate-100 specular-highlight">
      {/* Top Bar: Brand, Company Switcher, Live Telemetry, Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Platform Name with 3D Glass Badge */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setCurrentTab("overview")}>
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-indigo-600 to-violet-700 flex items-center justify-center shadow-lg shadow-cyan-500/25 ring-1 ring-white/30 group-hover:scale-105 group-hover:shadow-cyan-400/40 transition-all duration-300">
              <Shield className="h-5 w-5 text-white drop-shadow-md" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-lg tracking-wider text-white font-mono bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">X-ARISE</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 shadow-inner">
                  SIH26105
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium truncate max-w-[280px]">
                Cyber Risk Quantification & Capital Allocation
              </p>
            </div>
          </div>

          {/* Company Profile Selector in Glass Pill */}
          <div className="hidden lg:flex items-center space-x-2 bg-slate-900/60 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 shadow-lg shadow-black/40 ring-1 ring-white/5">
            <span className="text-xs text-slate-400 font-semibold px-2">Org:</span>
            <select
              value={selectedCompany.id}
              onChange={(e) => {
                const found = presetCompanies.find((c) => c.id === e.target.value);
                if (found) setSelectedCompany(found);
              }}
              className="bg-slate-950/80 text-slate-100 text-xs font-semibold rounded-xl px-3 py-1.5 border border-white/10 focus:outline-none focus:ring-1 focus:ring-cyan-400 cursor-pointer shadow-inner"
            >
              {presetCompanies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.industry})
                </option>
              ))}
            </select>
            <button
              onClick={onOpenCustomCompany}
              className="px-2.5 py-1.5 text-xs text-cyan-300 hover:text-cyan-200 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-xl flex items-center gap-1.5 transition font-medium cursor-pointer shadow-sm"
              title="Configure Custom Organization"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="hidden xl:inline">Custom</span>
            </button>
          </div>

          {/* Real-time Exposure Metrics & Action Triggers */}
          <div className="flex items-center space-x-3">
            {/* Architecture Integration Status Button */}
            <button
              onClick={onOpenIntegration}
              className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer active:scale-95 ${
                isArchitectureHookedUp
                  ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 shadow-sm"
                  : "bg-slate-900/80 border-slate-700/80 text-slate-300 hover:text-white hover:border-cyan-500/40 shadow-sm"
              }`}
              title="Configure Company Architecture Integration"
            >
              <Network className={`h-3.5 w-3.5 ${isArchitectureHookedUp ? "text-emerald-400" : "text-slate-400"}`} />
              <span className="hidden md:inline">Architecture:</span>
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                isArchitectureHookedUp ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
              }`}>
                {isArchitectureHookedUp ? "HOOKED UP" : "UNHOOKED"}
              </span>
            </button>

            {/* Real-time ALE Glass Pill */}
            <div className="hidden sm:flex flex-col items-end px-3 py-1.5 bg-slate-900/60 backdrop-blur-xl rounded-xl border border-white/10 shadow-md">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Annual Loss Exposure</span>
              <span className="text-sm font-bold text-amber-400 font-mono drop-shadow-sm">
                ${(totalAnnualizedLoss / 1000000).toFixed(2)}M
              </span>
            </div>

            {/* Live Threat Runner with 3D Glass Button */}
            <button
              onClick={onOpenRealTimeEvent}
              className="relative inline-flex items-center justify-center px-3.5 py-2 text-xs font-bold text-rose-200 bg-gradient-to-b from-rose-900/70 to-rose-950/90 hover:from-rose-800/80 hover:to-rose-900/90 border border-rose-500/40 rounded-xl shadow-lg shadow-rose-950/60 transition group cursor-pointer active:scale-95"
            >
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
              <Activity className="h-3.5 w-3.5 mr-1.5 text-rose-400 group-hover:animate-pulse" />
              Live Incursions
            </button>

            {/* Autonomous CISO Advisor 3D Glass Button */}
            <button
              onClick={onOpenAiAdvisor}
              className="inline-flex items-center justify-center px-3.5 py-2 text-xs font-bold text-cyan-100 bg-gradient-to-b from-cyan-900/70 to-cyan-950/90 hover:from-cyan-800/80 hover:to-cyan-900/90 border border-cyan-400/40 rounded-xl shadow-lg shadow-cyan-950/60 transition cursor-pointer active:scale-95 group"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-cyan-300 group-hover:rotate-12 transition-transform" />
              CISO Advisor
            </button>
          </div>

        </div>
      </div>

      {/* Navigation Sub-bar: Frosted Pill Segmented Control */}
      <div className="bg-slate-950/50 backdrop-blur-xl border-t border-white/5 overflow-x-auto scrollbar-thin">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1.5 py-2 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-b from-cyan-500/20 to-indigo-500/20 text-cyan-200 border border-cyan-400/40 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-400/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" : "text-slate-500"}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                        isActive
                          ? "bg-cyan-400/20 text-cyan-200 font-bold border border-cyan-400/30"
                          : "bg-slate-800/80 text-slate-400 border border-white/5"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}

