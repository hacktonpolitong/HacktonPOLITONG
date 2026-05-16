import { mapPilotAnalysisToDashboardViewModel, type DashboardRisk } from "@/lib/certibridge/dashboard-mappers";
import type { PilotAnalysis, ProductProfile, RiskLevel } from "@/lib/pilot-analysis-types";

export type ReportRoute = {
  name: string;
  whyTriggered: string;
  confidence: string;
  nextAction: string;
};

export type ReportEvidencePlanItem = {
  testName: string;
  priority: DashboardRisk;
  whyNeeded: string;
  estimatedCost: string;
  estimatedDuration: string;
  evidenceNeeded: string;
};

export type FullPackReportModel = ReturnType<typeof buildFullPackReportModel>;

export function buildFullPackReportModel(profile: ProductProfile, analysis: PilotAnalysis, generatedAt = new Date()) {
  const dashboard = mapPilotAnalysisToDashboardViewModel(analysis, profile);
  const routeMapping = buildRouteMapping(analysis);
  const evidencePlan = buildEvidencePlan(analysis);
  const availableEvidence = analysis.proof_checklist
    .filter((item) => item.status === "available")
    .map((item) => item.name);
  const missingEvidence = analysis.proof_checklist
    .filter((item) => item.status !== "available")
    .map((item) => item.name);

  return {
    dashboard,
    generatedDate: formatReportDate(generatedAt),
    fileName: buildFullPackFilename(dashboard.productSummary.name),
    confidence: `${analysis.product_summary.confidence_score}%`,
    availableEvidence,
    missingEvidence,
    routeMapping,
    evidencePlan,
    topRisks: dashboard.trustGaps.slice(0, 3),
    fastestNextActions: analysis.next_7_days_plan.slice(0, 3),
    normalizedDossier: buildNormalizedDossier(analysis)
  };
}

export function buildFullPackFilename(productName: string) {
  return `CertiBridge-Full-Pack-${sanitizeFilenamePart(productName || "Product")}.pdf`;
}

export function sanitizeFilenamePart(value: string) {
  const sanitized = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);

  return sanitized || "Product";
}

export function formatReportDate(value: Date) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit"
  }).format(value);
}

export function normalizeRiskLabel(risk: RiskLevel | DashboardRisk) {
  return risk.replace(/_/g, " ");
}

function buildRouteMapping(analysis: PilotAnalysis): ReportRoute[] {
  const category = `${analysis.product_evidence_profile.canonical_category} ${analysis.product_summary.product_category}`.toLowerCase();
  const routes: ReportRoute[] = [
    {
      name: "EU machinery safety route",
      whyTriggered: "Warehouse automation with moving equipment normally requires a structured safety and technical-file review before buyer confidence.",
      confidence: "High",
      nextAction: "Prepare risk assessment, safety functions summary, manuals, and technical construction file index."
    },
    {
      name: "EMC and wireless evidence route",
      whyTriggered: category.includes("robot") || category.includes("amr") || category.includes("agv")
        ? "Robot operation, charging, controllers, sensors, and wireless communications can trigger EMC/radio evidence requests."
        : "Automation equipment may still need EMC evidence for industrial environments.",
      confidence: category.includes("robot") || category.includes("amr") || category.includes("agv") ? "High" : "Medium",
      nextAction: "Create a lab-ready test plan and map existing reports to EU buyer expectations."
    }
  ];

  if (category.includes("battery") || category.includes("robot") || category.includes("amr") || category.includes("agv")) {
    routes.push({
      name: "Battery and charging safety route",
      whyTriggered: "Mobile robots typically create questions around batteries, charging docks, transport, and emergency response.",
      confidence: "Medium",
      nextAction: "Collect battery specification, charger documentation, transport notes, and incident response guidance."
    });
  }

  routes.push({
    name: "Importer and EU operator accountability",
    whyTriggered: "Italian buyers usually need clarity on who supports the product locally and who owns EU-facing documentation.",
    confidence: "Medium",
    nextAction: "Identify an EU operator, service partner, or importer-facing responsibility model before pilot launch."
  });

  return routes;
}

function buildEvidencePlan(analysis: PilotAnalysis): ReportEvidencePlanItem[] {
  const fromGaps = analysis.trust_gaps.slice(0, 5).map((gap) => ({
    testName: gap.title,
    priority: normalizeRisk(gap.risk_level),
    whyNeeded: gap.buyer_concern,
    estimatedCost: gap.risk_level === "critical" || gap.risk_level === "high" ? "Lab/vendor quote required" : "Internal preparation first",
    estimatedDuration: gap.risk_level === "critical" || gap.risk_level === "high" ? "2-6 weeks" : "3-10 business days",
    evidenceNeeded: gap.required_proof.join(", ") || gap.recommended_mitigation
  }));

  if (fromGaps.length > 0) {
    return fromGaps;
  }

  return analysis.proof_checklist.slice(0, 5).map((item) => ({
    testName: item.name,
    priority: normalizeRisk(item.buyer_confidence_impact),
    whyNeeded: item.recommended_action,
    estimatedCost: item.status === "available" ? "Already available" : "To be defined",
    estimatedDuration: item.status === "available" ? "Ready now" : "1-3 weeks",
    evidenceNeeded: item.category
  }));
}

function buildNormalizedDossier(analysis: PilotAnalysis) {
  return [
    ["Company", analysis.product_summary.company_name],
    ["Product", analysis.product_summary.product_name],
    ["Category", analysis.product_summary.product_category],
    ["Canonical category", analysis.product_evidence_profile.canonical_category],
    ["Intended warehouse use", analysis.product_summary.primary_use_case],
    ["Operational use case", analysis.product_evidence_profile.operational_use_case],
    ["Target market", analysis.product_summary.target_market],
    ["Infrastructure needs", analysis.product_evidence_profile.infrastructure_needs.join(", ")],
    ["Integration needs", analysis.product_evidence_profile.integration_needs.join(", ")],
    ["Safety assumptions", analysis.product_evidence_profile.safety_assumptions.join(", ")],
    ["Support model", analysis.product_evidence_profile.support_model],
    ["Pilot offer", analysis.pilot_offer.title],
    ["Pilot scope", analysis.pilot_offer.scope],
    ["Commercial next step", analysis.pilot_offer.next_commercial_step]
  ].filter(([, value]) => value);
}

function normalizeRisk(risk: RiskLevel): DashboardRisk {
  if (risk === "critical" || risk === "high" || risk === "medium" || risk === "low") {
    return risk;
  }

  return "medium";
}
