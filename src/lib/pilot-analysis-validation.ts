import targetAccounts from "../../data/italian_target_accounts.json";
import { buildDeterministicPilotAnalysis, type AnalysisMetadataInput } from "./pilot-analysis-fallback";
import type { PilotAnalysis, RiskLevel, TargetAccount } from "./pilot-analysis-types";

type UnknownRecord = Record<string, unknown>;

const riskLevels = new Set<RiskLevel>(["low", "medium", "high", "critical"]);
const readinessStatuses = new Set(["available", "partial", "missing", "recommended"]);
const curatedAccountKeys = new Set(
  (targetAccounts as TargetAccount[]).map((account) => `${account.company_name}::${account.website}`)
);

const blockedContentPatterns = [
  /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
  /linkedin\.com\/in\//i,
  /live[-\s]?scrap/i,
  /scraped\s+lead/i,
  /guaranteed\s+(buyer|lead|sale|reply)/i,
  /certif(y|ied|ication)\s+(compliance|complete|confirmed|guaranteed)/i
];

export function normalizePilotAnalysisCandidate(
  candidate: unknown,
  metadata: AnalysisMetadataInput
): PilotAnalysis | null {
  const unwrapped = unwrapCandidate(candidate);

  if (!isRecord(unwrapped) || containsBlockedContent(unwrapped) || !hasUsableAnalysisShape(unwrapped)) {
    return null;
  }

  const result = unwrapped as unknown as PilotAnalysis;
  const fallback = buildDeterministicPilotAnalysis(metadata);

  return {
    metadata: fallback.metadata,
    product_summary: result.product_summary,
    buyer_segment_recommendation: result.buyer_segment_recommendation,
    warehouse_process_recommendation: result.warehouse_process_recommendation,
    trust_gaps: result.trust_gaps,
    pilot_offer: result.pilot_offer,
    target_account_shortlist: result.target_account_shortlist,
    objection_battlecard: result.objection_battlecard,
    proof_checklist: result.proof_checklist,
    next_7_days_plan: result.next_7_days_plan,
    sales_pack: result.sales_pack
  };
}

export function isPilotAnalysisUsable(candidate: unknown): candidate is PilotAnalysis {
  return isRecord(candidate) && !containsBlockedContent(candidate) && hasUsableAnalysisShape(candidate);
}

function unwrapCandidate(candidate: unknown): unknown {
  if (!isRecord(candidate)) {
    return candidate;
  }

  if (isRecord(candidate.analysis)) {
    return candidate.analysis;
  }

  if (isRecord(candidate.pilot_analysis)) {
    return candidate.pilot_analysis;
  }

  return candidate;
}

function hasUsableAnalysisShape(candidate: UnknownRecord): boolean {
  return (
    hasProductSummary(candidate.product_summary) &&
    hasBuyerSegment(candidate.buyer_segment_recommendation) &&
    hasWarehouseProcess(candidate.warehouse_process_recommendation) &&
    hasTrustGaps(candidate.trust_gaps) &&
    hasPilotOffer(candidate.pilot_offer) &&
    hasTargetAccountShortlist(candidate.target_account_shortlist) &&
    hasObjectionBattlecard(candidate.objection_battlecard) &&
    hasProofChecklist(candidate.proof_checklist) &&
    hasNextSevenDays(candidate.next_7_days_plan) &&
    hasSalesPack(candidate.sales_pack)
  );
}

function hasProductSummary(value: unknown): boolean {
  return (
    isRecord(value) &&
    isNonEmptyString(value.company_name) &&
    isNonEmptyString(value.company_country) &&
    isNonEmptyString(value.product_name) &&
    isNonEmptyString(value.product_category) &&
    isNonEmptyString(value.primary_use_case) &&
    value.target_market === "Italy" &&
    isNonEmptyStringArray(value.core_benefits) &&
    isNonEmptyStringArray(value.deployment_constraints) &&
    Array.isArray(value.available_proof) &&
    Array.isArray(value.missing_proof) &&
    ["low", "medium", "high"].includes(String(value.pilot_complexity)) &&
    isScore(value.confidence_score)
  );
}

function hasBuyerSegment(value: unknown): boolean {
  return (
    isRecord(value) &&
    isNonEmptyString(value.recommended_segment_id) &&
    isNonEmptyString(value.segment_name) &&
    isNonEmptyString(value.typical_buyer_profile) &&
    isScore(value.fit_score) &&
    isNonEmptyStringArray(value.why_this_segment) &&
    isNonEmptyStringArray(value.key_objections) &&
    isNonEmptyStringArray(value.proof_requirements) &&
    Array.isArray(value.alternative_segments)
  );
}

function hasWarehouseProcess(value: unknown): boolean {
  return (
    isRecord(value) &&
    isNonEmptyString(value.process_id) &&
    isNonEmptyString(value.process_name) &&
    isScore(value.pilot_suitability_score) &&
    isNonEmptyStringArray(value.why_suitable) &&
    isNonEmptyStringArray(value.operational_boundaries) &&
    isKpiList(value.kpis, true) &&
    Array.isArray(value.constraints)
  );
}

