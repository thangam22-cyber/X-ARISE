import { useState } from "react";
import { GitBranch, ShieldAlert, AlertTriangle, CheckCircle, RefreshCw, Layers, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import { CompanyProfile, VendorNode, VendorEdge } from "../types";
import { simulateVendorCompromise } from "../utils/vendorGraphEngine";

interface VendorNetworkRiskProps {
  company: CompanyProfile;
  nodes: VendorNode[];
  edges: VendorEdge[];
  systemicBlastRadiusUSD: number;
  criticalPathNodes: string[];
}

export function VendorNetworkRisk({
  company,
  nodes: initialNodes,
  edges,
  systemicBlastRadiusUSD,
  criticalPathNodes
}: VendorNetworkRiskProps) {
  const [nodes, setNodes] = useState<VendorNode[]>(initialNodes);
  const [selectedNode, setSelectedNode] = useState<VendorNode | null>(nodes[0]);
  const [compromiseSimulation, setCompromiseSimulation] = useState<{
    compromisedNodeId: string;
    impactedNodeIds: string[];
    totalFinancialBlastUSD: number;
    containmentRecommendation: string;
  } | null>(null);

  const handleSimulateCompromise = (nodeId: string) => {
    const result = simulateVendorCompromise(nodeId, nodes, edges);
    setCompromiseSimulation({
      compromisedNodeId: nodeId,
      impactedNodeIds: result.impactedNodeIds,
      totalFinancialBlastUSD: result.totalFinancialBlastUSD,
      containmentRecommendation: result.containmentRecommendation
    });

    // Update node statuses in visual state
    setNodes(prev => prev.map(n => {
      if (n.id === nodeId) return { ...n, status: "Compromised" };
      if (result.impactedNodeIds.includes(n.id)) return { ...n, status: "Warning" };
      return { ...n, status: "Normal" };
    }));
  };

  const handleResetGraph = () => {
    setCompromiseSimulation(null);
    setNodes(initialNodes);
  };

  return (
    <div className="space-y-6">
      {/* Engine Header - 3D Glass Surface */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 specular-highlight">
        <div>
          <div className="flex items-center space-x-2 text-indigo-300 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <GitBranch className="h-4 w-4 text-indigo-400" />
            <span className="bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-400/20">Graph Dependency Analysis</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Vendor Risk Network
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Models multi-tier supplier dependencies as a directed weighted network graph to identify critical single-points-of-failure and systemic cascade exposure.
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-slate-950/70 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 shadow-inner">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Dependency Blast</div>
            <div className="text-lg font-extrabold text-rose-400 font-mono">
              ${(systemicBlastRadiusUSD / 1000000).toFixed(1)}M Exposure
            </div>
          </div>
          <button
            onClick={handleResetGraph}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl border border-white/10 transition active:scale-95"
            title="Reset Network Graph"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Active Compromise Simulation Banner */}
      {compromiseSimulation && (
        <div className="p-5 rounded-3xl glass-panel bg-rose-950/70 border border-rose-500/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl specular-highlight">
          <div className="flex items-start space-x-3.5">
            <div className="h-10 w-10 rounded-2xl bg-rose-900/80 text-rose-300 flex items-center justify-center shrink-0 border border-rose-400/30 shadow-lg shadow-rose-950/50">
              <ShieldAlert className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
                  Active Breach Propagation Simulated
                </span>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-900/80 border border-rose-500/40 text-white">
                  {compromiseSimulation.impactedNodeIds.length} Nodes Impacted
                </span>
              </div>
              <p className="text-xs text-rose-200/90 mt-1 leading-relaxed">
                Cascade Blast Radius: <strong>${(compromiseSimulation.totalFinancialBlastUSD / 1000000).toFixed(2)}M USD</strong>. {compromiseSimulation.containmentRecommendation}
              </p>
            </div>
          </div>
          <button
            onClick={handleResetGraph}
            className="px-4 py-2 bg-gradient-to-b from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold rounded-xl shadow-lg transition active:scale-95 whitespace-nowrap border border-rose-400/30"
          >
            Restore Containment
          </button>
        </div>
      )}

      {/* Interactive Topology Graph & Node Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Graph Visual Canvas / Nodes List */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl space-y-5 specular-highlight">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-400" />
              Interactive Multi-Tier Dependency Graph
            </h3>
            <span className="text-[11px] text-slate-400 bg-white/5 px-2.5 py-1 rounded-full">Click node to test compromise</span>
          </div>

          {/* Tier Tabs / Grouping */}
          <div className="space-y-5">
            {/* Tier 1: Direct Critical Partners */}
            <div className="space-y-2.5">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
                <span>Tier 1: Direct Enterprise Core & Cloud Services</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {nodes.filter(n => n.tier === 1).map(node => {
                  const isSelected = selectedNode?.id === node.id;
                  const isCompromised = node.status === "Compromised";
                  const isWarning = node.status === "Warning";

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                        isCompromised
                          ? "glass-panel bg-rose-950/80 border-rose-400/60 shadow-lg shadow-rose-950/40"
                          : isWarning
                          ? "glass-panel bg-amber-950/60 border-amber-400/60 shadow-lg shadow-amber-950/40"
                          : isSelected
                          ? "glass-panel bg-slate-850/90 border-indigo-400/50 ring-1 ring-indigo-400/30 shadow-lg"
                          : "bg-slate-950/60 hover:bg-slate-900/80 border-white/5 hover:border-white/15"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-white truncate block">{node.name}</span>
                          <span className="text-[10px] text-slate-400">{node.category}</span>
                        </div>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          node.riskScore >= 70 ? "bg-rose-500/20 text-rose-300 border border-rose-400/30" : "bg-white/10 text-slate-300"
                        }`}>
                          Risk {node.riskScore}
                        </span>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400">Blast: ${(node.blastRadiusExposure / 1000000).toFixed(1)}M</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSimulateCompromise(node.id);
                          }}
                          className="px-2.5 py-1 bg-rose-900/60 hover:bg-rose-800 text-rose-200 rounded-lg border border-rose-500/30 font-semibold transition active:scale-95"
                        >
                          Simulate Breach
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tier 2: Sub-Vendors & Managed Infrastructure */}
            <div className="space-y-2.5 pt-3 border-t border-white/5">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
                <span>Tier 2: Sub-Processors, MFT, & Remote Automation</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {nodes.filter(n => n.tier === 2).map(node => (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                      node.status === "Compromised"
                        ? "glass-panel bg-rose-950/80 border-rose-400/60 shadow-lg shadow-rose-950/40"
                        : node.status === "Warning"
                        ? "glass-panel bg-amber-950/60 border-amber-400/60 shadow-lg shadow-amber-950/40"
                        : selectedNode?.id === node.id
                        ? "glass-panel bg-slate-850/90 border-indigo-400/50 ring-1 ring-indigo-400/30 shadow-lg"
                        : "bg-slate-950/60 hover:bg-slate-900/80 border-white/5 hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white truncate block">{node.name}</span>
                        <span className="text-[10px] text-slate-400">{node.category}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                        Risk {node.riskScore}
                      </span>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Blast: ${(node.blastRadiusExposure / 1000000).toFixed(1)}M</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSimulateCompromise(node.id);
                        }}
                        className="px-2.5 py-1 bg-rose-900/60 hover:bg-rose-800 text-rose-200 rounded-lg border border-rose-500/30 font-semibold transition active:scale-95"
                      >
                        Simulate Breach
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tier 3: Shared Libraries & Foundational Infrastructure */}
            <div className="space-y-2.5 pt-3 border-t border-white/5">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <span className="h-2.5 w-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
                <span>Tier 3: Shared Open-Source & DNS Infrastructure</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {nodes.filter(n => n.tier === 3).map(node => (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                      node.status === "Compromised"
                        ? "glass-panel bg-rose-950/80 border-rose-400/60 shadow-lg shadow-rose-950/40"
                        : node.status === "Warning"
                        ? "glass-panel bg-amber-950/60 border-amber-400/60 shadow-lg shadow-amber-950/40"
                        : selectedNode?.id === node.id
                        ? "glass-panel bg-slate-850/90 border-indigo-400/50 ring-1 ring-indigo-400/30 shadow-lg"
                        : "bg-slate-950/60 hover:bg-slate-900/80 border-white/5 hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white truncate block">{node.name}</span>
                        <span className="text-[10px] text-slate-400">{node.category}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                        Risk {node.riskScore}
                      </span>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Blast: ${(node.blastRadiusExposure / 1000000).toFixed(1)}M</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSimulateCompromise(node.id);
                        }}
                        className="px-2.5 py-1 bg-rose-900/60 hover:bg-rose-800 text-rose-200 rounded-lg border border-rose-500/30 font-semibold transition active:scale-95"
                      >
                        Simulate Breach
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Selected Node Inspector & Risk Propagation Paths */}
        <div className="lg:col-span-5 space-y-4">
          {selectedNode ? (
            <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl space-y-6 specular-highlight">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-400/30 shadow-inner">
                    Tier {selectedNode.tier} Dependency
                  </span>
                  <h3 className="text-base font-bold text-white mt-2">
                    {selectedNode.name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Criticality</span>
                  <div className="text-xs font-bold text-rose-400">{selectedNode.businessCriticality}</div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="p-3.5 bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase">Access Level</span>
                  <div className="text-xs font-bold text-slate-200 mt-1">{selectedNode.accessLevel}</div>
                </div>
                <div className="p-3.5 bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase">Blast Exposure</span>
                  <div className="text-xs font-bold text-rose-400 font-mono mt-1">
                    ${(selectedNode.blastRadiusExposure / 1000000).toFixed(2)}M
                  </div>
                </div>
              </div>

              {/* Downstream Connected Edges */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Outgoing Risk Propagation Edges
                </h4>
                <div className="space-y-2.5">
                  {edges.filter(e => e.source === selectedNode.id).map(edge => {
                    const targetNode = nodes.find(n => n.id === edge.target);
                    return (
                      <div key={edge.id} className="p-3.5 bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/5 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200">Target: {targetNode?.name}</span>
                          <span className="font-mono text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-400/20">Weight: {(edge.riskPropagationWeight * 100).toFixed(0)}%</span>
                        </div>
                        <p className="text-[11px] text-slate-400">Data Vector: {edge.dataFlow}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleSimulateCompromise(selectedNode.id)}
                className="w-full py-3 bg-gradient-to-b from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs rounded-2xl shadow-lg shadow-rose-900/40 transition active:scale-95 flex items-center justify-center gap-2 border border-rose-400/30"
              >
                <Zap className="h-4 w-4" />
                Simulate Lateral Breach Propagation From Here
              </button>

            </div>
          ) : (
            <div className="p-6 rounded-3xl glass-panel border border-white/10 text-center text-slate-400 text-xs">
              Select a vendor node from the graph to inspect risk propagation details.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
