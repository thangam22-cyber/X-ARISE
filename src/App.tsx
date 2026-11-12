import { useState, useMemo } from "react";
import { Navbar } from "./components/Navbar";
import { DashboardOverview } from "./components/DashboardOverview";
import { CyberDnaMatcher } from "./components/CyberDnaMatcher";
import { VendorNetworkRisk } from "./components/VendorNetworkRisk";
import { AttackSimulation } from "./components/AttackSimulation";
import { ControlScorer } from "./components/ControlScorer";
import { SecurityDebtCalculator } from "./components/SecurityDebtCalculator";
import { FinancialBreachSimulator } from "./components/FinancialBreachSimulator";
import { HistoricalDatabaseViewer } from "./components/HistoricalDatabaseViewer";
import { AIBoardAdvisorModal } from "./components/AIBoardAdvisorModal";
import { RealTimeEventModal } from "./components/RealTimeEventModal";
import { CustomCompanyModal } from "./components/CustomCompanyModal";
import { ArchitectureIntegrationModal } from "./components/ArchitectureIntegrationModal";

import { MOCK_COMPANIES } from "./data/mockCompanyProfiles";
import { CompanyProfile, SecurityControl, SecurityDebtItem, SecurityInvestmentItem } from "./types";
import { matchCyberDna } from "./utils/cyberDnaEngine";
import { generateVendorGraph } from "./utils/vendorGraphEngine";
import { generateAttackScenarios } from "./utils/attackSimulationEngine";
import { generateCompanyControls } from "./utils/controlScoringEngine";
import { generateCompanySecurityDebt } from "./utils/securityDebtEngine";
import { generateFinancialBreachSimulation } from "./utils/financialLossEngine";
import { getCompanyIntegrationState } from "./utils/architectureIntegrations";

