import { CompanyProfile, VendorNode, VendorEdge } from "../types";

/**
 * Graph-Based Cyber Supply Chain & Vendor Risk Engine
 * Models nodes (Company, Tier-1, Tier-2, Tier-3 vendors) and weighted directed edges (Risk Propagation).
 */

export function generateVendorGraph(company: CompanyProfile): {
  nodes: VendorNode[];
  edges: VendorEdge[];
  systemicBlastRadiusUSD: number;
  criticalPathNodes: string[];
} {
  // Base nodes for the company ecosystem
  const nodes: VendorNode[] = [
    {
      id: "node-enterprise-core",
      name: `${company.name} (Core Vault & Data Lake)`,
      category: "Cloud Infrastructure",
      tier: 1,
      riskScore: 35,
      businessCriticality: "Critical",
      accessLevel: "Administrative",
      directDependencies: ["node-cloud-provider", "node-sso-idp", "node-msp-ops"],
      blastRadiusExposure: Math.round(company.revenue * 0.08), // 8% of revenue
      status: "Normal",
      cveExposures: 2
    },
    {
      id: "node-cloud-provider",
      name: company.techStack.find(t => t.includes("AWS") || t.includes("Azure")) || "AWS / Azure Cloud Infrastructure",
      category: "Cloud Infrastructure",
      tier: 1,
      riskScore: 28,
      businessCriticality: "Critical",
      accessLevel: "Full Database Access",
      directDependencies: ["node-storage-backups", "node-dns-router"],
      blastRadiusExposure: Math.round(company.revenue * 0.065),
      status: "Normal",
      cveExposures: 1
    },
    {
      id: "node-sso-idp",
      name: "Identity & Access Broker (Okta / Azure AD / Auth0)",
      category: "SaaS & Productivity",
      tier: 1,
      riskScore: 68,
      businessCriticality: "Critical",
      accessLevel: "Administrative",
      directDependencies: ["node-mfa-provider", "node-enterprise-core"],
      blastRadiusExposure: Math.round(company.revenue * 0.058),
      status: "Warning",
      cveExposures: 3
    },
    {
      id: "node-payment-gateway",
      name: "Payment Processor & Billing Gateway (Stripe / Swift)",
      category: "Payment & FinTech",
      tier: 1,
      riskScore: 42,
      businessCriticality: "High",
      accessLevel: "API Gateway",
      directDependencies: ["node-banking-api", "node-enterprise-core"],
      blastRadiusExposure: Math.round(company.revenue * 0.042),
      status: "Normal",
      cveExposures: 0
    },
    {
      id: "node-msp-ops",
      name: "Global Managed Service Provider (MSP / Remote Helpdesk)",
      category: "Managed Service (MSP)",
      tier: 1,
      riskScore: 84,
      businessCriticality: "Critical",
      accessLevel: "Core Network VPN",
      directDependencies: ["node-rmm-tooling", "node-enterprise-core"],
      blastRadiusExposure: Math.round(company.revenue * 0.075),
      status: "Warning",
      cveExposures: 5
    },
    {
      id: "node-file-transfer",
      name: "Managed File Transfer / EDI (MOVEit / Cleo MFT)",
      category: "Supply Chain / Logistics",
      tier: 2,
      riskScore: 89,
      businessCriticality: "High",
      accessLevel: "Full Database Access",
      directDependencies: ["node-partner-portal", "node-enterprise-core"],
      blastRadiusExposure: Math.round(company.revenue * 0.048),
      status: "Warning",
      cveExposures: 4
    },
    {
      id: "node-rmm-tooling",
      name: "Remote Monitoring & Automation Agent (Kaseya / ScreenConnect)",
      category: "Managed Service (MSP)",
      tier: 2,
      riskScore: 78,
      businessCriticality: "High",
      accessLevel: "Administrative",
      directDependencies: ["node-msp-ops"],
      blastRadiusExposure: Math.round(company.revenue * 0.035),
      status: "Normal",
      cveExposures: 2
    },
    {
      id: "node-analytics-saas",
      name: "Customer Analytics & Telemetry SaaS (Snowflake / Segment)",
      category: "HR & Data Analytics",
      tier: 2,
      riskScore: 45,
      businessCriticality: "Medium",
      accessLevel: "Read-Only",
      directDependencies: ["node-cloud-provider"],
      blastRadiusExposure: Math.round(company.revenue * 0.015),
      status: "Normal",
      cveExposures: 1
    },
    {
      id: "node-shared-oss",
      name: "Open Source Logging & Dependencies (Log4j / Apache / npm)",
      category: "Cloud Infrastructure",
      tier: 3,
      riskScore: 92,
      businessCriticality: "High",
      accessLevel: "API Gateway",
      directDependencies: ["node-file-transfer", "node-cloud-provider"],
      blastRadiusExposure: Math.round(company.revenue * 0.032),
      status: "Warning",
      cveExposures: 6
    },
    {
      id: "node-dns-router",
      name: "Authoritative Cloud DNS & CDN Edge (Cloudflare / Route53)",
      category: "Cloud Infrastructure",
      tier: 3,
      riskScore: 22,
      businessCriticality: "High",
      accessLevel: "API Gateway",
      directDependencies: ["node-enterprise-core"],
      blastRadiusExposure: Math.round(company.revenue * 0.022),
      status: "Normal",
      cveExposures: 0
    }
  ];

  const edges: VendorEdge[] = [
    { id: "e1", source: "node-msp-ops", target: "node-enterprise-core", dataFlow: "Privileged VPN Tunnel & Remote RDP", riskPropagationWeight: 0.88 },
    { id: "e2", source: "node-rmm-tooling", target: "node-msp-ops", dataFlow: "Agent Automation Scripting Pipeline", riskPropagationWeight: 0.82 },
    { id: "e3", source: "node-sso-idp", target: "node-enterprise-core", dataFlow: "SAML 2.0 / OIDC Session Tokens", riskPropagationWeight: 0.90 },
    { id: "e4", source: "node-file-transfer", target: "node-enterprise-core", dataFlow: "Automated Batch Data Synchronizer", riskPropagationWeight: 0.85 },
    { id: "e5", source: "node-shared-oss", target: "node-file-transfer", dataFlow: "Java / Logging Runtime Dependencies", riskPropagationWeight: 0.76 },
    { id: "e6", source: "node-cloud-provider", target: "node-enterprise-core", dataFlow: "VPC Peering & IAM Role Delegation", riskPropagationWeight: 0.94 },
    { id: "e7", source: "node-payment-gateway", target: "node-enterprise-core", dataFlow: "REST Webhook & Tokenized Card Sync", riskPropagationWeight: 0.55 },
    { id: "e8", source: "node-analytics-saas", target: "node-cloud-provider", dataFlow: "ETL Pipeline S3 Bucket Ingestion", riskPropagationWeight: 0.40 },
    { id: "e9", source: "node-dns-router", target: "node-enterprise-core", dataFlow: "Inbound TLS Edge Traffic Proxy", riskPropagationWeight: 0.35 }
  ];

  // Calculate cumulative blast radius of high risk dependencies
  const highRiskNodes = nodes.filter(n => n.riskScore >= 70);
  const systemicBlastRadiusUSD = highRiskNodes.reduce((acc, n) => acc + n.blastRadiusExposure, 0);

  // Critical path nodes (nodes with highest risk propagation leverage into core)
  const criticalPathNodes = ["node-msp-ops", "node-sso-idp", "node-file-transfer", "node-shared-oss"];

  return {
    nodes,
    edges,
    systemicBlastRadiusUSD,
    criticalPathNodes
  };
}

