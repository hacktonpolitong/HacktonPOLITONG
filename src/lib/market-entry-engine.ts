import italianSegmentsData from "../../data/italian_segments.json";
import proofChecklistData from "../../data/proof_checklist.json";
import targetAccountsData from "../../data/italian_target_accounts.json";
import trustGapsData from "../../data/trust_gaps.json";
import warehouseProcessesData from "../../data/warehouse_processes.json";
import type {
  AnalysisKeySource,
  AnalysisMode,
  AnalysisProvider,
  AnalyzeRequestBody,
  CanonicalProductCategory,
  EvidenceInputs,
  PilotAnalysis,
  ProductEvidenceProfile,
  ProductProfile,
  ReadinessStatus,
  RiskLevel,
  SegmentScoreCard,
  TargetAccount
} from "./pilot-analysis-types";

export type DynamicAnalysisMetadataInput = {
  analysisMode?: AnalysisMode;
  provider?: AnalysisProvider;
  model?: string;
  keySource?: AnalysisKeySource;
};

type ItalianSegment = {
  id: string;
  segment_name: string;
  buyer_profile: {
    decision_maker_titles: string[];
    summary: string;
  };
  warehouse_context: string;
  plausible_italian_regions: string[];
  common_warehouse_processes: string[];
  key_objections: string[];
  proof_requirements: string[];
  fit_score_rationale: string;
};

type WarehouseProcess = {
  id: string;
  process_name: string;
  operational_description: string;
  suitable_product_categories: string[];
  compatible_buyer_segments: string[];
  pilot_suitability_score: number;
  score_rationale: string;
  measurable_kpis: string[];
  constraints: string[];
  recommended_pilot_shape: {
    duration_days: number;
    number_of_systems: string;
    scope: string;
    initial_shift: string;
    risk_reducer: string;
  };
};

type TrustGapSeed = {
  id: string;
  title: string;
  risk_level: RiskLevel;
  product_categories_affected: string[];
  buyer_concern: string;
  recommended_mitigation: string;
  proof_to_prepare: string[];
};

type ProofChecklistSeed = {
  id: string;
  proof_item_name: string;
  category: string;
  why_italian_buyer_needs_it: string;
  minimum_content_expected: string;
  required_for_pilot_launch: boolean;
  buyer_confidence_impact: RiskLevel;
};

type ParsedProduct = {
  profile: ProductProfile;
  evidenceInputs: EvidenceInputs;
  combinedText: string;
  category: CanonicalProductCategory;
  operationalUseCase: string;
  availableProof: string[];
  missingProof: string[];
  deploymentConstraints: string[];
  infrastructureNeeds: string[];
  integrationNeeds: string[];
  safetyAssumptions: string[];
  supportModel: string;
  regionPreference: string | null;
  detectedKeywords: string[];
  pilotComplexity: "low" | "medium" | "high";
  confidenceScore: number;
};

type SegmentCandidate = {
  segment: ItalianSegment;
  scorecard: Omit<SegmentScoreCard, "rank">;
};

const DEFAULT_PROFILE: ProductProfile = {
  companyName: "Shenzhen Northstar Mobility",
  productCategory: "AMR robots for internal warehouse transport",
  targetMarket: "Italy",
  description:
    "Autonomous mobile robots for internal warehouse transport between picking, packing and dispatch staging zones.",
  benefits: [
    "Reduce manual walking time",
    "Deploy in one warehouse zone before scaling",
    "Avoid full conveyor redesign"
  ],
  currentProof: ["Technical specifications", "API summary"],
  documentationStatus:
    "Technical specs and API summary available; CE/safety summary, Italian support model and localized ROI proof still need buyer-ready packaging.",
  pilotAmbition: "Win a first Italian pilot.",
  constraints: [
    "No Italian reference customer",
    "No local maintenance partner identified",
    "ROI assumptions must be localized to the buyer's baseline"
  ]
};

const SEGMENT_ACCOUNT_CATEGORY: Record<string, string> = {
  it_3pl_ecommerce: "3PL and e-commerce fulfilment",
  it_retail_logistics: "Retail logistics and fashion distribution",
  it_food_beverage: "Food and beverage logistics",
  it_pharma_logistics: "Pharma logistics",
  it_parcel_sorting: "Parcel, courier, and sorting operations",
  it_manufacturing_warehouses: "Manufacturing and industrial distribution"
};

const PROCESS_FIT_LABEL: Record<string, string> = {
  internal_transport: "internal transport",
  picking_support: "picking support",
  parcel_sorting: "parcel sorting",
  pallet_movement: "pallet movement",
  inventory_scanning: "inventory scanning",
  line_side_replenishment: "line-side replenishment"
};