export default function App() {
  const [companiesList, setCompaniesList] = useState<CompanyProfile[]>(MOCK_COMPANIES);
  const [selectedCompany, setSelectedCompany] = useState<CompanyProfile>(MOCK_COMPANIES[0]);
  const [currentTab, setCurrentTab] = useState<string>("overview");

  // Modals state
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState<boolean>(false);
  const [isRealTimeEventOpen, setIsRealTimeEventOpen] = useState<boolean>(false);
  const [isCustomCompanyOpen, setIsCustomCompanyOpen] = useState<boolean>(false);
  const [isIntegrationOpen, setIsIntegrationOpen] = useState<boolean>(false);
  const [integrationVersion, setIntegrationVersion] = useState<number>(0);

  // Integration state
  const integrationState = useMemo(() => {
    return getCompanyIntegrationState(selectedCompany.id);
  }, [selectedCompany.id, integrationVersion]);

  // Live real-time delta exposure surge from simulated incursion
  const [liveExposureDeltaUSD, setLiveExposureDeltaUSD] = useState<number>(0);
  const [liveEventNotification, setLiveEventNotification] = useState<string | null>(null);

  // Engine 1: Cyber DNA Matches
  const dnaMatches = useMemo(() => {
    return matchCyberDna(selectedCompany);
  }, [selectedCompany]);

  // Engine 2: Vendor Network Graph
  const vendorGraph = useMemo(() => {
    return generateVendorGraph(selectedCompany);
  }, [selectedCompany]);

  // Engine 3: Attack Scenarios
  const attackScenarios = useMemo(() => {
    return generateAttackScenarios(selectedCompany);
  }, [selectedCompany]);

  // Engine 4: Security Controls State
  const [controls, setControls] = useState<SecurityControl[]>(() =>
    generateCompanyControls(selectedCompany)
  );

  // Engine 5: Temporal Security Debt State
  const [debtItems, setDebtItems] = useState<SecurityDebtItem[]>(() =>
    generateCompanySecurityDebt(selectedCompany)
  );

  // Engine 6: Financial Breach Simulation & Investment Portfolio
  const initialFinancial = useMemo(() => {
    return generateFinancialBreachSimulation(selectedCompany);
  }, [selectedCompany]);

  const [investments, setInvestments] = useState<SecurityInvestmentItem[]>(
    initialFinancial.recommendedInvestments
  );

  // When selectedCompany changes, update child states
  const handleSelectCompany = (comp: CompanyProfile) => {
    setSelectedCompany(comp);
    setControls(generateCompanyControls(comp));
    setDebtItems(generateCompanySecurityDebt(comp));
    const newFin = generateFinancialBreachSimulation(comp);
    setInvestments(newFin.recommendedInvestments);
    setLiveExposureDeltaUSD(0);
    setLiveEventNotification(null);
  };

  const handleSaveCustomCompany = (newComp: CompanyProfile) => {
    setCompaniesList((prev) => [newComp, ...prev]);
    handleSelectCompany(newComp);
  };

  const handleToggleInvestment = (id: string) => {
    setInvestments((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleApplyRealTimeImpact = (deltaUSD: number, eventName: string) => {
    setLiveExposureDeltaUSD(deltaUSD);
    setLiveEventNotification(eventName);
  };

  // Base Annualized Loss + Dynamic Multipliers + Incursion Surges
  const totalAnnualizedLoss = useMemo(() => {
    return initialFinancial.simulation.totalExpectedLoss + liveExposureDeltaUSD;
  }, [initialFinancial, liveExposureDeltaUSD]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white flex flex-col relative overflow-hidden">
      {/* 3D Ambient Mesh Glow Background Layers */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Cyan Orb */}
        <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] animate-ambient-1" />
        {/* Indigo / Purple Orb */}
        <div className="absolute top-1/3 -right-32 w-[550px] h-[550px] bg-indigo-600/10 rounded-full blur-[150px] animate-ambient-2" />
        {/* Rose / Amber Orb */}
        <div className="absolute -bottom-32 left-1/3 w-[650px] h-[650px] bg-rose-600/8 rounded-full blur-[160px]" />
        {/* Subtle grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]" 
          style={{ 
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`, 
            backgroundSize: '32px 32px' 
          }} 
        />
      </div>

      {/* Top Navigation */}
      <div className="relative z-30">
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          selectedCompany={selectedCompany}
          setSelectedCompany={handleSelectCompany}
          presetCompanies={companiesList}
          onOpenRealTimeEvent={() => setIsRealTimeEventOpen(true)}
          onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
          onOpenCustomCompany={() => setIsCustomCompanyOpen(true)}
          onOpenIntegration={() => setIsIntegrationOpen(true)}
          isArchitectureHookedUp={integrationState.isHookedUp}
          activeThreatCount={liveExposureDeltaUSD > 0 ? 3 : 1}
          totalAnnualizedLoss={totalAnnualizedLoss}
        />
      </div>

      {/* Live Event Notification Alert (if incursion active) */}
      {liveEventNotification && (
        <div className="relative z-20 bg-rose-950/80 backdrop-blur-xl text-rose-100 border-b border-rose-500/30 px-4 py-2.5 text-xs font-semibold flex items-center justify-between shadow-2xl shadow-rose-950/50">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-400 animate-ping"></span>
              <strong>ACTIVE REAL-TIME INCURSION:</strong> {liveEventNotification} (+${(liveExposureDeltaUSD / 1000000).toFixed(2)}M Exposure)
            </span>
            <button
              onClick={() => setIsRealTimeEventOpen(true)}
              className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 rounded-lg text-white font-bold transition flex items-center gap-1.5"
            >
              Contain Incursion &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === "overview" && (
          <DashboardOverview
            company={selectedCompany}
            dnaMatches={dnaMatches}
            controls={controls}
            debtItems={debtItems}
            attackScenarios={attackScenarios}
            vendorBlastRadiusUSD={vendorGraph.systemicBlastRadiusUSD}
            totalAnnualizedLoss={totalAnnualizedLoss}
            onNavigateTab={setCurrentTab}
            onOpenRealTimeEvent={() => setIsRealTimeEventOpen(true)}
            onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
          />
        )}

        {currentTab === "cyber-dna" && (
          <CyberDnaMatcher company={selectedCompany} matches={dnaMatches} />
        )}

        {currentTab === "vendor-risk" && (
          <VendorNetworkRisk
            company={selectedCompany}
            nodes={vendorGraph.nodes}
            edges={vendorGraph.edges}
            systemicBlastRadiusUSD={vendorGraph.systemicBlastRadiusUSD}
            criticalPathNodes={vendorGraph.criticalPathNodes}
          />
        )}

        {currentTab === "attack-sim" && (
          <AttackSimulation
            company={selectedCompany}
            scenarios={attackScenarios}
            onOpenIntegration={() => setIsIntegrationOpen(true)}
          />
        )}

        {currentTab === "control-score" && (
          <ControlScorer controls={controls} onUpdateControls={setControls} />
        )}

        {currentTab === "security-debt" && (
          <SecurityDebtCalculator debtItems={debtItems} onUpdateDebtItems={setDebtItems} />
        )}

        {currentTab === "financial-roi" && (
          <FinancialBreachSimulator
            company={selectedCompany}
            simulation={initialFinancial.simulation}
            investments={investments}
            onToggleInvestment={handleToggleInvestment}
          />
        )}

        {currentTab === "historical-db" && <HistoricalDatabaseViewer />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-400">X-ARISE • SIH26105</span>
            <span>•</span>
            <span>AI-Powered Continuous Cyber Risk Quantification & Investment Optimization</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Powered by Gemini 3.7 & FAIR Model</span>
            <span>•</span>
            <span>6 Connected Intelligence Engines</span>
          </div>
        </div>
      </footer>

      {/* AI Advisor Modal */}
      <AIBoardAdvisorModal
        isOpen={isAiAdvisorOpen}
        onClose={() => setIsAiAdvisorOpen(false)}
        company={selectedCompany}
        dnaMatches={dnaMatches}
        financialSim={initialFinancial.simulation}
        vendorBlastRadiusUSD={vendorGraph.systemicBlastRadiusUSD}
      />

      {/* Real Time Event Incursion Modal */}
      <RealTimeEventModal
        isOpen={isRealTimeEventOpen}
        onClose={() => setIsRealTimeEventOpen(false)}
        company={selectedCompany}
        onApplyEventImpact={handleApplyRealTimeImpact}
        onOpenIntegration={() => setIsIntegrationOpen(true)}
      />

      {/* Custom Company Profiler Modal */}
      <CustomCompanyModal
        isOpen={isCustomCompanyOpen}
        onClose={() => setIsCustomCompanyOpen(false)}
        onSaveCompany={handleSaveCustomCompany}
      />

      {/* Architecture Integration Modal */}
      <ArchitectureIntegrationModal
        isOpen={isIntegrationOpen}
        onClose={() => setIsIntegrationOpen(false)}
        company={selectedCompany}
        onIntegrationChange={() => {
          setIntegrationVersion((prev) => prev + 1);
        }}
      />
    </div>
  );
}
