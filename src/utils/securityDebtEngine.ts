import { SecurityDebtItem } from "../types";

export const INITIAL_SECURITY_DEBT_ITEMS: SecurityDebtItem[] = [
  {
    id: "debt-1",
    cveId: "CVE-2024-3400",
    title: "Palo Alto PAN-OS GlobalProtect Command Injection RCE",
    affectedAsset: "Public VPN & Edge Gateway Cluster",
    principalRisk: 185000,
    dailyInterestRate: 0.024, // 2.4% daily compound interest
    daysOutstanding: 28,
    currentCompoundedRisk: 358400,
    maturityDate: "2026-09-08",
    exploitStatus: "Mass C2 Automation",
    cvssScore: 10.0,
    remediationCost: 18000,
    priority: "P1 - Critical"
  },
  {
    id: "debt-2",
    cveId: "CVE-2023-34362",
    title: "MOVEit Transfer Unauthenticated SQL Injection",
    affectedAsset: "Enterprise File Transfer & Partner EDI Service",
    principalRisk: 240000,
    dailyInterestRate: 0.021, // 2.1% daily
    daysOutstanding: 45,
    currentCompoundedRisk: 610000,
    maturityDate: "2026-09-02",
    exploitStatus: "Ransomware Weaponized",
    cvssScore: 9.8,
    remediationCost: 24000,
    priority: "P1 - Critical"
  },
  {
    id: "debt-3",
    cveId: "CVE-2024-21887",
    title: "Ivanti Connect Secure Web Server Command Injection",
    affectedAsset: "Remote Access Portal & Employee Citrix Farm",
    principalRisk: 150000,
    dailyInterestRate: 0.018,
    daysOutstanding: 32,
    currentCompoundedRisk: 265000,
    maturityDate: "2026-09-14",
    exploitStatus: "Active In-The-Wild Exploit",
    cvssScore: 9.1,
    remediationCost: 15000,
    priority: "P1 - Critical"
  },
  {
    id: "debt-4",
    cveId: "CVE-2024-6387",
    title: "OpenSSH regreSSHion Remote Code Execution in glibc",
    affectedAsset: "Internal Linux Application & Kubernetes Nodes",
    principalRisk: 95000,
    dailyInterestRate: 0.012,
    daysOutstanding: 54,
    currentCompoundedRisk: 180000,
    maturityDate: "2026-09-28",
    exploitStatus: "PoC Available",
    cvssScore: 8.1,
    remediationCost: 12000,
    priority: "P2 - High"
  },
  {
    id: "debt-5",
    cveId: "CVE-2023-4863",
    title: "libwebp Heap Buffer Overflow Graphic Processing",
    affectedAsset: "Customer Facing Web Portal Frontends",
    principalRisk: 60000,
    dailyInterestRate: 0.009,
    daysOutstanding: 60,
    currentCompoundedRisk: 102000,
    maturityDate: "2026-10-15",
    exploitStatus: "PoC Available",
    cvssScore: 8.8,
    remediationCost: 8000,
    priority: "P3 - Medium"
  }
];

/**
 * Calculates current compounded security debt and future projected exposure trajectory
 */
export function calculateCompoundedDebt(item: SecurityDebtItem, additionalDays: number = 0): number {
  const totalDays = item.daysOutstanding + additionalDays;
  // Threat multiplier based on exploit status
  let threatMultiplier = 1.0;
  if (item.exploitStatus === "Mass C2 Automation") threatMultiplier = 1.6;
  else if (item.exploitStatus === "Ransomware Weaponized") threatMultiplier = 1.4;
  else if (item.exploitStatus === "Active In-The-Wild Exploit") threatMultiplier = 1.25;

  const compounded = item.principalRisk * Math.pow(1 + item.dailyInterestRate, totalDays) * threatMultiplier;
  return Math.round(compounded);
}

export function generateDebtGrowthTimeSeries(items: SecurityDebtItem[], daysForecast: number = 60) {
  const activeItems = items.filter(i => !i.isResolved);
  const data = [];

  for (let day = 0; day <= daysForecast; day += 5) {
    let totalCompoundedRisk = 0;
    let totalPrincipal = 0;

    activeItems.forEach(item => {
      totalPrincipal += item.principalRisk;
      totalCompoundedRisk += calculateCompoundedDebt(item, day);
    });

    data.push({
      day: `Day +${day}`,
      dayNumber: day,
      principalBaseRisk: Math.round(totalPrincipal / 1000), // in $k
      compoundedSecurityDebt: Math.round(totalCompoundedRisk / 1000), // in $k
      accruedInterestLoss: Math.round((totalCompoundedRisk - totalPrincipal) / 1000)
    });
  }

  return data;
}

export function generateCompanySecurityDebt(_company?: any): SecurityDebtItem[] {
  return INITIAL_SECURITY_DEBT_ITEMS.map(i => ({ ...i }));
}