const CATEGORY_PROCESS_WEIGHTS: Record<CanonicalProductCategory, string[]> = {
  AMR: ["internal_transport", "picking_support", "line_side_replenishment", "inventory_scanning", "pallet_movement"],
  AGV: ["pallet_movement", "line_side_replenishment", "internal_transport"],
  "sorting automation": ["parcel_sorting", "picking_support"],
  "palletizing automation": ["pallet_movement", "line_side_replenishment"],
  "picking robot": ["picking_support", "inventory_scanning"],
  "inventory scanning robot": ["inventory_scanning", "picking_support"],
  "WMS/orchestration": ["internal_transport", "picking_support", "parcel_sorting", "inventory_scanning", "pallet_movement"]
};

const CATEGORY_SEGMENT_WEIGHTS: Record<CanonicalProductCategory, string[]> = {
  AMR: ["it_3pl_ecommerce", "it_retail_logistics", "it_manufacturing_warehouses"],
  AGV: ["it_food_beverage", "it_manufacturing_warehouses", "it_3pl_ecommerce"],
  "sorting automation": ["it_parcel_sorting", "it_3pl_ecommerce", "it_retail_logistics"],
  "palletizing automation": ["it_food_beverage", "it_manufacturing_warehouses"],
  "picking robot": ["it_3pl_ecommerce", "it_retail_logistics", "it_pharma_logistics"],
  "inventory scanning robot": ["it_retail_logistics", "it_pharma_logistics", "it_manufacturing_warehouses"],
  "WMS/orchestration": ["it_3pl_ecommerce", "it_retail_logistics", "it_parcel_sorting", "it_pharma_logistics"]
};

const italianSegments = italianSegmentsData.segments as ItalianSegment[];
const warehouseProcesses = warehouseProcessesData.processes as WarehouseProcess[];
const trustGapSeeds = trustGapsData.trust_gaps as TrustGapSeed[];
const proofChecklistSeeds = proofChecklistData.items as ProofChecklistSeed[];
const targetAccounts = targetAccountsData as TargetAccount[];

export function buildMarketEntryPilotAnalysis(
  requestBody: unknown = {},
  metadata: DynamicAnalysisMetadataInput = {}
): PilotAnalysis {
  const request = normalizeAnalyzeRequestBody(requestBody);
  const product = parseProductProfile(request);
  const segmentCandidates = scoreItalianSegments(product);
  const segmentScorecards = segmentCandidates.map((candidate, index) => ({
    ...candidate.scorecard,
    rank: index + 1
  }));
  const selectedSegment = segmentCandidates[0]?.segment ?? italianSegments[0];
  const selectedProcess = selectWarehouseProcess(product, selectedSegment);
  const proofChecklist = buildProofChecklist(product);
  const trustGaps = analyzeTrustGaps(product, selectedSegment, selectedProcess, proofChecklist);
  const shortlist = findTargetAccounts(selectedSegment, selectedProcess, product.regionPreference);
  const pilotOffer = generatePilotPackage(product, selectedSegment, selectedProcess, trustGaps);
  const objectionBattlecard = generateObjectionBattlecard(selectedSegment, trustGaps);
  const salesPack = generateSalesPack(product, selectedSegment, selectedProcess, pilotOffer, trustGaps, shortlist);
  const analysis: PilotAnalysis = {
    metadata: buildMetadata(product, metadata),
    product_evidence_profile: buildProductEvidenceProfile(product),
    segment_scorecards: segmentScorecards,
    product_summary: {
      company_name: product.profile.companyName,
      company_country: "China",
      product_name: product.profile.companyName,
      product_category: product.category,
      primary_use_case: product.operationalUseCase,
      target_market: "Italy",
      core_benefits: ensureNonEmpty(product.profile.benefits, ["Reduce operational friction in a bounded warehouse process."]),
      deployment_constraints: ensureNonEmpty(product.deploymentConstraints, ["Pilot scope must stay bounded and manually recoverable."]),
      available_proof: product.availableProof,
      missing_proof: product.missingProof,
      pilot_complexity: product.pilotComplexity,
      confidence_score: product.confidenceScore
    },
    buyer_segment_recommendation: {
      recommended_segment_id: selectedSegment.id,
      segment_name: selectedSegment.segment_name,
      typical_buyer_profile: `${selectedSegment.buyer_profile.summary} Likely roles: ${selectedSegment.buyer_profile.decision_maker_titles.join(", ")}.`,
      fit_score: segmentScorecards[0]?.score ?? 70,
      why_this_segment: ensureNonEmpty(segmentScorecards[0]?.reasons, [selectedSegment.fit_score_rationale]),
      key_objections: selectedSegment.key_objections,
      proof_requirements: selectedSegment.proof_requirements,
      alternative_segments: segmentScorecards.slice(1, 4).map((scorecard) => ({
        segment_id: scorecard.segment_id,
        segment_name: scorecard.segment_name,
        fit_score: scorecard.score,
        tradeoff: scorecard.tradeoffs[0] ?? "Credible later segment, but less focused for the first Italian pilot."
      }))
    },
    warehouse_process_recommendation: {
      process_id: selectedProcess.id,
      process_name: selectedProcess.process_name,
      pilot_suitability_score: clampScore(selectedProcess.pilot_suitability_score * 10),
      why_suitable: [
        selectedProcess.score_rationale,
        `The process maps to ${product.category} and can be tested without positioning the project as a full warehouse transformation.`
      ],
      operational_boundaries: [
        selectedProcess.recommended_pilot_shape.scope,
        selectedProcess.recommended_pilot_shape.initial_shift,
        selectedProcess.recommended_pilot_shape.risk_reducer
      ],
      kpis: selectedProcess.measurable_kpis.slice(0, 4).map((kpi) => ({
        name: titleCase(kpi),
        measurement: `Baseline and pilot-period comparison for ${kpi}.`,
        target: targetForKpi(kpi)
      })),
      constraints: selectedProcess.constraints
    },
    trust_gaps: trustGaps,
    pilot_offer: pilotOffer,
    target_account_shortlist: shortlist,
    objection_battlecard: objectionBattlecard,
    proof_checklist: proofChecklist,
    next_7_days_plan: generateNextSevenDaysPlan(product, selectedProcess, trustGaps),
    sales_pack: salesPack
  };

  return analysis;
}