function hasTrustGaps(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (gap) =>
        isRecord(gap) &&
        isNonEmptyString(gap.gap_id) &&
        isNonEmptyString(gap.title) &&
        riskLevels.has(gap.risk_level as RiskLevel) &&
        isNonEmptyString(gap.buyer_concern) &&
        isNonEmptyString(gap.recommended_mitigation) &&
        isNonEmptyStringArray(gap.required_proof) &&
        isNonEmptyString(gap.owner)
    )
  );
}

function hasPilotOffer(value: unknown): boolean {
  return (
    isRecord(value) &&
    isNonEmptyString(value.title) &&
    typeof value.duration_days === "number" &&
    value.duration_days > 0 &&
    isNonEmptyString(value.scope) &&
    isNonEmptyStringArray(value.included_systems) &&
    isNonEmptyStringArray(value.required_setup) &&
    isKpiList(value.kpis, false) &&
    isNonEmptyStringArray(value.buyer_risk_reducers) &&
    isNonEmptyStringArray(value.proof_required_before_launch) &&
    isNonEmptyString(value.exit_clause) &&
    isNonEmptyString(value.next_commercial_step)
  );
}

function hasTargetAccountShortlist(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.length >= 5 &&
    value.every(
      (account) =>
        isRecord(account) &&
        isNonEmptyString(account.company_name) &&
        isNonEmptyString(account.website) &&
        (typeof account.hq_region === "string" || account.hq_region === null) &&
        isNonEmptyString(account.logistics_category) &&
        isNonEmptyStringArray(account.warehouse_signals) &&
        isNonEmptyStringArray(account.likely_process_fit) &&
        isNonEmptyStringArray(account.recommended_buyer_roles) &&
        isNonEmptyString(account.outreach_angle) &&
        isNonEmptyString(account.source_note) &&
        account.logistics_category === "3PL and e-commerce fulfilment" &&
        account.likely_process_fit.includes("internal transport") &&
        curatedAccountKeys.has(`${account.company_name}::${account.website}`)
    )
  );
}

function hasObjectionBattlecard(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (item) =>
        isRecord(item) &&
        isNonEmptyString(item.objection) &&
        isNonEmptyString(item.response) &&
        Array.isArray(item.supporting_proof) &&
        riskLevels.has(item.risk_level as RiskLevel)
    )
  );
}

function hasProofChecklist(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (item) =>
        isRecord(item) &&
        isNonEmptyString(item.proof_id) &&
        isNonEmptyString(item.name) &&
        isNonEmptyString(item.category) &&
        readinessStatuses.has(String(item.status)) &&
        riskLevels.has(item.buyer_confidence_impact as RiskLevel) &&
        isNonEmptyString(item.recommended_action)
    )
  );
}

function hasNextSevenDays(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.length <= 7 &&
    value.every(
      (item) =>
        isRecord(item) &&
        typeof item.day === "number" &&
        item.day >= 1 &&
        item.day <= 7 &&
        isNonEmptyString(item.action) &&
        isNonEmptyString(item.owner) &&
        isNonEmptyString(item.output)
    )
  );
}

function hasSalesPack(value: unknown): boolean {
  return (
    isRecord(value) &&
    isRecord(value.outreach_email) &&
    isNonEmptyString(value.outreach_email.subject) &&
    isNonEmptyString(value.outreach_email.body) &&
    isNonEmptyString(value.meeting_pitch) &&
    isRecord(value.one_page_pilot_proposal) &&
    isNonEmptyString(value.one_page_pilot_proposal.headline) &&
    isNonEmptyString(value.one_page_pilot_proposal.buyer_problem) &&
    isNonEmptyString(value.one_page_pilot_proposal.pilot_scope) &&
    isNonEmptyStringArray(value.one_page_pilot_proposal.success_metrics) &&
    isNonEmptyStringArray(value.one_page_pilot_proposal.proof_to_share) &&
    isNonEmptyString(value.one_page_pilot_proposal.decision_request) &&
    isNonEmptyString(value.roi_argument) &&
    isNonEmptyString(value.follow_up_message)
  );
}

function isKpiList(value: unknown, requiresMeasurement: boolean): boolean {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (kpi) =>
        isRecord(kpi) &&
        isNonEmptyString(kpi.name) &&
        isNonEmptyString(kpi.target) &&
        (!requiresMeasurement || isNonEmptyString(kpi.measurement))
    )
  );
}

function containsBlockedContent(value: unknown): boolean {
  const serialized = JSON.stringify(value);
  return blockedContentPatterns.some((pattern) => pattern.test(serialized));
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isNonEmptyStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.every(isNonEmptyString);
}

function isScore(value: unknown): boolean {
  return typeof value === "number" && value >= 0 && value <= 100;
}
