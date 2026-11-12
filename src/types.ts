export type IndustrySector =
  | "Healthcare"
  | "Finance"
  | "Technology"
  | "Manufacturing"
  | "Government"
  | "Energy"
  | "Retail"
  | "Telecom";

export type CompanySize = "Small (<250)" | "Mid-Market (250-2500)" | "Enterprise (2500-10000)" | "Mega-Corp (10000+)";

export interface CompanyProfile {
  id: string;
  name: string;
  industry: IndustrySector;
  size: CompanySize;
  employeeCount: number;
  revenue: number; // in USD
  geography: string[];
  techStack: string[];
  dataType: string[];
  criticalAssetsCount: number;
  activeVendorsCount: number;
  annualSecurityBudget: number;
}

export interface HistoricalBreach {
  id: string;
  name: string;
  year: number;
  sector: IndustrySector;
  recordsAffected: string;
  financialLossMillions: number;
  attackType: string;
  rootCause: string;
  ransomPaidMillions?: number;
  stockImpact?: string;
  recoveryTimeMonths: number;
  techStackOverlap: string[];
  dataTypesInvolved: string[];
  keyVulnerability: string;
  lessonsLearned: string;
}

export interface CyberDnaMatch {
  incident: HistoricalBreach;
  similarityScore: number; // 0 - 100%
  vectorBreakdown: {
    industryMatch: number;
    techStackMatch: number;
    sizeMatch: number;
    dataSensitivityMatch: number;
    geographicMatch: number;
  };
  predictedBreachCostMillions: number;
  keyParallels: string[];
  recommendedControls: string[];
}

export interface VendorNode {
  id: string;
  name: string;
  category: "Cloud Infrastructure" | "SaaS & Productivity" | "Managed Service (MSP)" | "Payment & FinTech" | "Supply Chain / Logistics" | "HR & Data Analytics";
  tier: 1 | 2 | 3;
  riskScore: number; // 0 - 100
  businessCriticality: "Low" | "Medium" | "High" | "Critical";
  accessLevel: "Read-Only" | "API Gateway" | "Full Database Access" | "Core Network VPN" | "Administrative";
  directDependencies: string[]; // Connected Node IDs
  blastRadiusExposure: number; // in USD
  status: "Normal" | "Warning" | "Compromised";
  cveExposures: number;
}

export interface VendorEdge {
  id: string;
  source: string;
  target: string;
  dataFlow: string;
  riskPropagationWeight: number; // 0.1 - 1.0
}

export type AttackCategory =
  | "Ransomware & Double Extortion"
  | "Zero-Day Exploit & Edge Gateway"
  | "Supply Chain & Build Pipeline"
  | "AI Voice Deepfake & Executive BEC"
  | "Cloud IAM & Data Lake Exfiltration"
  | "Volumetric DDoS & API Flooding"
  | "Insider Threat & Logic Bomb"
  | "Mass API & SQL Injection"
  | "Credential Stuffing & Session Hijack"
  | "Industrial OT & SCADA Disruption"
  | "Adversarial AI & LLM Prompt Injection"
  | "BGP Hijacking & DNS Poisoning"
  | "Cryptojacking & Cluster Exhaustion"
  | "Nation-State APT Living-off-the-Land";

export interface AttackFinancialBreakdown {
  businessDowntimeUSD: number;
  ransomOrExtortionUSD: number;
  incidentResponseDFIRUSD: number;
  regulatoryFinesUSD: number;
  customerNotificationUSD: number;
  legalAndClassActionUSD: number;
  reputationalChurnUSD: number;
  assetRestorationUSD: number;
  totalFinancialLossUSD: number;
  preventedFinancialDamageUSD: number;
  roiOnSecurityStackUSD: number;
}

export interface AttackTechnicalImpact {
  endpointsEncryptedOrCompromised: number;
  recordsExfiltratedCount: number;
  systemDowntimeHours: number;
  bandwidthConsumedGbps?: number;
  serviceAccountsHijacked: number;
  regulatoryNotificationTriggered: string[];
  affectedSubnetsOrClouds: string[];
  forensicIoCs: string[];
}

export interface KillChainStep {
  step: number;
  stage:
    | "Reconnaissance"
    | "Initial Access"
    | "Execution"
    | "Persistence"
    | "Privilege Escalation"
    | "Defense Evasion"
    | "Lateral Movement"
    | "Data Exfiltration"
    | "Impact & Extortion";
  description: string;
  testedControl: string;
  controlStatus: "Blocked" | "Detected" | "Bypassed";
  durationSec: number;
  iocTelemetry?: string;
}