function normalizeAnalyzeRequestBody(value: unknown): AnalyzeRequestBody {
  if (!isRecord(value)) {
    return { profile: DEFAULT_PROFILE, evidence_inputs: {} };
  }

  return {
    profile: isRecord(value.profile) ? (value.profile as Partial<ProductProfile>) : DEFAULT_PROFILE,
    evidence_inputs: isRecord(value.evidence_inputs) ? (value.evidence_inputs as EvidenceInputs) : {}
  };
}

function parseProductProfile(request: AnalyzeRequestBody): ParsedProduct {
  const profile = normalizeProductProfile(request.profile);
  const evidenceInputs = request.evidence_inputs ?? {};
  const evidenceText = [
    profile.productCategory,
    profile.description,
    profile.documentationStatus,
    profile.pilotAmbition,
    profile.benefits.join(" "),
    profile.currentProof.join(" "),
    profile.constraints.join(" "),
    evidenceInputs.chinese_documentation_text,
    evidenceInputs.website_product_text,
    evidenceInputs.technical_specs_text,
    evidenceInputs.proof_certification_notes,
    evidenceInputs.case_study_roi_notes
  ]
    .filter(Boolean)
    .join(" ");
  const combinedText = normalizeText(evidenceText);
  const category = classifyCategory(combinedText);
  const availableProof = dedupe([
    ...profile.currentProof,
    ...detectAvailableProof(combinedText)
  ]);
  const missingProof = dedupe(detectMissingProof(combinedText, availableProof));
  const integrationNeeds = detectIntegrationNeeds(combinedText, category);
  const infrastructureNeeds = detectInfrastructureNeeds(combinedText, category);
  const safetyAssumptions = detectSafetyAssumptions(combinedText, missingProof);
  const supportModel = detectSupportModel(combinedText);
  const deploymentConstraints = dedupe([
    ...profile.constraints,
    ...integrationNeeds,
    ...infrastructureNeeds,
    ...safetyAssumptions
  ]);
  const detectedKeywords = detectKeywords(combinedText);

  return {
    profile,
    evidenceInputs,
    combinedText,
    category,
    operationalUseCase: inferUseCase(combinedText, category),
    availableProof,
    missingProof,
    deploymentConstraints,
    infrastructureNeeds,
    integrationNeeds,
    safetyAssumptions,
    supportModel,
    regionPreference: normalizeRegionPreference(evidenceInputs.region_preference ?? combinedText),
    detectedKeywords,
    pilotComplexity: estimateComplexity(category, missingProof, combinedText),
    confidenceScore: estimateConfidenceScore(profile, availableProof, combinedText)
  };
}

function normalizeProductProfile(value: Partial<ProductProfile> | undefined): ProductProfile {
  return {
    companyName: nonEmptyString(value?.companyName) ?? DEFAULT_PROFILE.companyName,
    productCategory: nonEmptyString(value?.productCategory) ?? DEFAULT_PROFILE.productCategory,
    targetMarket: nonEmptyString(value?.targetMarket) ?? "Italy",
    description: nonEmptyString(value?.description) ?? DEFAULT_PROFILE.description,
    benefits: nonEmptyArray(value?.benefits) ?? DEFAULT_PROFILE.benefits,
    currentProof: nonEmptyArray(value?.currentProof) ?? DEFAULT_PROFILE.currentProof,
    documentationStatus: nonEmptyString(value?.documentationStatus) ?? DEFAULT_PROFILE.documentationStatus,
    pilotAmbition: nonEmptyString(value?.pilotAmbition) ?? DEFAULT_PROFILE.pilotAmbition,
    constraints: nonEmptyArray(value?.constraints) ?? DEFAULT_PROFILE.constraints
  };
}

