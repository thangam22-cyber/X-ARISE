import { CompanyProfile } from "../types";

export const PRESET_COMPANIES: CompanyProfile[] = [
  {
    id: "company-apex-health",
    name: "Apex Integrated Health Systems",
    industry: "Healthcare",
    size: "Enterprise (2500-10000)",
    employeeCount: 6800,
    revenue: 720000000, // $720 Million
    geography: ["North America (US East)", "Midwest Region"],
    techStack: [
      "Epic EHR",
      "Citrix Remote Gateway",
      "AWS Cloud & S3",
      "Microsoft Active Directory",
      "VMware ESXi Clusters",
      "Philips Patient Telemetry",
      "Stripe Billing API"
    ],
    dataType: [
      "PHI (HIPAA Protected Health Records)",
      "Patient SSN & DOB",
      "Credit Card / Copay Data",
      "Clinical Diagnostics & Lab Images"
    ],
    criticalAssetsCount: 1420,
    activeVendorsCount: 48,
    annualSecurityBudget: 4200000 // $4.2 Million
  },
  {
    id: "company-finnexus-bank",
    name: "FinNexus Global Banking Corp",
    industry: "Finance",
    size: "Mega-Corp (10000+)",
    employeeCount: 14500,
    revenue: 2400000000, // $2.4 Billion
    geography: ["Global", "US", "EU (GDPR)", "Singapore"],
    techStack: [
      "Azure Cloud",
      "Kubernetes / Microservices",
      "Oracle Financial DB",
      "Swift Interbank Gateway",
      "Fintech OpenBanking APIs",
      "Okta SSO",
      "CrowdStrike Falcon"
    ],
    dataType: [
      "Financial Transaction Logs",
      "KYC Identity Documents & Passports",
      "Bank Account & Routing Numbers",
      "High Net Worth Portfolios"
    ],
    criticalAssetsCount: 3800,
    activeVendorsCount: 92,
    annualSecurityBudget: 16500000 // $16.5 Million
  },
  {
    id: "company-omnicloud-saas",
    name: "OmniCloud B2B Enterprise Platform",
    industry: "Technology",
    size: "Mid-Market (250-2500)",
    employeeCount: 1200,
    revenue: 180000000, // $180 Million
    geography: ["US", "EU", "APAC"],
    techStack: [
      "AWS Multi-Region",
      "Kubernetes & Terraform",
      "GitHub Actions CI/CD",
      "MOVEit File Transfer",
      "PostgreSQL & Redis",
      "Snowflake Data Warehouse",
      "Auth0"
    ],
    dataType: [
      "Client Enterprise Datasets",
      "API Secret Keys & Tokens",
      "Source Code Repositories",
      "Customer Telemetry"
    ],
    criticalAssetsCount: 650,
    activeVendorsCount: 34,
    annualSecurityBudget: 2100000 // $2.1 Million
  },
  {
    id: "company-vanguard-manufacturing",
    name: "Vanguard Heavy Industries & Robotics",
    industry: "Manufacturing",
    size: "Enterprise (2500-10000)",
    employeeCount: 8900,
    revenue: 950000000, // $950 Million
    geography: ["US", "Germany", "Japan", "Mexico"],
    techStack: [
      "Siemens SCADA / Industrial OT",
      "SAP S/4HANA ERP",
      "Windows Active Directory",
      "Palo Alto GlobalProtect VPN",
      "Legacy Windows Embedded",
      "Cisco Industrial Switches"
    ],
    dataType: [
      "Proprietary CAD Blueprints & Patents",
      "Supply Chain Procurement Contracts",
      "Factory Line Sensor Streams",
      "Employee Payroll"
    ],
    criticalAssetsCount: 2200,
    activeVendorsCount: 65,
    annualSecurityBudget: 3800000 // $3.8 Million
  }
];

export const MOCK_COMPANIES = PRESET_COMPANIES;
