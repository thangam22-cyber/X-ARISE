import { useState } from "react";
import { Cpu, CheckCircle, ShieldAlert, Sparkles, ExternalLink, Filter, HelpCircle, Layers, ArrowUpRight, BarChart2 } from "lucide-react";
import { CompanyProfile, CyberDnaMatch } from "../types";

interface CyberDnaMatcherProps {
  company: CompanyProfile;
  matches: CyberDnaMatch[];
}

export function CyberDnaMatcher({ company, matches }: CyberDnaMatcherProps) {
  const [selectedMatch, setSelectedMatch] = useState<CyberDnaMatch>(matches[0]);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filteredMatches = matches.filter((m) => {
    if (activeFilter === "high") return m.similarityScore >= 75;
    if (activeFilter === "sector") return m.incident.sector.toLowerCase() === company.industry.toLowerCase();
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Engine Header - 3D Glass Surface */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 specular-highlight">
        <div>
          <div className="flex items-center space-x-2 text-cyan-300 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <Cpu className="h-4 w-4 text-cyan-400" />
            <span className="bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-400/20">ML Twin Similarity</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Cyber DNA Matching
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Cosine similarity matching against verified historical incidents to predict attack vectors and loss trajectories.
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-slate-950/70 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 shadow-inner">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Highest DNA Match</div>
            <div className="text-lg font-extrabold text-cyan-300 font-mono">
              {matches[0]?.similarityScore}% Similarity
            </div>
          </div>
          <div className="h-9 w-[1px] bg-white/10"></div>
          <div className="text-left">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Twin Incident</div>
            <div className="text-xs font-bold text-slate-100 truncate max-w-[140px]">
              {matches[0]?.incident.name}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Vector Extraction Card */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-xl specular-highlight">
        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-400" />
          Extracted Enterprise Feature Vector ({company.name})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <div className="p-4 bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/5 hover:border-cyan-500/30 transition shadow-sm">
            <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Sector Vector</span>
            <div className="text-xs font-bold text-cyan-300 mt-1 truncate">{company.industry}</div>
            <span className="text-[10px] text-slate-400 mt-1 block">Weight: 30%</span>
          </div>

          <div className="p-4 bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/5 hover:border-indigo-500/30 transition shadow-sm">
            <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Tech Stack Vector</span>
            <div className="text-xs font-bold text-indigo-300 mt-1 truncate">{company.techStack.length} Components</div>
            <span className="text-[10px] text-slate-400 mt-1 block">Weight: 25%</span>
          </div>

          <div className="p-4 bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/5 hover:border-amber-500/30 transition shadow-sm">
            <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Data Sensitivity</span>
            <div className="text-xs font-bold text-amber-300 mt-1 truncate">{company.dataType[0]?.split(" ")[0]} Classified</div>
            <span className="text-[10px] text-slate-400 mt-1 block">Weight: 20%</span>
          </div>

          <div className="p-4 bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/5 hover:border-emerald-500/30 transition shadow-sm">
            <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Scale / Footprint</span>
            <div className="text-xs font-bold text-emerald-300 mt-1 truncate">{company.employeeCount.toLocaleString()} Users</div>
            <span className="text-[10px] text-slate-400 mt-1 block">Weight: 15%</span>
          </div>

          <div className="p-4 bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/5 hover:border-purple-500/30 transition shadow-sm">
            <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Jurisdiction</span>
            <div className="text-xs font-bold text-purple-300 mt-1 truncate">{company.geography[0]}</div>
            <span className="text-[10px] text-slate-400 mt-1 block">Weight: 10%</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Nearest Neighbors List vs Incident Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Ranked Matches */}
        <div className="lg:col-span-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-cyan-400" />
              Historical Twin Incidents (Ranked)
            </h3>
            
            {/* Filter Pills */}
            <div className="flex items-center space-x-1 bg-slate-950/80 p-1 rounded-xl border border-white/10 text-[10px] font-semibold">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-2.5 py-1 rounded-lg transition ${activeFilter === "all" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-inner" : "text-slate-400 hover:text-slate-200"}`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter("high")}
                className={`px-2.5 py-1 rounded-lg transition ${activeFilter === "high" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-inner" : "text-slate-400 hover:text-slate-200"}`}
              >
                &gt;75%
              </button>
              <button
                onClick={() => setActiveFilter("sector")}
                className={`px-2.5 py-1 rounded-lg transition ${activeFilter === "sector" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-inner" : "text-slate-400 hover:text-slate-200"}`}
              >
                Same Sector
              </button>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
            {filteredMatches.map((match) => {
              const isSelected = selectedMatch?.incident.id === match.incident.id;
              return (
                <div
                  key={match.incident.id}
                  onClick={() => setSelectedMatch(match)}
                  className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? "glass-panel bg-slate-850/90 border-cyan-400/50 shadow-lg ring-1 ring-cyan-400/20 translate-x-1"
                      : "bg-slate-950/60 hover:bg-slate-900/80 border-white/5 hover:border-white/15"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-100 truncate">
                        {match.incident.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                        {match.incident.year}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 truncate mt-1">
                      {match.incident.attackType}
                    </p>
                    <div className="flex items-center space-x-2 mt-1.5 text-[10px] text-slate-400">
                      <span>Loss: ${match.incident.financialLossMillions}M</span>
                      <span>•</span>
                      <span>{match.incident.sector}</span>
                    </div>
                  </div>

                  {/* Similarity Gauge */}
                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-base font-extrabold font-mono text-cyan-300">
                      {match.similarityScore}%
                    </span>
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">Match</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Match Breakdown & Recommended Controls */}
        <div className="lg:col-span-7 space-y-4">
          {selectedMatch && (
            <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl space-y-6 specular-highlight">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 shadow-inner">
                      {selectedMatch.similarityScore}% Vector Alignment
                    </span>
                    <span className="text-xs text-slate-300 font-mono">
                      Sector: {selectedMatch.incident.sector} ({selectedMatch.incident.year})
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-2">
                    {selectedMatch.incident.name}
                  </h3>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 uppercase">Estimated Loss Scale</span>
                  <div className="text-lg font-extrabold text-rose-400 font-mono">
                    ${selectedMatch.predictedBreachCostMillions}M Exposure
                  </div>
                </div>
              </div>

              {/* Similarity Dimension Vector Breakdown */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  5-Dimensional Vector Breakdown
                </h4>
                <div className="space-y-3">
                  {[
                    { label: "Industry Sector Profile", score: selectedMatch.vectorBreakdown.industryMatch, weight: "30%" },
                    { label: "Tech Stack & OS Vulnerabilities", score: selectedMatch.vectorBreakdown.techStackMatch, weight: "25%" },
                    { label: "Data Sensitivity & Target Value", score: selectedMatch.vectorBreakdown.dataSensitivityMatch, weight: "20%" },
                    { label: "Company Scale & Asset Volume", score: selectedMatch.vectorBreakdown.sizeMatch, weight: "15%" },
                    { label: "Geographic / Compliance Surface", score: selectedMatch.vectorBreakdown.geographicMatch, weight: "10%" }
                  ].map((dim) => (
                    <div key={dim.label} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">{dim.label}</span>
                        <span className="font-mono text-cyan-300 font-semibold">{dim.score}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-950/80 rounded-full overflow-hidden border border-white/5">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-cyan-400 rounded-full transition-all duration-500 shadow-sm shadow-cyan-500/50"
                          style={{ width: `${dim.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Parallel Vulnerability Factors */}
              <div className="p-4 bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/10 space-y-2">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 text-amber-400" />
                  Identified Exposure Parallels
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedMatch.keyParallels.map((parallel, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{parallel}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Predictive Controls Recommended by Cyber DNA */}
              <div className="p-4 bg-cyan-950/30 backdrop-blur-md rounded-2xl border border-cyan-400/30 space-y-2.5">
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  AI Recommended Preemptive Controls
                </h4>
                <div className="space-y-2">
                  {selectedMatch.recommendedControls.map((ctrl, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                      <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{ctrl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lessons Learned */}
              <div className="text-xs text-slate-300 bg-slate-950/60 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <strong className="text-cyan-200">Historical Lesson: </strong>
                {selectedMatch.incident.lessonsLearned}
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
