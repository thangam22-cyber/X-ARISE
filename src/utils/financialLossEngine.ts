import { CompanyProfile, FinancialBreachSimulation, SecurityInvestmentItem } from "../types";
import { INDUSTRY_BENCHMARKS, STANDARD_COST_BREAKDOWN_MODEL } from "../data/historicalBreaches";

export function calculateBreachCostSimulation(
  company: CompanyProfile,
  controlMultiplier: number = 1.35
): FinancialBreachSimulation {
  // Benchmark sector average breach cost scaled by company revenue
  const sectorBenchmark = INDUSTRY_BENCHMARKS[company.industry]?.avgBreachCostMillions || 4.99;
  const baseCostUSD = sectorBenchmark * 1000000 * Math.max(0.6, Math.min(3.2, company.revenue / 400000000));
  
  const totalExpectedLoss = Math.round(baseCostUSD * controlMultiplier);

  const breakdown = STANDARD_COST_BREAKDOWN_MODEL.map((cat) => {
    const amount = Math.round((totalExpectedLoss * cat.percentage) / 100);
    return {
      category: cat.category,
      percentage: cat.percentage,
      amount,
      timeframe: cat.timeframe,
      description: cat.examples,
      mitigationFactor: 0.65
    };
  });

  const lossWithCurrentControls = totalExpectedLoss;
  const lossWithOptimizedControls = Math.round(totalExpectedLoss * 0.38); // 62% reduction with target controls

  return {
    scenarioName: `${company.name} - ${company.industry} Enterprise Cyber Incursion`,
    baseCost: Math.round(baseCostUSD),
    breakdown,
    totalExpectedLoss,
    lossWithCurrentControls,
    lossWithOptimizedControls
  };
}

export const INITIAL_SECURITY_INVESTMENTS: SecurityInvestmentItem[] = [
  {
    id: "inv-iam-passkeys",
    title: "Zero-Trust Identity & FIDO2 Passkeys Enforcement",
    category: "Identity & Access (IAM)",
    annualCost: 140000,
    riskReductionPercent: 32,
    annualExpectedLossSaved: 1850000,
    netSavings: 1710000,
    roiPercent: 1221,
    paybackMonths: 0.9,
    selected: true
  },
  {
    id: "inv-vendor-isolation",
    title: "Supply Chain & Vendor API Gateway Isolation",
    category: "Network & Vendor Risk",
    annualCost: 110000,
    riskReductionPercent: 26,
    annualExpectedLossSaved: 1420000,
    netSavings: 1310000,
    roiPercent: 1190,
    paybackMonths: 1.1,
    selected: true
  },
  {
    id: "inv-edr-heuristics",
    title: "Next-Gen XDR & Behavioral Ransomware Killswitch",
    category: "Endpoint Security",
    annualCost: 165000,
    riskReductionPercent: 28,
    annualExpectedLossSaved: 1620000,
    netSavings: 1455000,
    roiPercent: 881,
    paybackMonths: 1.2,
    selected: true
  },
  {
    id: "inv-auto-patch",
    title: "Automated Continuous Vulnerability & Exploit Remediation",
    category: "Vulnerability Management",
    annualCost: 95000,
    riskReductionPercent: 22,
    annualExpectedLossSaved: 1250000,
    netSavings: 1155000,
    roiPercent: 1215,
    paybackMonths: 0.9,
    selected: false
  },
  {
    id: "inv-soar-soc",
    title: "24/7 Managed SOAR Incident Response Playbook Automation",
    category: "Security Operations",
    annualCost: 195000,
    riskReductionPercent: 25,
    annualExpectedLossSaved: 1380000,
    netSavings: 1185000,
    roiPercent: 607,
    paybackMonths: 1.7,
    selected: false
  },
  {
    id: "inv-immutable-backup",
    title: "Immutable Air-Gapped Cloud Storage & Ransomware Failover",
    category: "Disaster Recovery",
    annualCost: 125000,
    riskReductionPercent: 19,
    annualExpectedLossSaved: 980000,
    netSavings: 855000,
    roiPercent: 684,
    paybackMonths: 1.5,
    selected: false
  }
];

export function generateFinancialBreachSimulation(company: CompanyProfile) {
  const sim = calculateBreachCostSimulation(company);
  return {
    simulation: sim,
    recommendedInvestments: INITIAL_SECURITY_INVESTMENTS.map(i => ({ ...i }))
  };
}
