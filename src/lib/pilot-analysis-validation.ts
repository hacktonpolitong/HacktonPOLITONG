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
    product_evidence_profile: result.product_evidence_profile,
    segment_scorecards: result.segment_scorecards,
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

export function getPilotAnalysisValidationIssues(candidate: unknown): string[] {
  const unwrapped = unwrapCandidate(candidate);

  if (!isRecord(unwrapped)) {
    return ["candidate_not_object"];
  }

  const issues: string[] = [];

  if (containsBlockedContent(unwrapped)) {
    issues.push("blocked_content_guardrail");
  }

  if (!hasProductEvidenceProfile(unwrapped.product_evidence_profile)) {
    issues.push("product_evidence_profile_invalid");
  }

  if (!hasSegmentScorecards(unwrapped.segment_scorecards)) {
    issues.push("segment_scorecards_invalid");
  }

  if (!hasProductSummary(unwrapped.product_summary)) {
    issues.push("product_summary_invalid");
  }

  if (!hasBuyerSegment(unwrapped.buyer_segment_recommendation)) {
    issues.push("buyer_segment_recommendation_invalid");
  }

  if (!hasWarehouseProcess(unwrapped.warehouse_process_recommendation)) {
    issues.push("warehouse_process_recommendation_invalid");
  }

  if (!hasTrustGaps(unwrapped.trust_gaps)) {
    issues.push("trust_gaps_invalid");
  }

  if (!hasPilotOffer(unwrapped.pilot_offer)) {
    issues.push("pilot_offer_invalid");
  }

  if (!hasTargetAccountShortlist(unwrapped.target_account_shortlist)) {
    issues.push("target_account_shortlist_invalid");
  }

  if (!hasObjectionBattlecard(unwrapped.objection_battlecard)) {
    issues.push("objection_battlecard_invalid");
  }

  if (!hasProofChecklist(unwrapped.proof_checklist)) {
    issues.push("proof_checklist_invalid");
  }

  if (!hasNextSevenDays(unwrapped.next_7_days_plan)) {
    issues.push("next_7_days_plan_invalid");
  }

  if (!hasSalesPack(unwrapped.sales_pack)) {
    issues.push("sales_pack_invalid");
  }

  return issues;
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
    hasProductEvidenceProfile(candidate.product_evidence_profile) &&
    hasSegmentScorecards(candidate.segment_scorecards) &&
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

function hasProductEvidenceProfile(value: unknown): boolean {
  return (
    isRecord(value) &&
    isNonEmptyString(value.canonical_category) &&
    isNonEmptyString(value.evidence_summary) &&
    isNonEmptyString(value.operational_use_case) &&
    isNonEmptyStringArray(value.infrastructure_needs) &&
    isNonEmptyStringArray(value.integration_needs) &&
    isNonEmptyStringArray(value.safety_assumptions) &&
    isNonEmptyString(value.support_model) &&
    (typeof value.region_preference === "string" || value.region_preference === null) &&
    Array.isArray(value.detected_keywords)
  );
}

function hasSegmentScorecards(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (scorecard) =>
        isRecord(scorecard) &&
        isNonEmptyString(scorecard.segment_id) &&
        isNonEmptyString(scorecard.segment_name) &&
        isScore(scorecard.score) &&
        typeof scorecard.rank === "number" &&
        scorecard.rank > 0 &&
        Array.isArray(scorecard.process_matches) &&
        ["low", "medium", "high"].includes(String(scorecard.proof_burden)) &&
        riskLevels.has(scorecard.support_risk as RiskLevel) &&
        isNonEmptyStringArray(scorecard.reasons) &&
        Array.isArray(scorecard.tradeoffs)
    )
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