function scoreItalianSegments(product: ParsedProduct): SegmentCandidate[] {
  const preferredSegments = CATEGORY_SEGMENT_WEIGHTS[product.category];
  const preferredProcesses = CATEGORY_PROCESS_WEIGHTS[product.category].map((id) => PROCESS_FIT_LABEL[id] ?? id);

  return italianSegments
    .map((segment) => {
      const processMatches = segment.common_warehouse_processes.filter((process) =>
        preferredProcesses.some((preferred) => normalizeText(process).includes(normalizeText(preferred)))
      );
      const rankBoost = preferredSegments.includes(segment.id) ? 24 - preferredSegments.indexOf(segment.id) * 5 : 0;
      const processBoost = processMatches.length * 10;
      const proofPenalty = proofBurdenPenalty(segment, product);
      const supportPenalty = hasMissingProof(product, "support SLA") || hasMissingProof(product, "maintenance plan and spare parts") ? 4 : 0;
      const score = clampScore(46 + rankBoost + processBoost - proofPenalty - supportPenalty);
      const supportRisk: RiskLevel = supportPenalty > 0 ? "high" : "medium";

      return {
        segment,
        scorecard: {
          segment_id: segment.id,
          segment_name: segment.segment_name,
          score,
          process_matches: processMatches,
          proof_burden: proofBurden(segment),
          support_risk: supportRisk,
          reasons: [
            `${segment.segment_name} matches ${processMatches.length || 1} relevant process signal(s) for ${product.category}.`,
            segment.fit_score_rationale
          ],
          tradeoffs: [
            proofPenalty > 0
              ? `Requires stronger buyer proof around ${segment.proof_requirements.slice(0, 3).join(", ")}.`
              : "Lower proof burden than more regulated or disruption-sensitive segments."
          ]
        }
      };
    })
    .sort((a, b) => b.scorecard.score - a.scorecard.score);
}

function selectWarehouseProcess(product: ParsedProduct, segment: ItalianSegment): WarehouseProcess {
  const preferredProcessIds = CATEGORY_PROCESS_WEIGHTS[product.category];
  const segmentProcessText = normalizeText(segment.common_warehouse_processes.join(" "));

  return [...warehouseProcesses]
    .sort((a, b) => scoreProcess(b, preferredProcessIds, segmentProcessText) - scoreProcess(a, preferredProcessIds, segmentProcessText))[0];
}

function scoreProcess(process: WarehouseProcess, preferredProcessIds: string[], segmentProcessText: string): number {
  const preferredRank = preferredProcessIds.includes(process.id) ? 30 - preferredProcessIds.indexOf(process.id) * 4 : 0;
  const processLabel = PROCESS_FIT_LABEL[process.id] ?? process.process_name;
  const segmentBoost = segmentProcessText.includes(normalizeText(processLabel)) ? 16 : 0;

  return process.pilot_suitability_score * 10 + preferredRank + segmentBoost;
}

function buildProofChecklist(product: ParsedProduct): PilotAnalysis["proof_checklist"] {
  return proofChecklistSeeds.map((item) => {
    const name = item.proof_item_name;
    const status = proofStatus(name, product);

    return {
      proof_id: item.id,
      name,
      category: item.category,
      status,
      buyer_confidence_impact: item.buyer_confidence_impact,
      recommended_action: actionForProof(item, status)
    };
  });
}

function analyzeTrustGaps(
  product: ParsedProduct,
  segment: ItalianSegment,
  process: WarehouseProcess,
  proofChecklist: PilotAnalysis["proof_checklist"]
): PilotAnalysis["trust_gaps"] {
  const proofByName = new Map(proofChecklist.map((item) => [normalizeText(item.name), item]));
  const categoryRelevantGaps = trustGapSeeds.filter((gap) => gap.product_categories_affected.includes(product.category));
  const gaps = categoryRelevantGaps
    .map((gap) => {
      const proofStatuses = gap.proof_to_prepare.map((proof) => proofByName.get(normalizeText(proof))?.status ?? "recommended");
      const hasMissing = proofStatuses.includes("missing");
      const hasPartial = proofStatuses.includes("partial");
      const risk = escalateRisk(gap.risk_level, hasMissing, gap.id);
      const hasOpenProofConcern = hasMissing || hasPartial;

      return {
        gap_id: gap.id,
        title: gap.title,
        risk_level: hasOpenProofConcern ? risk : softenRisk(risk),
        buyer_concern: gap.buyer_concern,
        recommended_mitigation: `${gap.recommended_mitigation} Keep the first pilot bounded to ${process.recommended_pilot_shape.scope}.`,
        required_proof: gap.proof_to_prepare,
        owner: gap.id.includes("wms") ? "joint" : "vendor"
      };
    })
    .sort((a, b) => riskWeight(b.risk_level) - riskWeight(a.risk_level));

  return gaps.slice(0, 6);
}

