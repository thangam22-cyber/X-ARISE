import { useState } from "react";
import { SlidersHorizontal, ShieldCheck, AlertTriangle, CheckCircle2, TrendingDown, DollarSign, Sparkles, RefreshCw } from "lucide-react";
import { SecurityControl, SecurityControlDimension } from "../types";
import { computeMCDAControlScore, DEFAULT_DIMENSION_WEIGHTS } from "../utils/controlScoringEngine";

interface ControlScorerProps {
  controls: SecurityControl[];
  onUpdateControls: (updated: SecurityControl[]) => void;
}

export function ControlScorer({ controls, onUpdateControls }: ControlScorerProps) {
  const [activeControlId, setActiveControlId] = useState<string>(controls[0]?.id || "");
  const [weights, setWeights] = useState<SecurityControlDimension>(DEFAULT_DIMENSION_WEIGHTS);

  const activeControl = controls.find((c) => c.id === activeControlId) || controls[0];

  const handleDimensionChange = (dimension: keyof SecurityControlDimension, value: number) => {
    if (!activeControl) return;

    const updatedDimensions = {
      ...activeControl.dimensions,
      [dimension]: value
    };

    const { compositeScore, riskMultiplier, status } = computeMCDAControlScore(
      updatedDimensions,
      weights
    );

    const updated = controls.map((c) =>
      c.id === activeControl.id
        ? {
            ...c,
            dimensions: updatedDimensions,
            compositeScore,
            riskMultiplier,
            status
          }
        : c
    );

    onUpdateControls(updated);
  };

  const handleHardenControl = (controlId: string) => {
    const updated = controls.map((c) => {
      if (c.id === controlId) {
        const hardenedDimensions: SecurityControlDimension = {
          configuration: 95,
          incidentHistory: 90,
          teamMaturity: 92,
          maintenance: 96,
          integration: 94
        };
        const { compositeScore, riskMultiplier, status } = computeMCDAControlScore(
          hardenedDimensions,
          weights
        );
        return {
          ...c,
          dimensions: hardenedDimensions,
          compositeScore,
          riskMultiplier,
          status
        };
      }
      return c;
    });

    onUpdateControls(updated);
  };

  const overallIndex = Math.round(
    controls.reduce((acc, c) => acc + c.compositeScore, 0) / Math.max(1, controls.length)
  );

  return (
    <div className="space-y-6">
      {/* Engine Header - 3D Glass Surface */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 specular-highlight">
        <div>
          <div className="flex items-center space-x-2 text-emerald-300 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <SlidersHorizontal className="h-4 w-4 text-emerald-400" />
            <span className="bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-400/20">5-Factor MCDA Scoring</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Security Controls Scorer
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Evaluates defensive controls across 5 core dimensions: Configuration, Incident History, Team Maturity, Maintenance, and Telemetry Integration.
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-slate-950/70 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 shadow-inner">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Enterprise Readiness Index</div>
            <div className="text-lg font-extrabold text-emerald-400 font-mono">
              {overallIndex} / 100
            </div>
          </div>
        </div>
      </div>

      {/* Control Grid & Dimension Tuning */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Control List */}
        <div className="lg:col-span-5 space-y-3.5">
          <h3 className="text-sm font-bold text-slate-200 flex items-center justify-between">
            <span>Enterprise Security Controls ({controls.length})</span>
            <span className="text-[11px] text-slate-400 bg-white/5 px-2.5 py-1 rounded-full">Select to adjust scores</span>
          </h3>

          <div className="space-y-2.5">
            {controls.map((ctrl) => {
              const isSelected = activeControl?.id === ctrl.id;
              const isCritical = ctrl.status === "Critical Gap";
              const isVulnerable = ctrl.status === "Vulnerable";

              return (
                <div
                  key={ctrl.id}
                  onClick={() => setActiveControlId(ctrl.id)}
                  className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3.5 ${
                    isSelected
                      ? "glass-panel bg-slate-850/90 border-emerald-400/50 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-400/30 scale-[1.01]"
                      : "bg-slate-950/60 hover:bg-slate-900/80 border-white/5 hover:border-white/15"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white truncate block">
                        {ctrl.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">{ctrl.category}</span>
                    <div className="flex items-center space-x-2 mt-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isCritical
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : isVulnerable
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      }`}>
                        {ctrl.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Multiplier: {ctrl.riskMultiplier}x
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-lg font-extrabold font-mono text-emerald-400">
                      {ctrl.compositeScore}
                    </span>
                    <span className="text-[9px] text-slate-400 block uppercase">Score</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: 5-Dimension MCDA Sliders & Multiplier Output */}
        <div className="lg:col-span-7 space-y-4">
          {activeControl && (
            <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl space-y-6 specular-highlight">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">
                    {activeControl.category}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2">
                    {activeControl.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">{activeControl.description}</p>
                </div>

                <div className="text-right shrink-0 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase">Weak Control Penalty</span>
                  <div className="text-lg font-extrabold text-amber-300 font-mono">
                    {activeControl.riskMultiplier}x Multiplier
                  </div>
                </div>
              </div>

              {/* 5-Dimension Interactive Sliders */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Multi-Criteria Decision Dimensions (0 - 100)
                </h4>

                {[
                  { key: "configuration" as const, label: "1. Configuration Integrity", desc: "Policy hardening, zero-exception rules, MFA enforceability", weight: "25%" },
                  { key: "incidentHistory" as const, label: "2. Incident History & Failures", desc: "Past bypass incidents, false negative rate, audit audit flags", weight: "20%" },
                  { key: "teamMaturity" as const, label: "3. SecOps Team Maturity", desc: "Staff training, runbook automation, 24/7 coverage", weight: "20%" },
                  { key: "maintenance" as const, label: "4. Maintenance & Patch Cadence", desc: "SLA compliance on firmware/agent updates and rule reviews", weight: "20%" },
                  { key: "integration" as const, label: "5. Telemetry Integration", desc: "Full SIEM/XDR log ingestion and automated SOAR actions", weight: "15%" }
                ].map((dim) => (
                  <div key={dim.key} className="space-y-1.5 p-3.5 bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-200">{dim.label}</span>
                        <span className="text-[10px] text-slate-400 ml-2 bg-white/5 px-2 py-0.5 rounded">Weight: {dim.weight}</span>
                      </div>
                      <span className="font-mono text-emerald-400 font-extrabold text-sm">
                        {activeControl.dimensions[dim.key]} / 100
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">{dim.desc}</p>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={activeControl.dimensions[dim.key]}
                      onChange={(e) => handleDimensionChange(dim.key, parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                    />
                  </div>
                ))}
              </div>

              {/* Remediation & Hardening Action */}
              <div className="p-4 sm:p-5 bg-emerald-950/40 rounded-2xl border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                    Recommended Hardening Action
                  </span>
                  <p className="text-xs text-slate-200 mt-1 leading-relaxed">{activeControl.remediationAction}</p>
                  <span className="text-[10px] text-slate-400 mt-1.5 block">
                    Estimated Implementation Cost: <strong className="text-slate-200">${(activeControl.remediationCost).toLocaleString()}</strong>
                  </span>
                </div>
                <button
                  onClick={() => handleHardenControl(activeControl.id)}
                  className="px-4 py-2.5 bg-gradient-to-b from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-bold rounded-xl shadow-lg transition whitespace-nowrap active:scale-95 border border-emerald-400/30"
                >
                  Harden Control to 95+
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
