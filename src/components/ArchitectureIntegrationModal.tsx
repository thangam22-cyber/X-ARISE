import { useState, useEffect } from "react";
import {
  X,
  Network,
  CheckCircle2,
  AlertTriangle,
  Server,
  Shield,
  Activity,
  Zap,
  RotateCcw,
  ExternalLink,
  Lock,
  Radio,
  Sliders,
  Check,
  RefreshCw,
  Terminal,
  Cpu,
  Cloud,
  ChevronRight,
} from "lucide-react";
import { CompanyProfile } from "../types";
import {
  ArchitectureConnector,
  CompanyIntegrationState,
  getCompanyIntegrationState,
  saveCompanyIntegrationState,
  toggleConnector,
  connectDemoArchitecture,
  disconnectAllArchitecture,
  testConnectorEndpoint,
} from "../utils/architectureIntegrations";
import confetti from "canvas-confetti";

interface ArchitectureIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyProfile;
  onIntegrationChange?: (state: CompanyIntegrationState) => void;
}

export function ArchitectureIntegrationModal({
  isOpen,
  onClose,
  company,
  onIntegrationChange,
}: ArchitectureIntegrationModalProps) {
  const [state, setState] = useState<CompanyIntegrationState>(() =>
    getCompanyIntegrationState(company.id)
  );
  const [selectedConnectorId, setSelectedConnectorId] = useState<string>("siem-splunk");
  const [customEndpoint, setCustomEndpoint] = useState<string>("");
  const [customApiKey, setCustomApiKey] = useState<string>("••••••••••••••••••••••••••••••••");
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; latencyMs: number; message: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const current = getCompanyIntegrationState(company.id);
      setState(current);
      const sel = current.connectors.find((c) => c.id === selectedConnectorId) || current.connectors[0];
      if (sel) {
        setCustomEndpoint(sel.endpointOrHost);
      }
      setTestResult(null);
    }
  }, [isOpen, company.id]);

  if (!isOpen) return null;

  const activeConnector = state.connectors.find((c) => c.id === selectedConnectorId) || state.connectors[0];
  const connectedCount = state.connectors.filter((c) => c.isConnected).length;

  const handleSelectConnector = (c: ArchitectureConnector) => {
    setSelectedConnectorId(c.id);
    setCustomEndpoint(c.endpointOrHost);
    setTestResult(null);
  };

  const handleToggleActiveConnector = (enable: boolean) => {
    const updated = toggleConnector(company.id, activeConnector.id, enable, customEndpoint);
    setState(updated);
    if (onIntegrationChange) onIntegrationChange(updated);
    if (enable) {
      try {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  const handleConnectDemo = () => {
    const updated = connectDemoArchitecture(company.id);
    setState(updated);
    if (onIntegrationChange) onIntegrationChange(updated);
    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleDisconnectAll = () => {
    const updated = disconnectAllArchitecture(company.id);
    setState(updated);
    if (onIntegrationChange) onIntegrationChange(updated);
    setTestResult(null);
  };

  const handleRunTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    const res = await testConnectorEndpoint({
      ...activeConnector,
      endpointOrHost: customEndpoint,
    });
    setIsTesting(false);
    setTestResult(res);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      {/* High-Contrast Obsidian Glass Modal Surface */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-100 specular-highlight">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="h-10 w-10 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Network className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h3 className="font-extrabold text-white text-base sm:text-lg">
                  Company Architecture Integration Pipeline
                </h3>
                <span
                  className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                    state.isHookedUp
                      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                      : "bg-rose-500/15 text-rose-300 border-rose-500/30"
                  }`}
                >
                  {state.isHookedUp ? "ARCHITECTURE CONNECTED" : "NOT HOOKED UP"}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Target Enterprise: <strong className="text-slate-200">{company.name}</strong> • Connected Channels: <span className="font-mono text-cyan-400 font-bold">{connectedCount}/{state.connectors.length}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Global Connection Controls Banner */}
        <div className="px-6 py-3.5 bg-slate-950/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <Server className="h-4 w-4 text-cyan-400" />
            <span>
              <strong>Mode:</strong> {state.mode === "SANDBOX_SIMULATED" ? "Simulated Enterprise Sandbox" : state.mode === "LIVE_PRODUCTION" ? "Live Production Ingestion" : "Disconnected (Offline)"}
            </span>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={handleConnectDemo}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Zap className="h-3.5 w-3.5 text-amber-300" />
              <span>1-Click Attach Demo Enterprise</span>
            </button>
            {state.isHookedUp && (
              <button
                onClick={handleDisconnectAll}
                className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-rose-300 font-semibold text-xs border border-white/10 transition cursor-pointer"
              >
                Disconnect All
              </button>
            )}
          </div>
        </div>

        {/* Split Body: Connectors List & Configuration Inspector */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Connectors Grid */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between pb-1">
              <span>Integration Connectors</span>
              <span className="text-[10px] text-slate-400 font-mono">{connectedCount} Active</span>
            </div>

            <div className="space-y-2.5">
              {state.connectors.map((c) => {
                const isSelected = c.id === activeConnector.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => handleSelectConnector(c)}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-slate-800/90 border-cyan-500/80 shadow-lg shadow-cyan-950/30 ring-1 ring-cyan-500/40"
                        : "bg-slate-950/70 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div
                          className={`p-2 rounded-xl border shrink-0 ${
                            c.isConnected
                              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                              : "bg-slate-800 text-slate-400 border-slate-700"
                          }`}
                        >
                          {c.category === "SIEM" && <Server className="h-4 w-4" />}
                          {c.category === "XDR" && <Cpu className="h-4 w-4" />}
                          {c.category === "CLOUD" && <Cloud className="h-4 w-4" />}
                          {c.category === "BAS" && <Zap className="h-4 w-4" />}
                          {c.category === "WEBHOOK" && <Radio className="h-4 w-4" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            {c.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate max-w-[190px]">
                            {c.provider}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md ${
                          c.isConnected
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : "bg-slate-800 text-slate-400 border border-slate-700"
                        }`}
                      >
                        {c.isConnected ? "CONNECTED" : "OFFLINE"}
                      </span>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{c.category} Pipeline</span>
                      {c.latencyMs ? (
                        <span className="text-emerald-400 font-bold">{c.latencyMs}ms Latency</span>
                      ) : (
                        <span className="text-slate-500">Not Synced</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Connector Details & Handshake Tester */}
          <div className="lg:col-span-7 bg-slate-950/80 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      {activeConnector.category} ADAPTER
                    </span>
                    <span className="text-xs text-slate-400 font-mono">• {activeConnector.provider}</span>
                  </div>
                  <h4 className="text-base font-extrabold text-white mt-1.5">{activeConnector.name}</h4>
                </div>

                <div className="flex items-center space-x-2">
                  {activeConnector.isConnected ? (
                    <button
                      onClick={() => handleToggleActiveConnector(false)}
                      className="px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-bold text-xs transition cursor-pointer"
                    >
                      Disconnect Channel
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggleActiveConnector(true)}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Hook Up Channel</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Status Message Display */}
              <div className={`p-3 rounded-xl border text-xs font-mono flex items-center space-x-2.5 ${
                activeConnector.isConnected
                  ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
                  : "bg-slate-900 border-slate-800 text-slate-400"
              }`}>
                {activeConnector.isConnected ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                )}
                <span className="truncate">{activeConnector.statusMessage}</span>
              </div>

              {/* Endpoint Host Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Target API Endpoint / Hostname URI</span>
                  <span className="text-[10px] text-slate-400 font-mono">TLS 1.3 Strict</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customEndpoint}
                    onChange={(e) => setCustomEndpoint(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500 transition"
                    placeholder="https://siem.corp.internal/v2/ingest"
                  />
                </div>
              </div>

              {/* Secret API Key */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Authentication Token / HEC Key</span>
                  <span className="text-[10px] text-slate-400 font-mono">{activeConnector.authMethod}</span>
                </label>
                <input
                  type="password"
                  value={customApiKey}
                  onChange={(e) => setCustomApiKey(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500 transition"
                />
              </div>

              {/* Test Handshake Section */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Handshake & Telemetry Validation</span>
                  <button
                    onClick={handleRunTest}
                    disabled={isTesting}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-cyan-500/30 flex items-center space-x-1.5 transition disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isTesting ? "animate-spin" : ""}`} />
                    <span>{isTesting ? "Probing Network..." : "Test Connection Probe"}</span>
                  </button>
                </div>

                {testResult && (
                  <div
                    className={`p-3 rounded-xl border text-xs font-mono leading-relaxed ${
                      testResult.success
                        ? "bg-cyan-950/40 border-cyan-500/50 text-cyan-200"
                        : "bg-rose-950/40 border-rose-500/50 text-rose-200"
                    }`}
                  >
                    {testResult.message}
                  </div>
                )}
              </div>
            </div>

            {/* Architecture Integration Guide */}
            <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5 text-[11px] text-slate-400 leading-relaxed space-y-1">
              <strong className="text-slate-200 block">Enterprise Production Note:</strong>
              When hooked up, the platform executes non-destructive MITRE ATT&CK probes and correlates telemetry against your SIEM forwarder in real time.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            {state.isHookedUp ? "✓ Enterprise Gateway Pipeline Live" : "⚠ Connect at least 1 sensor channel to run real-time live events"}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg transition cursor-pointer"
          >
            Apply & Close
          </button>
        </div>

      </div>
    </div>
  );
}