function generatePilotPackage(
  product: ParsedProduct,
  segment: ItalianSegment,
  process: WarehouseProcess,
  trustGaps: PilotAnalysis["trust_gaps"]
): PilotAnalysis["pilot_offer"] {
  const pilotShape = process.recommended_pilot_shape;

  return {
    title: `${pilotShape.duration_days}-day ${product.category} pilot for ${segment.segment_name}`,
    duration_days: pilotShape.duration_days,
    scope: `${pilotShape.scope} for ${process.process_name.toLowerCase()} in one controlled Italian site.`,
    included_systems: [
      pilotShape.number_of_systems,
      `${product.category} workflow configuration`,
      "Pilot KPI worksheet",
      "Remote support and weekly review"
    ],
    required_setup: [
      ...process.constraints.slice(0, 4),
      "Buyer route or zone baseline",
      "Manual fallback procedure"
    ],
    kpis: process.measurable_kpis.slice(0, 3).map((kpi) => ({
      name: titleCase(kpi),
      target: targetForKpi(kpi)
    })),
    buyer_risk_reducers: [
      pilotShape.risk_reducer,
      "Manual fallback remains active",
      "Weekly KPI review",
      "Exit condition before expansion"
    ],
    proof_required_before_launch: dedupe(trustGaps.flatMap((gap) => gap.required_proof)).slice(0, 8),
    exit_clause:
      "The buyer can stop after the pilot if agreed KPI, safety, support, or disruption thresholds are not met.",
    next_commercial_step:
      "If the pilot meets the agreed baseline improvements, propose a paid expansion to adjacent zones or a second process."
  };
}

function findTargetAccounts(
  segment: ItalianSegment,
  process: WarehouseProcess,
  regionPreference: string | null
): TargetAccount[] {
  const targetCategory = SEGMENT_ACCOUNT_CATEGORY[segment.id];
  const processFit = PROCESS_FIT_LABEL[process.id] ?? normalizeText(process.process_name);
  const matchingCategory = targetAccounts.filter((account) => account.logistics_category === targetCategory);
  const pool = matchingCategory.length >= 5 ? matchingCategory : targetAccounts;

  return pool
    .map((account) => ({
      account,
      score:
        (account.logistics_category === targetCategory ? 40 : 0) +
        (account.likely_process_fit.some((fit) => normalizeText(fit).includes(normalizeText(processFit))) ? 30 : 0) +
        (regionPreference && account.hq_region === regionPreference ? 20 : 0) +
        Math.min(account.warehouse_signals.length, 5)
    }))
    .sort((a, b) => b.score - a.score)
    .map(({ account }) => account)
    .slice(0, 10);
}

function generateObjectionBattlecard(
  segment: ItalianSegment,
  trustGaps: PilotAnalysis["trust_gaps"]
): PilotAnalysis["objection_battlecard"] {
  const gapCards = trustGaps.slice(0, 4).map((gap) => ({
    objection: gap.buyer_concern,
    response: gap.recommended_mitigation,
    supporting_proof: gap.required_proof,
    risk_level: gap.risk_level
  }));

  return gapCards.length > 0
    ? gapCards
    : segment.key_objections.slice(0, 3).map((objection) => ({
        objection,
        response: "Frame the project as a bounded first pilot with clear KPIs, manual fallback, and buyer review gates.",
        supporting_proof: segment.proof_requirements.slice(0, 3),
        risk_level: "high" as RiskLevel
      }));
}

function generateSalesPack(
  product: ParsedProduct,
  segment: ItalianSegment,
  process: WarehouseProcess,
  pilotOffer: PilotAnalysis["pilot_offer"],
  trustGaps: PilotAnalysis["trust_gaps"],
  shortlist: TargetAccount[]
): PilotAnalysis["sales_pack"] {
  const firstAccount = shortlist[0]?.company_name ?? "a relevant Italian buyer";
  const kpis = pilotOffer.kpis.map((kpi) => kpi.name);

  return {
    outreach_email: {
      subject: `${pilotOffer.duration_days}-day ${process.process_name.toLowerCase()} pilot for Italian operations`,
      body:
        `Hello,\n\n${product.profile.companyName} is preparing a bounded Italian pilot for ${process.process_name.toLowerCase()} in ${segment.segment_name.toLowerCase()}. ` +
        `The proposal is deliberately narrow: ${pilotOffer.scope} Success would be measured through ${kpis.join(", ")}.\n\n` +
        `A first discussion with operations and IT would confirm baseline data, proof readiness, and whether a site like ${firstAccount} is a useful reference profile.\n\nBest regards,\nPilotOps AI sales pack`
    },
    meeting_pitch:
      `This is not a full warehouse transformation. It is a ${pilotOffer.duration_days}-day pilot for ${process.process_name.toLowerCase()} with manual fallback, weekly KPI review, and an exit condition before expansion.`,
    one_page_pilot_proposal: {
      headline: `${product.category} pilot for ${process.process_name.toLowerCase()} in Italy`,
      buyer_problem:
        `${segment.segment_name} need measurable operational improvements without risking service disruption or unproven cross-border support.`,
      pilot_scope: pilotOffer.scope,
      success_metrics: kpis,
      proof_to_share: pilotOffer.proof_required_before_launch,
      decision_request:
        "Approve a route-fit and proof-readiness workshop to confirm pilot scope, baseline metrics, safety review, and support expectations."
    },
    roi_argument:
      `Do not lead with a generic ROI claim. Use the pilot to measure ${kpis.slice(0, 3).join(", ")} against the buyer's own baseline, then decide whether expansion is justified.`,
    follow_up_message:
      `Thank you for reviewing the ${process.process_name.toLowerCase()} pilot. The useful next step is a 30-minute workshop covering baseline data, ${trustGaps[0]?.title.toLowerCase() ?? "proof readiness"}, and the smallest safe pilot zone.`
  };
}

