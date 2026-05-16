import type { PilotAnalysis, ProductProfile, ReadinessStatus, RiskLevel, SegmentScoreCard, TargetAccount } from "@/lib/pilot-analysis-types";

export type ChecklistStatus = "checked" | "partial" | "missing";
export type DashboardRisk = "critical" | "high" | "medium" | "low";

export type DashboardViewModel = {
  productSummary: {
    name: string;
    company: string;
    category: string;
    targetMarket: string;
    chips: string[];
  };
  score: {
    value: number;
    label: string;
    bullets: string[];
  };
  checklist: {
    id: string;
    label: string;
    status: ChecklistStatus;
  }[];
  buyers: {
    id: string;
    label: string;
    name: string;
    fit: number;
    reason: string;
    pros: string[];
    cons: string[];
    pitchAngle: string;
  }[];
  trustGaps: {
    id: string;
    name: string;
    risk: DashboardRisk;
    fix: string;
  }[];
  battlecards: {
    id: string;
    objection: string;
    answer: string;
    evidenceToAttach: string[];
    risk: DashboardRisk;
  }[];
};

type OptionalReadinessScore = {
  eu_readiness_score?: {
    overall?: number;
    label?: string;
  };
};

const riskWeight = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1
} satisfies Record<DashboardRisk, number>;

const fallbackBuyerSegments = [
  {
    name: "3PL warehouse operators",
    reason: "Outsourced warehouses feel labor and throughput pressure, but can approve a bounded process pilot.",
    pros: ["clear labor bottleneck", "measurable route baseline", "repeatable workflow"],
    cons: ["needs support proof", "site safety review required", "ROI must be localized"]
  },
  {
    name: "E-commerce fulfilment centers",
    reason: "Pick-pack-dispatch flows create visible internal transport pain and fast KPI feedback.",
    pros: ["high movement frequency", "visible cycle-time impact", "modular scaling story"],
    cons: ["peak-season risk", "integration questions", "reference gap matters"]
  },
  {
    name: "Mid-size logistics hubs",
    reason: "Regional hubs can test one zone before wider fleet or WMS integration.",
    pros: ["bounded pilot zone", "fast operational learning", "lower approval load"],
    cons: ["manual fallback needed", "local support expected", "training burden"]
  },
  {
    name: "Cold-chain warehouses",
    reason: "Temperature-sensitive sites value reliable movement, but proof burden is higher.",
    pros: ["strong uptime pain", "defined routes", "premium ROI case"],
    cons: ["environment proof needed", "higher buyer caution", "maintenance SLA required"]
  },
  {
    name: "Industrial distributors",
    reason: "Mixed manual and automated warehouse flows can accept a narrow replenishment pilot.",
    pros: ["repeatable handling paths", "operations-led buyer", "practical pilot wedge"],
    cons: ["legacy process variation", "training proof needed", "integration scope risk"]
  },
  {
    name: "Italian automation integrators",
    reason: "Integrators can reduce trust friction if the vendor lacks local deployment capacity.",
    pros: ["local credibility bridge", "support route", "channel leverage"],
    cons: ["margin tradeoff", "partner diligence", "less direct buyer control"]
  }
];

export function mapPilotAnalysisToDashboardViewModel(
  analysis: PilotAnalysis,
  profile?: ProductProfile
): DashboardViewModel {
  const productName = firstNonEmpty(
    analysis.product_summary.product_name,
    profile?.productName,
    "Warehouse automation product"
  );
  const company = firstNonEmpty(analysis.product_summary.company_name, profile?.companyName, "Chinese automation vendor");
  const category = firstNonEmpty(
    analysis.product_summary.product_category,
    profile?.productCategory,
    analysis.product_evidence_profile.canonical_category
  );
  const targetMarket = firstNonEmpty(profile?.targetMarket, analysis.product_summary.target_market, "Italy");
  const trustGaps = mapTrustGaps(analysis);

  return {
    productSummary: {
      name: productName,
      company,
      category,
      targetMarket,
      chips: buildProductChips(analysis, profile, category, targetMarket)
    },
    score: {
      value: getScoreValue(analysis),
      label: "Pilot Fit Score",
      bullets: buildScoreBullets(analysis, trustGaps)
    },
    checklist: buildChecklist(analysis),
    buyers: buildBuyers(analysis),
    trustGaps,
    battlecards: buildBattlecards(analysis, trustGaps)
  };
}

export function getRiskWeight(risk: DashboardRisk) {
  return riskWeight[risk];
}

