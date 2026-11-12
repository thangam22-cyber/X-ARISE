import { useState } from "react";
import { Clock, TrendingUp, AlertTriangle, CheckCircle2, DollarSign, Calendar, Zap, ShieldCheck } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { SecurityDebtItem } from "../types";
import { calculateCompoundedDebt, generateDebtGrowthTimeSeries } from "../utils/securityDebtEngine";
import confetti from "canvas-confetti";

interface SecurityDebtCalculatorProps {
  debtItems: SecurityDebtItem[];
  onUpdateDebtItems: (items: SecurityDebtItem[]) => void;
}

export function SecurityDebtCalculator({ debtItems, onUpdateDebtItems }: SecurityDebtCalculatorProps) {
  const [forecastDays, setForecastDays] = useState<number>(45);

  const activeDebt = debtItems.filter((i) => !i.isResolved);
  const resolvedDebt = debtItems.filter((i) => i.isResolved);

  const totalPrincipal = activeDebt.reduce((acc, i) => acc + i.principalRisk, 0);
  const totalCompoundedRisk = activeDebt.reduce((acc, i) => acc + i.currentCompoundedRisk, 0);
  const totalDailyInterestUSD = activeDebt.reduce((acc, i) => acc + (i.principalRisk * i.dailyInterestRate), 0);

  const timeSeriesData = generateDebtGrowthTimeSeries(debtItems, forecastDays);

  const handleResolveDebt = (id: string) => {
    const updated = debtItems.map((item) => {
      if (item.id === id) {
        return { ...item, isResolved: true };
      }
      return item;
    });
    onUpdateDebtItems(updated);
    try {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
    } catch (e) {}
  };

  const handleReactivateDebt = (id: string) => {
    const updated = debtItems.map((item) => {
      if (item.id === id) {
        return { ...item, isResolved: false };
      }
      return item;
    });
    onUpdateDebtItems(updated);
  };

  return (
    <div className="space-y-6">
      {/* Engine Header - 3D Glass Surface */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 specular-highlight">
        <div>
          <div className="flex items-center space-x-2 text-amber-300 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <Clock className="h-4 w-4 text-amber-400" />
            <span className="bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">Temporal Risk Modeling</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Security Debt Calculator
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Treats software vulnerabilities with a financial debt analogy: Principal Base Risk + Daily Compounding Interest as weaponization and exploit exposure increase.
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-slate-950/70 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 shadow-inner">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Compounded Debt</div>
            <div className="text-lg font-extrabold text-amber-400 font-mono">
              ${(totalCompoundedRisk / 1000).toFixed(0)}k Exposure
            </div>
          </div>
          <div className="h-8 w-[1px] bg-white/10"></div>
          <div className="text-left">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Daily Interest Accrual</div>
            <div className="text-xs font-bold text-rose-400 font-mono">
              +${Math.round(totalDailyInterestUSD).toLocaleString()} / day
            </div>
          </div>
        </div>
      </div>

      {/* Compounding Debt Trajectory Chart (Recharts) */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl space-y-5 specular-highlight">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-amber-400" />
              Exponential Risk Growth Trajectory (Next {forecastDays} Days)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Visualizes how delay in vulnerability remediation compounds potential loss over time.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950/70 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 text-xs font-semibold">
            <span className="text-slate-400 text-[11px] px-2">Forecast Horizon:</span>
            {[30, 45, 60, 90].map((d) => (
              <button
                key={d}
                onClick={() => setForecastDays(d)}
                className={`px-3 py-1 rounded-xl transition ${
                  forecastDays === d ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 shadow-inner" : "text-slate-400 hover:text-white"
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeriesData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="compoundedDebtGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="principalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#64748b" textAnchor="end" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tickFormatter={(v) => `$${v}k`} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "16px" }}
                formatter={(value: any, name: string) => [
                  `$${Number(value).toLocaleString()}k`,
                  name === "compoundedSecurityDebt" ? "Compounded Exposure" : "Base Principal"
                ]}
              />
              <Area
                type="monotone"
                dataKey="compoundedSecurityDebt"
                name="compoundedSecurityDebt"
                stroke="#f59e0b"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#compoundedDebtGrad)"
              />
              <Area
                type="monotone"
                dataKey="principalBaseRisk"
                name="principalBaseRisk"
                stroke="#06b6d4"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#principalGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active CVE Debt Ledger */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl space-y-5 specular-highlight">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              Enterprise Vulnerability Debt Ledger ({activeDebt.length} Active / {resolvedDebt.length} Remediated)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Prioritized by fastest compounding interest rate and exploit weaponization status.
            </p>
          </div>
        </div>

        <div className="space-y-3.5">
          {activeDebt.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-white/5 hover:border-white/15 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center space-x-2.5">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/30">
                    {item.cveId}
                  </span>
                  <span className="text-xs font-bold text-white">{item.title}</span>
                </div>
                <p className="text-xs text-slate-400">
                  Target Asset: <strong className="text-slate-300">{item.affectedAsset}</strong> • Status:{" "}
                  <strong className="text-amber-400">{item.exploitStatus}</strong>
                </p>
                <div className="flex items-center space-x-3 text-[11px] text-slate-500 pt-1">
                  <span>CVSS: {item.cvssScore}</span>
                  <span>•</span>
                  <span>Days Outstanding: {item.daysOutstanding}d</span>
                  <span>•</span>
                  <span>Maturity Drop-Dead: {item.maturityDate}</span>
                </div>
              </div>

              {/* Debt Compounding Metrics & Payoff Action */}
              <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase">Compounded Loss</div>
                  <div className="text-sm font-extrabold text-rose-400 font-mono">
                    ${(item.currentCompoundedRisk / 1000).toFixed(0)}k
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono">
                    +{(item.dailyInterestRate * 100).toFixed(1)}%/day
                  </span>
                </div>

                <button
                  onClick={() => handleResolveDebt(item.id)}
                  className="px-4 py-2.5 bg-gradient-to-b from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer active:scale-95 border border-emerald-400/30"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Patch & Save ${(item.currentCompoundedRisk / 1000).toFixed(0)}k
                </button>
              </div>
            </div>
          ))}

          {/* Resolved Items List */}
          {resolvedDebt.length > 0 && (
            <div className="pt-4 border-t border-white/10 space-y-2.5">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Remediated Debt Items (Exposure Eliminated)
              </h4>
              {resolvedDebt.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-between text-xs text-slate-400"
                >
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span className="font-mono font-bold text-slate-300">{item.cveId}</span>
                    <span className="line-through">{item.title}</span>
                  </div>
                  <button
                    onClick={() => handleReactivateDebt(item.id)}
                    className="text-[10px] text-slate-400 hover:text-slate-200 underline"
                  >
                    Re-open
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