/**
 * Simulates a compromise propagation on a specific vendor node
 * and returns the impacted cascading downstream nodes and loss multiplier.
 */
export function simulateVendorCompromise(
  compromisedNodeId: string,
  nodes: VendorNode[],
  edges: VendorEdge[]
): {
  impactedNodeIds: string[];
  totalFinancialBlastUSD: number;
  containmentRecommendation: string;
} {
  const impacted = new Set<string>([compromisedNodeId]);
  const queue = [compromisedNodeId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    // Find all outgoing edges from current
    const outgoing = edges.filter(e => e.source === current);
    outgoing.forEach(edge => {
      if (!impacted.has(edge.target)) {
        // If edge weight > 0.5, compromise cascades
        if (edge.riskPropagationWeight >= 0.5) {
          impacted.add(edge.target);
          queue.push(edge.target);
        }
      }
    });
  }

  const impactedList = Array.from(impacted);
  const totalFinancialBlastUSD = nodes
    .filter(n => impactedList.includes(n.id))
    .reduce((acc, n) => acc + n.blastRadiusExposure, 0);

  const compromisedNode = nodes.find(n => n.id === compromisedNodeId);
  const containmentRecommendation = `Immediately revoke OAuth/SAML tokens for ${compromisedNode?.name || 'affected vendor'}, isolate VPC peering route tables, and enable zero-trust token inspection on egress endpoints.`;

  return {
    impactedNodeIds: impactedList,
    totalFinancialBlastUSD,
    containmentRecommendation
  };
}
