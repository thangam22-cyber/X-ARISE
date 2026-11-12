import { SecurityControl, SecurityControlDimension } from "../types";

export const DEFAULT_DIMENSION_WEIGHTS: SecurityControlDimension = {
  configuration: 0.25,
  incidentHistory: 0.20,
  teamMaturity: 0.20,
  maintenance: 0.20,
  integration: 0.15
};

export const INITIAL_SECURITY_CONTROLS: SecurityControl[] = [
  {
    id: "ctrl-iam-mfa",
    name: "Identity & Access Management (FIDO2 MFA & SSO)",
    category: "Identity & Access (IAM)",
    description: "Universal hardware-token/authenticator MFA enforcing conditional access and eliminating password spraying.",
    dimensions: {
      configuration: 72,
      incidentHistory: 65,
      teamMaturity: 80,
      maintenance: 85,
      integration: 70
    },
    weights: DEFAULT_DIMENSION_WEIGHTS,
    compositeScore: 74,
    riskMultiplier: 1.35,
    status: "Adequate",
    remediationAction: "Eliminate all SMS/Push prompt MFA fallback and mandate FIDO2 Passkeys on legacy VPN portals.",
    remediationCost: 120000
  },
  {
    id: "ctrl-edr-xdr",
    name: "Next-Gen EDR / XDR Behavioral Heuristics",
    category: "Endpoint Security (EDR/XDR)",
    description: "Continuous kernel-level endpoint behavioral telemetry, ransomware killswitch detection, and automated isolation.",
    dimensions: {
      configuration: 88,
      incidentHistory: 82,
      teamMaturity: 75,
      maintenance: 90,
      integration: 85
    },
    compositeScore: 84,
    weights: DEFAULT_DIMENSION_WEIGHTS,
    riskMultiplier: 1.15,
    status: "Optimized",
    remediationAction: "Deploy EDR agents to 100% of legacy medical devices/OT systems via virtualized micro-agents.",
    remediationCost: 95000
  },
  {
    id: "ctrl-microsegmentation",
    name: "Network Micro-segmentation & Zero-Trust Isolation",
    category: "Network & Edge Security",
    description: "East-West traffic policy enforcement preventing lateral traversal between user subnets and sensitive database tiers.",
    dimensions: {
      configuration: 45,
      incidentHistory: 40,
      teamMaturity: 55,
      maintenance: 60,
      integration: 50
    },
    weights: DEFAULT_DIMENSION_WEIGHTS,
    compositeScore: 49,
    riskMultiplier: 2.10,
    status: "Critical Gap",
    remediationAction: "Implement software-defined micro-segmentation perimeters around PHI/PII database clusters.",
    remediationCost: 180000
  },
  {
    id: "ctrl-cloud-dlp",
    name: "Cloud Data Loss Prevention & S3 Tokenization",
    category: "Data Encryption & DLP",
    description: "Cryptographic tokenization, KMS customer-managed keys, and automated anomaly detection on bulk data exfiltration.",
    dimensions: {
      configuration: 60,
      incidentHistory: 70,
      teamMaturity: 65,
      maintenance: 60,
      integration: 65
    },
    weights: DEFAULT_DIMENSION_WEIGHTS,
    compositeScore: 64,
    riskMultiplier: 1.60,
    status: "Vulnerable",
    remediationAction: "Deploy real-time DLP filters with automated session termination on unauthorized 500MB+ transfers.",
    remediationCost: 110000
  },
  {
    id: "ctrl-siem-soar",
    name: "24/7 Managed SOC & Automated SOAR Playbooks",
    category: "Security Operations (SIEM/SOAR)",
    description: "Unified SIEM event log ingestion with automated SOAR playbooks for host isolation in < 5 minutes.",
    dimensions: {
      configuration: 75,
      incidentHistory: 70,
      teamMaturity: 60,
      maintenance: 80,
      integration: 75
    },
    weights: DEFAULT_DIMENSION_WEIGHTS,
    compositeScore: 72,
    riskMultiplier: 1.40,
    status: "Adequate",
    remediationAction: "Integrate vendor API webhook telemetry directly into centralized automated triage queues.",
    remediationCost: 140000
  },
  {
    id: "ctrl-appsec-sbom",
    name: "AppSec CI/CD Scanner & Software Bill of Materials (SBOM)",
    category: "Cloud & Application Security",
    description: "Static/Dynamic AppSec testing (SAST/DAST) with automated zero-day library vulnerability blocking.",
    dimensions: {
      configuration: 58,
      incidentHistory: 50,
      teamMaturity: 62,
      maintenance: 55,
      integration: 60
    },
    weights: DEFAULT_DIMENSION_WEIGHTS,
    compositeScore: 57,
    riskMultiplier: 1.85,
    status: "Vulnerable",
    remediationAction: "Mandate cryptographically signed build provenance and automated dependency vulnerability gating.",
    remediationCost: 85000
  }
];

export function computeMCDAControlScore(
  dimensions: SecurityControlDimension,
  weights: SecurityControlDimension = DEFAULT_DIMENSION_WEIGHTS
): { compositeScore: number; riskMultiplier: number; status: SecurityControl["status"] } {
  const sumWeights =
    weights.configuration +
    weights.incidentHistory +
    weights.teamMaturity +
    weights.maintenance +
    weights.integration;

  const normalizedWeights = {
    configuration: weights.configuration / sumWeights,
    incidentHistory: weights.incidentHistory / sumWeights,
    teamMaturity: weights.teamMaturity / sumWeights,
    maintenance: weights.maintenance / sumWeights,
    integration: weights.integration / sumWeights
  };

  const composite = Math.round(
    dimensions.configuration * normalizedWeights.configuration +
    dimensions.incidentHistory * normalizedWeights.incidentHistory +
    dimensions.teamMaturity * normalizedWeights.teamMaturity +
    dimensions.maintenance * normalizedWeights.maintenance +
    dimensions.integration * normalizedWeights.integration
  );

  let status: SecurityControl["status"] = "Adequate";
  let riskMultiplier = 1.25;

  if (composite >= 80) {
    status = "Optimized";
    riskMultiplier = 1.05;
  } else if (composite >= 65) {
    status = "Adequate";
    riskMultiplier = 1.35;
  } else if (composite >= 50) {
    status = "Vulnerable";
    riskMultiplier = 1.75;
  } else {
    status = "Critical Gap";
    riskMultiplier = 2.40;
  }

  return { compositeScore: composite, riskMultiplier, status };
}

export function generateCompanyControls(_company?: any): SecurityControl[] {
  return INITIAL_SECURITY_CONTROLS.map(c => ({
    ...c,
    dimensions: { ...c.dimensions },
    weights: { ...c.weights }
  }));
}