function buildProductChips(
  analysis: PilotAnalysis,
  profile: ProductProfile | undefined,
  category: string,
  targetMarket: string
) {
  const text = [
    category,
    profile?.description,
    analysis.product_evidence_profile.detected_keywords.join(" "),
    analysis.product_summary.primary_use_case
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const chips = [
    text.includes("amr") || text.includes("autonomous") ? "Autonomous warehouse robot" : compactLabel(category, 30),
    targetMarket.toLowerCase().includes("italy") ? "Italy / EU" : compactLabel(targetMarket, 20),
    text.includes("battery") || text.includes("wireless") || text.includes("robot") ? "Battery + wireless" : "Operational pilot",
    "Industrial B2B"
  ];

  return uniqueStrings(chips).slice(0, 4);
}

function getScoreValue(analysis: PilotAnalysis) {
  const optionalScore = (analysis as PilotAnalysis & OptionalReadinessScore).eu_readiness_score?.overall;
  const candidate =
    typeof optionalScore === "number"
      ? optionalScore
      : analysis.buyer_segment_recommendation.fit_score || analysis.warehouse_process_recommendation.pilot_suitability_score;

  if (typeof candidate === "number") {
    return clampScore(candidate);
  }

  const ready = analysis.proof_checklist.filter((item) => item.status === "available").length;
  const total = Math.max(analysis.proof_checklist.length, 1);

  return clampScore(Math.round((ready / total) * 100));
}

function buildScoreBullets(
  analysis: PilotAnalysis,
  trustGaps: DashboardViewModel["trustGaps"]
) {
  const strongestProof =
    analysis.product_summary.available_proof[0] ??
    analysis.proof_checklist.find((item) => item.status === "available")?.name ??
    "Product use case is defined";
  const blocker = trustGaps[0]?.name ?? analysis.product_summary.missing_proof[0] ?? "Buyer proof package needs localization";
  const nextMove = analysis.next_7_days_plan[0]?.action ?? analysis.pilot_offer.next_commercial_step;

  return [
    `Strongest proof: ${compactLabel(strongestProof, 58)}`,
    `Biggest blocker: ${compactLabel(blocker, 58)}`,
    `Fastest next move: ${compactLabel(nextMove, 58)}`
  ];
}

function buildChecklist(analysis: PilotAnalysis): DashboardViewModel["checklist"] {
  const mapped = analysis.proof_checklist.map((item) => ({
    id: item.proof_id,
    label: compactChecklistLabel(item.name),
    status: mapReadinessStatus(item.status)
  }));

  if (mapped.length >= 6) {
    return mapped.slice(0, 8);
  }

  const available = analysis.product_summary.available_proof.map((item, index) => ({
    id: `available-${index}`,
    label: compactChecklistLabel(item),
    status: "checked" as ChecklistStatus
  }));
  const missing = analysis.product_summary.missing_proof.map((item, index) => ({
    id: `missing-${index}`,
    label: compactChecklistLabel(item),
    status: "missing" as ChecklistStatus
  }));

  return uniqueById([...mapped, ...available, ...missing]).slice(0, 8);
}

function buildBuyers(analysis: PilotAnalysis): DashboardViewModel["buyers"] {
  const selectedSegment = analysis.buyer_segment_recommendation.segment_name;
  const accountBuyers = analysis.target_account_shortlist.map((account, index) => mapAccountToBuyer(account, analysis, index));
  const segmentBuyers = [...analysis.segment_scorecards]
    .sort((left, right) => left.rank - right.rank)
    .map((segment) => mapSegmentToBuyer(segment, analysis, selectedSegment));
  const fallbackBuyers = fallbackBuyerSegments.map((buyer, index) => ({
    id: `fallback-${index}`,
    label: "",
    name: buyer.name,
    fit: clampScore(74 - index * 3),
    reason: buyer.reason,
    pros: buyer.pros,
    cons: buyer.cons,
    pitchAngle: `Lead with a bounded ${analysis.warehouse_process_recommendation.process_name.toLowerCase()} pilot and prove ROI before scale-up.`
  }));

  return uniqueByName([...accountBuyers, ...segmentBuyers, ...fallbackBuyers])
    .slice(0, 6)
    .map((buyer, index) => ({
      ...buyer,
      label: `Buyer ${index + 1}`
    }));
}

function mapSegmentToBuyer(
  segment: SegmentScoreCard,
  analysis: PilotAnalysis,
  selectedSegment: string
): DashboardViewModel["buyers"][number] {
  const isSelected = normalizeComparable(segment.segment_name) === normalizeComparable(selectedSegment);
  const pros = isSelected
    ? analysis.buyer_segment_recommendation.why_this_segment
    : segment.reasons;
  const cons =
    segment.tradeoffs.length > 0
      ? segment.tradeoffs
      : [
          `${segment.proof_burden} proof burden`,
          `${segment.support_risk} support risk`,
          "buyer will expect localized pilot evidence"
        ];

  return {
    id: segment.segment_id,
    label: "",
    name: segment.segment_name,
    fit: clampScore(segment.score),
    reason: compactLabel(segment.reasons[0] ?? segment.tradeoffs[0] ?? "Useful Italian pilot buyer segment.", 170),
    pros: pros.slice(0, 3).map((item) => compactLabel(item, 82)),
    cons: cons.slice(0, 3).map((item) => compactLabel(item, 82)),
    pitchAngle: `Position ${analysis.product_summary.product_name} as a low-risk ${analysis.pilot_offer.duration_days}-day pilot for ${analysis.warehouse_process_recommendation.process_name.toLowerCase()}.`
  };
}

function mapAccountToBuyer(
  account: TargetAccount,
  analysis: PilotAnalysis,
  index: number
): DashboardViewModel["buyers"][number] {
  return {
    id: `account-${normalizeComparable(account.company_name)}`,
    label: "",
    name: account.company_name,
    fit: clampScore(analysis.buyer_segment_recommendation.fit_score - index * 2),
    reason: compactLabel(account.outreach_angle, 170),
    pros: account.warehouse_signals.slice(0, 3).map((item) => compactLabel(item, 82)),
    cons: [
      "account-specific site data still needed",
      "buyer role path must be confirmed",
      analysis.trust_gaps[0]?.title ?? "local support proof required"
    ].map((item) => compactLabel(item, 82)),
    pitchAngle: `Use ${account.company_name} as a reference profile for the first Italian conversation.`
  };
}

function mapTrustGaps(analysis: PilotAnalysis): DashboardViewModel["trustGaps"] {
  const gaps = analysis.trust_gaps.map((gap) => ({
    id: gap.gap_id,
    name: compactLabel(gap.title, 42),
    risk: normalizeRisk(gap.risk_level),
    fix: compactLabel(gap.recommended_mitigation, 82)
  }));

  return gaps.sort((left, right) => riskWeight[right.risk] - riskWeight[left.risk]).slice(0, 5);
}

function buildBattlecards(
  analysis: PilotAnalysis,
  trustGaps: DashboardViewModel["trustGaps"]
): DashboardViewModel["battlecards"] {
  const battlecards = analysis.objection_battlecard.map((item, index) => ({
    id: `battlecard-${index}`,
    objection: item.objection,
    answer: item.response,
    evidenceToAttach: item.supporting_proof.slice(0, 3),
    risk: normalizeRisk(item.risk_level)
  }));

  if (battlecards.length > 0) {
    return battlecards.slice(0, 5);
  }

  return trustGaps.slice(0, 5).map((gap) => ({
    id: `gap-battlecard-${gap.id}`,
    objection: `Can you close the ${gap.name.toLowerCase()} gap before a pilot?`,
    answer: gap.fix,
    evidenceToAttach: [gap.name],
    risk: gap.risk
  }));
}

function mapReadinessStatus(status: ReadinessStatus): ChecklistStatus {
  if (status === "available") {
    return "checked";
  }

  if (status === "partial" || status === "recommended") {
    return "partial";
  }

  return "missing";
}

function normalizeRisk(risk: RiskLevel | string): DashboardRisk {
  if (risk === "critical" || risk === "high" || risk === "medium" || risk === "low") {
    return risk;
  }

  return "medium";
}

function compactChecklistLabel(value: string) {
  return compactLabel(value.replace(/\b(readiness|documentation|evidence|proof)\b/gi, "").replace(/\s+/g, " ").trim(), 34);
}

function compactLabel(value: string, maxLength: number) {
  const trimmed = value.trim();

  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  return `${trimmed.slice(0, Math.max(0, maxLength - 1)).trim()}...`;
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function firstNonEmpty(...values: Array<string | undefined | null>) {
  return values.find((value) => typeof value === "string" && value.trim().length > 0)?.trim() ?? "";
}

function uniqueStrings(values: string[]) {
  return values.filter((value, index, array) => value && array.findIndex((candidate) => normalizeComparable(candidate) === normalizeComparable(value)) === index);
}

function uniqueById<T extends { id: string }>(values: T[]) {
  return values.filter((value, index, array) => array.findIndex((candidate) => candidate.id === value.id) === index);
}

function uniqueByName<T extends { name: string }>(values: T[]) {
  return values.filter(
    (value, index, array) =>
      value.name && array.findIndex((candidate) => normalizeComparable(candidate.name) === normalizeComparable(value.name)) === index
  );
}

function normalizeComparable(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
