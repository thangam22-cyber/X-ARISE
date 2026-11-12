import { useState } from "react";
import { Database, Search, Filter, DollarSign, Calendar, AlertTriangle, ShieldCheck, BookOpen, Clock, Tag, ExternalLink, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { HISTORICAL_BREACHES, INDUSTRY_BENCHMARKS, ATTACK_TYPES_REFERENCE } from "../data/historicalBreaches";
import { IndustrySector, HistoricalBreach } from "../types";

export function HistoricalDatabaseViewer() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedSector, setSelectedSector] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<"incidents" | "sectors" | "attackTypes">("incidents");
  const [expandedBreachId, setExpandedBreachId] = useState<string | null>(null);

  const filteredBreaches = HISTORICAL_BREACHES.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.attackType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.rootCause.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.keyVulnerability.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === "All" || b.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  const toggleExpand = (id: string) => {
    setExpandedBreachId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 specular-highlight">
        <div>
          <div className="flex items-center space-x-2 text-cyan-300 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <Database className="h-4 w-4 text-cyan-400" />
            <span className="bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-400/20">Landmark Breach Database ({HISTORICAL_BREACHES.length} Incidents)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Historical Breach Database
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Empirical breach intelligence sourced from forensic reports, SEC 8-K filings, and regulatory penalty ledgers spanning 2010 to 2026.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center space-x-1.5 bg-slate-950/70 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 text-xs font-semibold shrink-0 shadow-inner">
          <button
            onClick={() => setActiveTab("incidents")}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeTab === "incidents" ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/30 shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            Major Breaches ({HISTORICAL_BREACHES.length})
          </button>
          <button
            onClick={() => setActiveTab("sectors")}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeTab === "sectors" ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/30 shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            Sector Loss Models
          </button>
          <button
            onClick={() => setActiveTab("attackTypes")}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeTab === "attackTypes" ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/30 shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            17 Attack Vector Taxonomy
          </button>
        </div>
      </div>

      {/* Tab 1: Major Incidents Explorer */}
      {activeTab === "incidents" && (
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 shadow-lg">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by company, CVE, attack type, or root cause..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950/70 text-xs text-white rounded-xl border border-white/10 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
              <span className="text-xs text-slate-400 font-semibold shrink-0">Filter Sector:</span>
              {["All", "Healthcare", "Finance", "Technology", "Energy", "Retail", "Telecom"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSector(s)}
                  className={`text-xs px-3 py-1.5 rounded-xl shrink-0 transition ${
                    selectedSector === s
                      ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-inner"
                      : "bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-white/5"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Incidents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {filteredBreaches.map((b) => {
              const isExpanded = expandedBreachId === b.id;
              return (
                <div
                  key={b.id}
                  className="p-5 sm:p-6 rounded-3xl glass-panel border border-white/10 hover:border-white/20 transition-all duration-200 space-y-4 shadow-xl specular-highlight"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/30">
                          {b.year}
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300">
                          {b.sector}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-2 leading-snug">{b.name}</h3>
                    </div>
                    <div className="text-right shrink-0 bg-white/5 px-3 py-1.5 rounded-2xl border border-white/5">
                      <span className="text-[10px] text-slate-400 uppercase">Gross Loss</span>
                      <div className="text-base font-extrabold text-rose-400 font-mono">
                        ${b.financialLossMillions >= 1000 ? `${(b.financialLossMillions / 1000).toFixed(1)}B` : `${b.financialLossMillions}M`} USD
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 font-medium">
                    <strong className="text-slate-400">Attack Classification: </strong> {b.attackType}
                  </p>

                  <div className="p-3.5 bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/5 text-xs space-y-1">
                    <span className="text-slate-400 font-semibold block">Root Cause / Key Forensic Exploit:</span>
                    <p className="text-slate-200 leading-relaxed">{b.rootCause}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                    <div>
                      <span className="text-slate-500 font-semibold">Scope:</span> {b.recordsAffected}
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold">Recovery Time:</span> {b.recoveryTimeMonths} months
                    </div>
                  </div>

                  {/* Stock Impact / Ransom Paid Tags */}
                  {(b.stockImpact || b.ransomPaidMillions !== undefined) && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {b.stockImpact && (
                        <span className="text-[10px] font-mono text-amber-300 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                          Market Cap: {b.stockImpact}
                        </span>
                      )}
                      {b.ransomPaidMillions !== undefined && b.ransomPaidMillions > 0 && (
                        <span className="text-[10px] font-mono text-rose-300 bg-rose-500/15 px-2.5 py-0.5 rounded-full border border-rose-400/30">
                          Ransom Paid: ${b.ransomPaidMillions}M
                        </span>
                      )}
                    </div>
                  )}

                  {/* Expandable Details */}
                  {isExpanded && (
                    <div className="space-y-3 pt-3 border-t border-white/10 text-xs text-slate-300">
                      <div>
                        <strong className="text-cyan-400 block mb-1.5">Tech Stack & Infrastructure Involved:</strong>
                        <div className="flex flex-wrap gap-1.5">
                          {b.techStackOverlap.map((t, idx) => (
                            <span key={idx} className="bg-slate-950/70 text-slate-300 px-2.5 py-0.5 rounded-lg text-[11px] border border-white/10">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <strong className="text-amber-400 block mb-1.5">Data Types Compromised:</strong>
                        <div className="flex flex-wrap gap-1.5">
                          {b.dataTypesInvolved.map((d, idx) => (
                            <span key={idx} className="bg-amber-500/15 text-amber-300 px-2.5 py-0.5 rounded-lg text-[11px] border border-amber-400/30">
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-white/5">
                        <strong className="text-rose-400 block mb-1">Key Architectural Vulnerability:</strong>
                        <p className="text-slate-200">{b.keyVulnerability}</p>
                      </div>

                      <div className="p-3.5 bg-emerald-950/40 rounded-2xl border border-emerald-500/30 text-emerald-300">
                        <strong className="block mb-1 text-emerald-400 font-bold">Executive Board Lesson:</strong>
                        <p>{b.lessonsLearned}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-white/10 pt-2.5 text-[11px]">
                    <button
                      onClick={() => toggleExpand(b.id)}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      {isExpanded ? (
                        <><span>Show Less</span> <ChevronUp className="h-3.5 w-3.5" /></>
                      ) : (
                        <><span>View Deep Forensics & Tech Stack</span> <ChevronDown className="h-3.5 w-3.5" /></>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Sector Benchmarks */}
      {activeTab === "sectors" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {(Object.keys(INDUSTRY_BENCHMARKS) as IndustrySector[]).map((sec) => {
            const data = INDUSTRY_BENCHMARKS[sec];
            return (
              <div key={sec} className="p-5 sm:p-6 rounded-3xl glass-panel border border-white/10 space-y-3.5 shadow-xl specular-highlight">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">{sec}</h3>
                  <span className="text-[11px] font-mono font-bold text-amber-300 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/30">
                    {data.trend}
                  </span>
                </div>

                <div className="space-y-2 pt-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Avg Cost per Breach:</span>
                    <span className="font-bold text-cyan-300 font-mono">${data.avgBreachCostMillions}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Annual Sector Loss:</span>
                    <span className="font-bold text-rose-400 font-mono">${data.annualIndustryLossBillions}B / yr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Double Extortion Rate:</span>
                    <span className="font-bold text-amber-300 font-mono">{data.doubleExtortionRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mean Time to Identify:</span>
                    <span className="font-bold text-purple-300 font-mono">{data.meanTimeToIdentifyDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mean Time to Contain:</span>
                    <span className="font-bold text-indigo-300 font-mono">{data.meanTimeToContainDays} days</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/5 text-[11px] text-slate-300">
                  <strong className="text-slate-400 block mb-0.5">Top Threat Vector:</strong>
                  {data.topThreatVector}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: All 17 Attack Types Reference */}
      {activeTab === "attackTypes" && (
        <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 space-y-4 shadow-2xl specular-highlight">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-cyan-400" />
              Complete 17 Attack Vector Taxonomy & MITRE ATT&CK Mapping
            </h3>
            <span className="text-xs text-slate-400 font-mono bg-white/5 px-3 py-1 rounded-full">Industry Standard Reference</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[11px] text-slate-400 uppercase bg-slate-950/80 border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-4 rounded-l-xl">Attack Vector Classification</th>
                  <th className="py-3.5 px-4">Cost Range</th>
                  <th className="py-3.5 px-4">Propagation Velocity</th>
                  <th className="py-3.5 px-4">Primary Operational Impact</th>
                  <th className="py-3.5 px-4">Key Prevention Strategy</th>
                  <th className="py-3.5 px-4 rounded-r-xl">MITRE ATT&CK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {ATTACK_TYPES_REFERENCE.map((row) => (
                  <tr key={row.type} className="hover:bg-white/5 transition">
                    <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">{row.type}</td>
                    <td className="py-3.5 px-4 font-mono text-rose-400 font-semibold whitespace-nowrap">{row.avgCost}</td>
                    <td className="py-3.5 px-4 text-amber-300 font-medium whitespace-nowrap">{row.spreadSpeed}</td>
                    <td className="py-3.5 px-4 text-slate-300">{row.revenueImpact}</td>
                    <td className="py-3.5 px-4 text-emerald-400">{row.preventionStrategy}</td>
                    <td className="py-3.5 px-4 font-mono text-cyan-400 text-[11px] whitespace-nowrap">{row.mitreTactics}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