function generateNextSevenDaysPlan(
  product: ParsedProduct,
  process: WarehouseProcess,
  trustGaps: PilotAnalysis["trust_gaps"]
): PilotAnalysis["next_7_days_plan"] {
  return [
    {
      day: 1,
      action: `Finalize the ${product.category} product and proof summary for Italian buyers.`,
      owner: "Vendor expansion lead",
      output: "Buyer-ready product evidence pack"
    },
    {
      day: 2,
      action: `Prepare the ${trustGaps[0]?.title.toLowerCase() ?? "highest-priority trust gap"} mitigation note.`,
      owner: "Solutions lead",
      output: "Trust gap mitigation note"
    },
    {
      day: 3,
      action: `Confirm the minimum viable workflow for ${process.process_name.toLowerCase()}.`,
      owner: "Solutions engineer",
      output: "Pilot process map and manual fallback"
    },
    {
      day: 4,
      action: "Create the KPI baseline worksheet.",
      owner: "Business analyst",
      output: "Pilot KPI and ROI baseline worksheet"
    },
    {
      day: 5,
      action: "Prioritize target accounts from the curated shortlist.",
      owner: "Business development",
      output: "Ranked company-level account list"
    },
    {
      day: 6,
      action: "Prepare role-based outreach without personal contact harvesting.",
      owner: "Sales lead",
      output: "Outbound email and one-page pilot proposal"
    },
    {
      day: 7,
      action: "Review buyer objections and missing proof before first calls.",
      owner: "Expansion team",
      output: "Updated battlecard and proof checklist"
    }
  ];
}

function buildProductEvidenceProfile(product: ParsedProduct): ProductEvidenceProfile {
  return {
    canonical_category: product.category,
    evidence_summary: `Parsed ${product.category} profile for ${product.operationalUseCase}. Available proof: ${product.availableProof.join(", ")}. Missing proof: ${product.missingProof.join(", ")}.`,
    operational_use_case: product.operationalUseCase,
    infrastructure_needs: product.infrastructureNeeds,
    integration_needs: product.integrationNeeds,
    safety_assumptions: product.safetyAssumptions,
    support_model: product.supportModel,
    region_preference: product.regionPreference,
    detected_keywords: product.detectedKeywords
  };
}

function buildMetadata(product: ParsedProduct, metadata: DynamicAnalysisMetadataInput): PilotAnalysis["metadata"] {
  return {
    analysis_id: `${slug(product.profile.companyName)}-${slug(product.category)}-${Date.now().toString(36)}`,
    created_at: new Date().toISOString(),
    target_market: "Italy",
    pipeline_version: "market-entry-engine-1.0",
    dataset_versions: {
      italian_segments: italianSegmentsData.version,
      warehouse_processes: warehouseProcessesData.version,
      trust_gaps: trustGapsData.version,
      proof_checklist: proofChecklistData.version,
      italian_target_accounts: "seed"
    },
    assumptions: [
      "The analysis uses curated local seed datasets and does not scrape live leads.",
      "Target accounts are company-level examples, not buying-intent verification.",
      `The product was classified as ${product.category} from the provided profile and evidence text.`
    ],
    analysis_mode: metadata.analysisMode ?? "deterministic_fallback",
    provider: metadata.provider ?? "local",
    model: metadata.model ?? "local_market_entry_engine",
    key_source: metadata.keySource ?? "none"
  };
}

function classifyCategory(text: string): CanonicalProductCategory {
  if (hasAny(text, ["parcel sorter", "parcel sorting", "sortation", "sorting automation", "sorter lane", "courier depot"])) {
    return "sorting automation";
  }

  if (hasAny(text, ["palletizing", "palletizer", "palletising", "robotic pallet"])) {
    return "palletizing automation";
  }

  if (hasAny(text, ["inventory scanning", "cycle count", "stock accuracy", "rfid", "barcode scanning robot"])) {
    return "inventory scanning robot";
  }

  if (hasAny(text, ["picking robot", "robotic picking", "piece picking", "goods-to-person"])) {
    return "picking robot";
  }

  if (hasAny(text, ["agv", "automated guided vehicle", "guided vehicle"])) {
    return "AGV";
  }

  if (hasAny(text, ["wms", "orchestration", "fleet orchestration", "ai orchestration", "warehouse management software"])) {
    return "WMS/orchestration";
  }

  return "AMR";
}

