import {
  ShieldAlert,
  X,
  Network,
  Zap,
  ArrowRight,
  AlertOctagon,
  CheckCircle2,
  Lock,
  Server,
  Cpu,
  RotateCcw,
} from "lucide-react";
import { CompanyProfile } from "../types";

interface ArchitectureNotHookedUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyProfile;
  missingRequirements: string[];
  errorMessage?: string;
  onOpenIntegrationModal: () => void;
  onConnectDemoArchitecture: () => void;
}

export function ArchitectureNotHookedUpModal({
  isOpen,
  onClose,
  company,
  missingRequirements,
  errorMessage,
  onOpenIntegrationModal,
  onConnectDemoArchitecture,
}: ArchitectureNotHookedUpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      {/* High-Contrast Obsidian / Slate Glass Surface */}
      <div className="bg-slate-900 border border-rose-500/50 rounded-3xl w-full max-w-2xl shadow-2xl shadow-rose-950/60 overflow-hidden flex flex-col text-slate-100 specular-highlight ring-2 ring-rose-500/20">
        
        {/* Header */}
        <div className="p-6 bg-rose-950/40 border-b border-rose-500/30 flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="h-12 w-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40 shrink-0">
              <AlertOctagon className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  CRITICAL ARCHITECTURE ERROR
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white mt-1">
                Company Architecture Not Hooked Up
              </h3>
              <p className="text-xs text-rose-200/80 mt-0.5">
                Target Enterprise: <strong className="text-white">{company.name}</strong> • Real-Time Incursion Halted
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
            title="Dismiss Error"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Main Error Explanation */}
          <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-300 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-400" />
              Live Incursion Execution Blocked
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed">
              {errorMessage ||
                `Cannot execute real-time adversary packet streaming or attack probe sensors. The target architecture for ${company.name} is not connected to a live SIEM forwarder, XDR telemetry agent, or BAS probe gateway.`}
            </p>
          </div>

          {/* Missing Integration Pipelines Checklist */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Missing Architectural Requirements:
            </span>
            <div className="space-y-2">
              {missingRequirements.map((req, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono"
                >
                  <div className="flex items-center space-x-2.5 text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-rose-500" />
                    <span>{req}</span>
                  </div>
                  <span className="text-[10px] text-rose-400 font-bold px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800/40">
                    DISCONNECTED
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Recommendations */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2 text-xs text-slate-300">
            <span className="font-bold text-white block">How to enable real-time live testing:</span>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
              <li>Configure your enterprise SIEM/XDR webhook or API credentials in the Integration Pipeline.</li>
              <li>Or click below to attach a <strong>Simulated Demo Enterprise Gateway</strong> to test the real-time kill chain instantly without modifying your network.</li>
            </ul>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onOpenIntegrationModal();
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-bold text-xs flex items-center justify-center space-x-2 transition cursor-pointer"
          >
            <Network className="h-4 w-4" />
            <span>Configure Integrations</span>
          </button>

          <div className="w-full sm:w-auto flex items-center space-x-2.5">
            <button
              onClick={() => {
                onConnectDemoArchitecture();
                onClose();
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center space-x-2 transition cursor-pointer"
            >
              <Zap className="h-4 w-4 text-amber-300" />
              <span>Attach Demo Sandbox Architecture (1-Click)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