export interface AttackScenario {
  id: string;
  name: string;
  category: AttackCategory | string;
  threatActor?: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  targetVector: string;
  killChainSteps: KillChainStep[];
  mttdSec: number; // Mean Time to Detect
  mttrSec: number; // Mean Time to Respond
  bypassRatePercent: number;
  potentialLoss: number; // in USD
  preventedDamage: number; // in USD
  financialBreakdown: AttackFinancialBreakdown;
  technicalImpact: AttackTechnicalImpact;
  recommendedRemediations: string[];
  isExecuting?: boolean;
}

export interface MultiVectorSimulationResult {
  totalScenariosCount: number;
  simulatedAt: string;
  enterpriseSurvivalScore: number; // 0 - 100
  overallBypassRate: number;
  overallMttdSec: number;
  overallMttrSec: number;
  totalGrossPotentialLossUSD: number;
  totalMitigatedActualLossUSD: number;
  totalPreventedFinancialDamageUSD: number;
  resilienceRating: "Optimal / Cyber Resilient" | "Moderate / Vulnerable to Supply Chain" | "Critical / At Extreme Risk";
  vectorResults: {
    id: string;
    name: string;
    category: string;
    status: "Blocked" | "Partially Contained" | "Breached";
    preventedUSD: number;
    lossUSD: number;
    bypassedSteps: number;
    totalSteps: number;
  }[];
}

export interface SecurityControlDimension {
  configuration: number; // 0 - 100
  incidentHistory: number; // 0 - 100
  teamMaturity: number; // 0 - 100
  maintenance: number; // 0 - 100
  integration: number; // 0 - 100
}

export interface SecurityControl {
  id: string;
  name: string;
  category: "Identity & Access (IAM)" | "Endpoint Security (EDR/XDR)" | "Network & Edge Security" | "Data Encryption & DLP" | "Cloud & Application Security" | "Security Operations (SIEM/SOAR)";
  description: string;
  dimensions: SecurityControlDimension;
  weights: SecurityControlDimension;
  compositeScore: number; // Multi-Criteria Decision Score (0 - 100)
  riskMultiplier: number; // Weak Control Multiplier (e.g. 1.8x risk if weak)
  status: "Optimized" | "Adequate" | "Vulnerable" | "Critical Gap";
  remediationAction: string;
  remediationCost: number;
}

export interface SecurityDebtItem {
  id: string;
  cveId: string;
  title: string;
  affectedAsset: string;
  principalRisk: number; // Initial base risk $
  dailyInterestRate: number; // Daily growth percentage (e.g., 0.015 for 1.5%/day)
  daysOutstanding: number;
  currentCompoundedRisk: number; // Principal * (1 + rate)^days
  maturityDate: string; // Critical breach trigger date
  exploitStatus: "PoC Available" | "Active In-The-Wild Exploit" | "Ransomware Weaponized" | "Mass C2 Automation";
  cvssScore: number;
  remediationCost: number;
  priority: "P1 - Critical" | "P2 - High" | "P3 - Medium";
  isResolved?: boolean;
}

export interface FinancialLossCategory {
  category: string;
  percentage: number;
  amount: number;
  timeframe: string;
  description: string;
  mitigationFactor: number; // 0 - 1
}

export interface FinancialBreachSimulation {
  scenarioName: string;
  baseCost: number;
  breakdown: FinancialLossCategory[];
  totalExpectedLoss: number;
  lossWithCurrentControls: number;
  lossWithOptimizedControls: number;
}

export interface SecurityInvestmentItem {
  id: string;
  title: string;
  category: string;
  annualCost: number;
  riskReductionPercent: number;
  annualExpectedLossSaved: number;
  netSavings: number;
  roiPercent: number;
  paybackMonths: number;
  selected: boolean;
}

export interface RealTimeThreatEvent {
  id: string;
  timestamp: string;
  title: string;
  threatType: "Zero-Day Vulnerability" | "Vendor Compromise" | "Ransomware Incursion" | "Credential Exfiltration";
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  affectedNodeId: string;
  affectedNodeName: string;
  description: string;
  potentialExposureUSD: number;
  preventedByControlsUSD: number;
  activeStatus: "ACTIVE_INCIDENT" | "CONTAINED" | "MITIGATED";
  automatedRemediationAvailable: boolean;
}