function inferUseCase(text: string, category: CanonicalProductCategory): string {
  if (category === "sorting automation") {
    return "Parcel sorting and dispatch route consolidation";
  }

  if (category === "palletizing automation") {
    return "Pallet movement or end-of-line palletizing in warehouse dispatch flows";
  }

  if (category === "inventory scanning robot") {
    return "Inventory scanning, cycle counting, and stock accuracy verification";
  }

  if (category === "picking robot") {
    return "Picking support in a bounded warehouse zone";
  }

  if (category === "AGV") {
    return "Pallet or line-side material movement on a controlled route";
  }

  if (category === "WMS/orchestration") {
    return "Warehouse task orchestration and measurable workflow optimization";
  }

  if (hasAny(text, ["pallet", "forklift"])) {
    return "Pallet movement and internal warehouse transport";
  }

  return "Internal transport between picking, packing, and dispatch zones";
}

function detectAvailableProof(text: string): string[] {
  const proof: string[] = [];
  addIf(text, proof, ["technical spec", "specification", "datasheet"], "technical specifications");
  addIf(text, proof, ["ce summary", "ce/safety", "safety summary", "safety enclosure"], "CE and safety summary");
  addIf(text, proof, ["case study", "customer case", "chinese warehouse", "deployment case"], "case study evidence");
  addIf(text, proof, ["roi", "payback", "business case"], "ROI model with Italian assumptions");
  addIf(text, proof, ["support plan", "support sla", "maintenance partner", "spare parts", "local maintenance"], "support SLA");
  addIf(text, proof, ["wms", "api", "csv", "integration", "barcode"], "WMS integration workflow");
  addIf(text, proof, ["installation plan", "commissioning", "weekend installation"], "installation plan");

  return proof;
}

function detectMissingProof(text: string, availableProof: string[]): string[] {
  const proofNames = proofChecklistSeeds.map((item) => item.proof_item_name);
  const missing = proofNames.filter((proof) => !availableProof.some((available) => sameProof(available, proof)));

  if (hasAny(text, ["missing", "not confirmed", "no italian reference", "no local", "partial", "needs buyer review"])) {
    return missing;
  }

  return missing.filter((proof) =>
    ["CE and safety summary", "support SLA", "maintenance plan and spare parts", "case study evidence", "ROI model with Italian assumptions"].includes(proof)
  );
}

function detectIntegrationNeeds(text: string, category: CanonicalProductCategory): string[] {
  if (category === "sorting automation") {
    return ["Barcode and route logic integration", "Manual fallback lane during pilot"];
  }

  if (category === "WMS/orchestration") {
    return ["WMS data access and API handoff", "Exception handling workflow"];
  }

  if (hasAny(text, ["wms", "api", "csv", "barcode", "erp", "mes"])) {
    return ["Minimum viable WMS/task integration path", "CSV/API fallback option"];
  }

  return ["Operator tablet or CSV task workflow before deeper integration"];
}

function detectInfrastructureNeeds(text: string, category: CanonicalProductCategory): string[] {
  const needs = ["Defined pilot zone and baseline measurement window"];

  if (category === "AMR" || category === "AGV" || category === "inventory scanning robot") {
    needs.push("Warehouse map, network coverage, and charging/staging space");
  }

  if (category === "sorting automation") {
    needs.push("Sorter lane space, parcel induction area, and off-peak installation window");
  }

  if (category === "palletizing automation") {
    needs.push("End-of-line space, guarding assumptions, and pallet format review");
  }

  if (hasAny(text, ["cold", "temperature"])) {
    needs.push("Temperature-controlled operating assumptions");
  }

  return needs;
}

function detectSafetyAssumptions(text: string, missingProof: string[]): string[] {
  const assumptions = ["Buyer safety review required before live pilot launch"];

  if (missingProof.some((proof) => sameProof(proof, "CE and safety summary")) || hasAny(text, ["partial ce", "ce missing", "safety needs"])) {
    assumptions.push("CE/safety evidence should be framed as readiness proof, not certified compliance");
  }

  return assumptions;
}

function detectSupportModel(text: string): string {
  if (hasAny(text, ["local maintenance partner", "italy partner", "on-site support", "spare parts"])) {
    return "Support model partially defined; prepare buyer-readable SLA and spare-parts ownership.";
  }

  return "Local support model not yet confirmed; define remote diagnostics, escalation path, spare-parts plan, and on-site option.";
}

function detectKeywords(text: string): string[] {
  return [
    "amr",
    "agv",
    "parcel",
    "sorting",
    "pallet",
    "picking",
    "inventory",
    "wms",
    "ce",
    "maintenance",
    "roi",
    "case study",
    "barcode"
  ].filter((keyword) => text.includes(keyword));
}

function proofStatus(proofName: string, product: ParsedProduct): ReadinessStatus {
  if (product.availableProof.some((proof) => sameProof(proof, proofName))) {
    return isExplicitlyPartialProof(product.combinedText, proofName)
      ? "partial"
      : "available";
  }

  if (product.missingProof.some((proof) => sameProof(proof, proofName))) {
    return proofName.includes("ROI") || proofName.includes("training") || proofName.includes("case study") ? "recommended" : "missing";
  }

  return "recommended";
}

