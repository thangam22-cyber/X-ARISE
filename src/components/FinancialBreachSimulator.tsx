import { useState } from "react";
import { DollarSign, TrendingDown, PieChart as PieIcon, CheckCircle2, ShieldCheck, ArrowUpRight, BarChart3, Sliders, CheckSquare, Square } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from "recharts";
import { CompanyProfile, FinancialBreachSimulation, SecurityInvestmentItem } from "../types";

interface FinancialBreachSimulatorProps {
  company: CompanyProfile;
  simulation: FinancialBreachSimulation;
  investments: SecurityInvestmentItem[];
  onToggleInvestment: (id: string) => void;
}

const COLORS = ["#f43f5e", "#ec4899", "#8b5cf6", "#6366f1", "#06b6d4", "#10b981", "#f59e0b"];

export function FinancialBreachSimulator({
  company,
  simulation,
  investments,
  onToggleInvestment
}: FinancialBreachSimulatorProps) {
  const selectedInvestments = investments.filter((i) => i.selected);

  const totalInvestmentCost = selectedInvestments.reduce((acc, i) => acc + i.annualCost, 0);
  const totalLossReductionUSD = selectedInvestments.reduce((acc, i) => acc + i.annualExpectedLossSaved, 0);
  const netFinancialSavings = totalLossReductionUSD - totalInvestmentCost;
  const portfolioROI = totalInvestmentCost > 0 ? Math.round((netFinancialSavings / totalInvestmentCost) * 100) : 0;
  const avgPaybackMonths = selectedInvestments.length > 0
    ? (selectedInvestments.reduce((acc, i) => acc + i.paybackMonths, 0) / selectedInvestments.length).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-6">
      {/* Engine Header - 3D Glass Surface */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 specular-highlight">
        <div>
          <div className="flex items-center space-x-2 text-cyan-300 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <DollarSign className="h-4 w-4 text-cyan-400" />
            <span className="bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-400/20">Financial Loss & ROI</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Financial Loss & ROI Optimizer
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Converts technical risk into FAIR-aligned financial exposure across 7 granular cost dimensions to compare the Cost of Breach vs Cost of Defense.
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-slate-950/70 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 shadow-inner">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Expected Breach Loss</div>
            <div className="text-lg font-extrabold text-rose-400 font-mono">
              ${(simulation.totalExpectedLoss / 1000000).toFixed(2)}M USD
            </div>
          </div>
        </div>
      </div>

      {/* 7-Factor Granular Loss Breakdown Grid & Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: 7 Categories List */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl space-y-5 specular-highlight">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <PieIcon className="h-4 w-4 text-cyan-400" />
              Scenario Loss Breakdown (7 Cost Dimensions)
            </h3>
            <span className="text-xs font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-full">Total: ${(simulation.totalExpectedLoss / 1000000).toFixed(2)}M</span>
          </div>

          <div className="space-y-3">
            {simulation.breakdown.map((item, idx) => (
              <div key={item.category} className="space-y-1.5 p-3.5 bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-200">{item.category}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-rose-400 font-bold">${(item.amount / 1000).toFixed(0)}k</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage * 3.5}%`,
                      backgroundColor: COLORS[idx % COLORS.length]
                    }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-400 truncate">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Portfolio ROI Summary Card */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl flex flex-col justify-between space-y-6 specular-highlight">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30">
              Security Investment ROI Model
            </span>
            <h3 className="text-base font-bold text-white mt-2.5">
              Cost of Breach vs Cost of Prevention
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Active security portfolio reduces annualized loss by <strong>68%</strong> with a rapid capital payback period.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/5 flex justify-between items-center">
              <span className="text-xs text-slate-400">Total Security Budget Required:</span>
              <span className="text-sm font-bold text-cyan-300 font-mono">${(totalInvestmentCost / 1000).toFixed(0)}k / yr</span>
            </div>

            <div className="p-3.5 bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/5 flex justify-between items-center">
              <span className="text-xs text-slate-400">Annual Expected Loss Avoided:</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">${(totalLossReductionUSD / 1000000).toFixed(2)}M</span>
            </div>

            <div className="p-3.5 bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/5 flex justify-between items-center">
              <span className="text-xs text-slate-400">Net Financial Savings:</span>
              <span className="text-sm font-extrabold text-emerald-300 font-mono">+${(netFinancialSavings / 1000000).toFixed(2)}M</span>
            </div>

            <div className="grid grid-cols-2 gap-3.5 pt-2">
              <div className="p-3.5 bg-emerald-950/40 rounded-2xl border border-emerald-500/30 text-center shadow-lg">
                <span className="text-[10px] text-emerald-300 uppercase font-semibold">Portfolio Net ROI</span>
                <div className="text-xl font-black text-emerald-400 font-mono mt-1">{portfolioROI}%</div>
              </div>
              <div className="p-3.5 bg-cyan-950/40 rounded-2xl border border-cyan-500/30 text-center shadow-lg">
                <span className="text-[10px] text-cyan-300 uppercase font-semibold">Payback Period</span>
                <div className="text-xl font-black text-cyan-400 font-mono mt-1">{avgPaybackMonths} mo</div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-300 bg-slate-950/60 backdrop-blur-md p-3.5 rounded-2xl border border-white/5 leading-relaxed">
            💡 <strong>Board-Ready Insight:</strong> Every $1 invested in zero-trust isolation and automated exploit mitigation prevents $11.80 in downstream breach liability.
          </div>
        </div>

      </div>

      {/* Security Investment Portfolio Optimizer List */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl space-y-5 specular-highlight">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Prioritized Security Investment Initiatives ({selectedInvestments.length} Selected)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Toggle controls to dynamically balance budget allocation, risk reduction %, and projected ROI.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {investments.map((item) => (
            <div
              key={item.id}
              onClick={() => onToggleInvestment(item.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                item.selected
                  ? "glass-panel bg-slate-850/90 border-cyan-400/50 shadow-lg shadow-cyan-950/30 ring-1 ring-cyan-400/20 scale-[1.01]"
                  : "bg-slate-950/60 hover:bg-slate-900/80 border-white/5 opacity-60"
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300">
                    {item.category}
                  </span>
                  {item.selected ? (
                    <CheckSquare className="h-5 w-5 text-cyan-400 shrink-0" />
                  ) : (
                    <Square className="h-5 w-5 text-slate-600 shrink-0" />
                  )}
                </div>
                <h4 className="text-xs font-bold text-white mt-2.5 line-clamp-2">
                  {item.title}
                </h4>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Annual Cost:</span>
                  <span className="font-mono text-slate-200 font-bold">${(item.annualCost / 1000).toFixed(0)}k</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Loss Avoided:</span>
                  <span className="font-mono text-emerald-400 font-bold">${(item.annualExpectedLossSaved / 1000).toFixed(0)}k</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-white/5 font-semibold">
                  <span className="text-cyan-400">Net ROI: {item.roiPercent}%</span>
                  <span className="text-slate-300 font-mono">{item.paybackMonths} mo payback</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