function isExplicitlyPartialProof(text: string, proofName: string): boolean {
  const proofToken = normalizeText(proofName).split(" ")[0];
  const partialPatterns = [
    `partial ${proofToken}`,
    `${proofToken} partial`,
    `partial ${normalizeText(proofName)}`,
    `${normalizeText(proofName)} partial`
  ];

  return partialPatterns.some((pattern) => text.includes(pattern));
}

function actionForProof(item: ProofChecklistSeed, status: ReadinessStatus): string {
  if (status === "available") {
    return `Package the available ${item.proof_item_name} into a concise Italian-buyer appendix.`;
  }

  if (status === "partial") {
    return `Complete the partial ${item.proof_item_name} with ${item.minimum_content_expected}`;
  }

  if (status === "missing") {
    return `Prepare ${item.proof_item_name}: ${item.minimum_content_expected}`;
  }

  return `Recommended next proof: ${item.minimum_content_expected}`;
}

function proofBurden(segment: ItalianSegment): SegmentScoreCard["proof_burden"] {
  if (segment.proof_requirements.length >= 8) {
    return "high";
  }

  if (segment.proof_requirements.length >= 6) {
    return "medium";
  }

  return "low";
}

function proofBurdenPenalty(segment: ItalianSegment, product: ParsedProduct): number {
  const missingRequired = segment.proof_requirements.filter((proof) => hasMissingProof(product, proof));

  return Math.min(missingRequired.length * 3, 16);
}

function hasMissingProof(product: ParsedProduct, proofName: string): boolean {
  return product.missingProof.some((proof) => sameProof(proof, proofName));
}

function estimateComplexity(
  category: CanonicalProductCategory,
  missingProof: string[],
  text: string
): ParsedProduct["pilotComplexity"] {
  if (category === "sorting automation" || category === "palletizing automation" || hasAny(text, ["conveyor", "production", "regulated"])) {
    return "high";
  }

  if (missingProof.length >= 5) {
    return "medium";
  }

  return "low";
}

function estimateConfidenceScore(profile: ProductProfile, availableProof: string[], text: string): number {
  const textScore = Math.min(Math.floor(text.length / 120), 20);
  const proofScore = Math.min(availableProof.length * 5, 25);
  const profileScore = [profile.companyName, profile.productCategory, profile.description].filter(Boolean).length * 10;

  return clampScore(35 + textScore + proofScore + profileScore);
}

function normalizeRegionPreference(text: string): string | null {
  const normalized = normalizeText(text);
  const regions = ["Lombardy", "Veneto", "Emilia-Romagna", "Piedmont", "Lazio"];

  return regions.find((region) => normalized.includes(normalizeText(region))) ?? null;
}

function targetForKpi(kpi: string): string {
  const normalized = normalizeText(kpi);

  if (normalized.includes("accuracy") || normalized.includes("error") || normalized.includes("mis-sort")) {
    return "Measurable accuracy improvement versus pilot baseline";
  }

  if (normalized.includes("hour") || normalized.includes("throughput") || normalized.includes("parcels")) {
    return "10-20% improvement during agreed pilot windows";
  }

  if (normalized.includes("uptime") || normalized.includes("availability")) {
    return "95% availability during stable pilot windows";
  }

  return "Baseline measured in week 1, then improved during pilot windows";
}

function escalateRisk(risk: RiskLevel, hasMissing: boolean, gapId: string): RiskLevel {
  if (gapId === "incomplete_ce_safety_evidence" && hasMissing) {
    return "critical";
  }

  if ((gapId === "unclear_local_maintenance_and_spare_parts" || gapId === "installation_disruption_risk") && hasMissing) {
    return "high";
  }

  return risk;
}

function softenRisk(risk: RiskLevel): RiskLevel {
  if (risk === "critical") {
    return "high";
  }

  if (risk === "high") {
    return "medium";
  }

  return risk;
}

function riskWeight(risk: RiskLevel): number {
  return { low: 1, medium: 2, high: 3, critical: 4 }[risk];
}

function hasAny(text: string, needles: string[]): boolean {
  return needles.some((needle) => text.includes(normalizeText(needle)));
}

function addIf(text: string, target: string[], needles: string[], value: string) {
  if (hasAny(text, needles)) {
    target.push(value);
  }
}

function sameProof(left: string, right: string): boolean {
  const normalizedLeft = normalizeText(left);
  const normalizedRight = normalizeText(right);

  return normalizedLeft.includes(normalizedRight) || normalizedRight.includes(normalizedLeft);
}

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function titleCase(value: string): string {
  return value.replace(/\w\S*/g, (part) => part.charAt(0).toUpperCase() + part.slice(1));
}

function slug(value: string): string {
  return normalizeText(value).replace(/\s+/g, "-").slice(0, 48) || "analysis";
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function ensureNonEmpty<T>(value: T[] | undefined, fallback: T[]): T[] {
  return value && value.length > 0 ? value : fallback;
}

function dedupe(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function nonEmptyString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function nonEmptyArray(value: unknown): string[] | undefined {
  return Array.isArray(value) && value.some((item) => typeof item === "string" && item.trim().length > 0)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0).map((item) => item.trim())
    : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
