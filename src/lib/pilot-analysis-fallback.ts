import demoProfile from "../../data/demo_amr_profile.json";
import italianSegments from "../../data/italian_segments.json";
import proofChecklist from "../../data/proof_checklist.json";
import targetAccounts from "../../data/italian_target_accounts.json";
import trustGaps from "../../data/trust_gaps.json";
import warehouseProcesses from "../../data/warehouse_processes.json";
import type { AnalysisKeySource, AnalysisMode, AnalysisProvider, PilotAnalysis, TargetAccount } from "./pilot-analysis-types";

export type AnalysisMetadataInput = {
  analysisMode?: AnalysisMode;
  provider?: AnalysisProvider;
  model?: string;
  keySource?: AnalysisKeySource;
};

const DEFAULT_ANALYSIS_ID = "demo-amr-italy-3pl-internal-transport";
const DEFAULT_CREATED_AT = "2026-05-16T00:00:00.000Z";

const curatedTargetAccounts = (targetAccounts as TargetAccount[]).filter(
  (account) =>
    account.logistics_category === "3PL and e-commerce fulfilment" &&
    account.likely_process_fit.includes("internal transport")
);

const fallbackTargetAccounts =
  curatedTargetAccounts.length >= 5 ? curatedTargetAccounts.slice(0, 5) : (targetAccounts as TargetAccount[]).slice(0, 5);

export function buildDeterministicPilotAnalysis(metadata: AnalysisMetadataInput = {}): PilotAnalysis {
  return {
    metadata: {
      analysis_id: DEFAULT_ANALYSIS_ID,
      created_at: DEFAULT_CREATED_AT,
      target_market: "Italy",
      pipeline_version: "mvp-demo-1.0",
      dataset_versions: {
        demo_amr_profile: "seed",
        italian_segments: italianSegments.version,
        warehouse_processes: warehouseProcesses.version,
        trust_gaps: trustGaps.version,
        proof_checklist: proofChecklist.version,
        italian_target_accounts: "seed"
      },
      assumptions: [
        "The vendor is preparing a first Italian pilot, not a full market rollout.",
        "The buyer can test two AMRs on one bounded picking-to-packing route before deeper WMS integration.",
        "The shortlisted accounts are curated company-level examples, not buying-intent verification."
      ],
      analysis_mode: metadata.analysisMode ?? "deterministic_fallback",
      provider: metadata.provider ?? "local",
      model: metadata.model ?? "local_fallback",
      key_source: metadata.keySource ?? "none"
    },
    product_summary: {
      company_name: demoProfile.vendor.fictional_name,
      company_country: "China",
      product_name: demoProfile.product_name,
      product_category: demoProfile.product_category,
      primary_use_case: "Internal transport between picking, packing, and dispatch staging zones",
      target_market: "Italy",
      core_benefits: [
        "Reduce manual walking and tote movement effort on repetitive warehouse routes.",
        "Start with operator tablet dispatch or CSV task import before deeper WMS integration.",
        "Avoid fixed conveyor redesign while creating measurable pilot evidence.",
        "Scale from a two-robot pilot to a larger fleet only after KPI proof."
      ],
      deployment_constraints: demoProfile.installation_requirements,
      available_proof: demoProfile.proof_status.available,
      missing_proof: demoProfile.proof_status.missing,
      pilot_complexity: "medium",
      confidence_score: 88
    },
    buyer_segment_recommendation: {
      recommended_segment_id: "it_3pl_ecommerce",
      segment_name: "Mid-size 3PL and e-commerce fulfilment warehouses",
      typical_buyer_profile:
        "Operations Director, Warehouse Manager, Head of Contract Logistics, or Continuous Improvement Manager running multi-client fulfilment, picking, packing, dispatch, and returns flows in Northern Italy.",
      fit_score: 88,
      why_this_segment: [
        "The AMR use case can be tested on one bounded route without redesigning the entire warehouse.",
        "3PL and e-commerce fulfilment sites have visible pressure around walking time, service levels, and seasonal peaks.",
        "A 45-day pilot can produce local proof for a larger rollout while preserving manual fallback."
      ],
      key_objections: [
        "unclear local maintenance coverage if robots stop during a client SLA window",
        "unclear WMS or task-assignment integration path",
        "risk of disrupting multiple client flows inside the same building",
        "no Italian reference customer",
        "ROI model not yet localized to the buyer's shift pattern and walking-time baseline"
      ],
      proof_requirements: [
        "technical specifications",
        "CE and safety summary",
        "WMS integration workflow",
        "support SLA",
        "maintenance plan and spare parts",
        "pilot KPI plan",
        "case study evidence",
        "warranty and exit conditions"
      ],
      alternative_segments: [
        {
          segment_id: "it_retail_logistics",
          segment_name: "Retail logistics and fashion distribution centers",
          fit_score: 78,
          tradeoff:
            "Retail and fashion warehouses are a good AMR fit, but seasonal replenishment waves and SKU complexity make them a less controlled first proof than 3PL fulfilment."
        },
        {
          segment_id: "it_manufacturing_warehouses",
          segment_name: "Manufacturing warehouses",
          fit_score: 72,
          tradeoff:
            "Manufacturing line-side flows can be valuable, but production continuity and mixed-traffic safety usually raise the first-pilot proof burden."
        }
      ]
    },
    warehouse_process_recommendation: {
      process_id: "internal_transport",
      process_name: "Internal transport between picking and packing",
      pilot_suitability_score: 91,
      why_suitable: [
        "The workflow is repetitive, bounded, and easy to baseline before the pilot starts.",
        "Two AMRs can run on one route while manual fallback remains available.",
        "The process creates clear KPI evidence around walking time, tote movement, availability, and handoff time."
      ],
      operational_boundaries: [
        "One mapped route between picking aisles and packing benches.",
        "Two NSM-300 AMRs during day shift in week one, then selected peak windows.",
        "Operator tablet dispatch or CSV task import before any deeper WMS handoff.",
        "Manual movement remains available during ramp-up and exception handling."
      ],
      kpis: [
        {
          name: "Manual walking time reduction",
          measurement: "Baseline operator walking minutes on the selected route compared with pilot-period walking minutes.",
          target: "15-25% reduction on the selected route"
        },
        {
          name: "Totes or carts moved per hour",
          measurement: "Route-level movement count during agreed pilot windows.",
          target: "At least 15% improvement over the baseline route window"
        },
        {
          name: "Route availability",
          measurement: "AMR route availability during agreed operating windows.",
          target: "95% during stable pilot windows"
        },
        {
          name: "Operator handoff time",
          measurement: "Average pickup and drop-off handoff time observed at the pilot points.",
          target: "No increase versus manual baseline after the first supervised week"
        }
      ],
      constraints: [
        "Clear route with manageable pedestrian and forklift interaction.",
        "Reliable Wi-Fi or local network coverage.",
        "Defined pickup and drop-off points.",
        "WMS task handoff, CSV task import, or operator tablet workflow.",
        "Manual fallback process during the pilot."
      ]
    },
    trust_gaps: [
      {
        gap_id: "incomplete_ce_safety_evidence",
        title: "Incomplete CE/safety evidence",
        risk_level: "critical",
        buyer_concern:
          "The buyer will ask for buyer-readable safety evidence before allowing AMRs to operate near people, forklifts, goods, or dispatch flows.",
        recommended_mitigation:
          "Prepare a CE/safety readiness summary, operating limits, emergency-stop behavior, safety features, and a pilot-area risk assessment summary for buyer review.",
        required_proof: ["CE and safety summary", "risk assessment summary", "installation plan"],
        owner: "vendor"
      },
      {
        gap_id: "unclear_local_maintenance_and_spare_parts",
        title: "Unclear local maintenance and spare parts coverage",
        risk_level: "high",
        buyer_concern:
          "Operations will worry that downtime could block picking, dispatch, or client SLA windows if support depends only on remote response from China.",
        recommended_mitigation:
          "Define pilot support hours, escalation path, remote diagnostics, EU or Italy spare-part availability, and an on-site support option before the first buyer workshop.",
        required_proof: ["support SLA", "maintenance plan and spare parts"],
        owner: "vendor"
      },
      {
        gap_id: "no_italian_reference_customer",
        title: "No Italian reference customer",
        risk_level: "high",
        buyer_concern:
          "The warehouse buyer has no local evidence that the AMR system works in Italian operating conditions and support expectations.",
        recommended_mitigation:
          "Frame the pilot as the first local proof, keep scope narrow, use transferable Chinese fulfilment evidence, and agree KPI and exit conditions upfront.",
        required_proof: ["case study evidence", "pilot KPI plan", "warranty and exit conditions"],
        owner: "vendor"
      },
      {
        gap_id: "unclear_wms_integration_path",
        title: "Unclear WMS integration path",
        risk_level: "high",
        buyer_concern:
          "Operations and IT need to know whether the pilot can start without a long WMS project.",
        recommended_mitigation:
          "Start with operator tablet dispatch or CSV task import, then document the REST API task-handoff path for a later expansion.",
        required_proof: ["WMS integration workflow"],
        owner: "joint"
      },
      {
        gap_id: "non_localized_roi_model",
        title: "Non-localized ROI model",
        risk_level: "medium",
        buyer_concern:
          "Finance and operations may reject a generic savings claim if it does not use the buyer's own shift pattern, walking-time baseline, and throughput data.",
        recommended_mitigation:
          "Use the first week to baseline the selected route and prepare an Italian buyer ROI model based on measured walking time and route throughput.",
        required_proof: ["ROI model with Italian assumptions", "pilot KPI plan"],
        owner: "vendor"
      }
    ],
    pilot_offer: {
      title: "45-day AMR internal transport pilot for a Northern Italy 3PL fulfilment warehouse",
      duration_days: 45,
      scope:
        "Two NSM-300 AMRs move totes or carts across one mapped route between picking and packing during agreed pilot windows.",
      included_systems: ["2 NSM-300 AMRs", "Fleet dashboard", "Charging station", "Route map", "Operator tablet workflow", "Remote monitoring"],
      required_setup: [
        "Warehouse floor map",
        "Charging location near the pilot route",
        "Wi-Fi coverage check",
        "Defined pickup and drop-off points",
        "Pilot-area safety review",
        "Operator and supervisor briefing"
      ],
      kpis: [
        {
          name: "Manual walking time reduction",
          target: "15-25% reduction on the selected route"
        },
        {
          name: "Route availability",
          target: "95% during agreed operating windows"
        },
        {
          name: "Totes moved per hour",
          target: "At least 15% improvement over baseline route windows"
        }
      ],
      buyer_risk_reducers: [
        "One-route pilot",
        "Manual fallback remains available",
        "Operator tablet dispatch before deeper WMS integration",
        "Weekly KPI review",
        "Exit condition after 45 days"
      ],
      proof_required_before_launch: [
        "technical specifications",
        "CE and safety summary",
        "risk assessment summary",
        "support SLA",
        "maintenance plan and spare parts",
        "WMS integration workflow",
        "pilot KPI plan",
        "warranty and exit conditions"
      ],
      exit_clause:
        "The buyer can stop after 45 days if agreed KPI thresholds, safety conditions, or support response commitments are not met.",
      next_commercial_step:
        "If the pilot meets agreed KPIs and support expectations, propose a paid expansion to six AMRs across picking-to-packing and dispatch staging."
    },
    target_account_shortlist: fallbackTargetAccounts,
    objection_battlecard: [
      {
        objection: "We do not know your brand in Italy.",
        response:
          "Treat the first project as a bounded proof pilot, not a full warehouse transformation. Use transferable fulfilment evidence, agreed KPIs, and a clear exit condition.",
        supporting_proof: ["case study evidence", "pilot KPI plan", "warranty and exit conditions"],
        risk_level: "high"
      },
      {
        objection: "Who maintains the system locally if it stops during operations?",
        response:
          "Show the pilot support hours, escalation path, remote diagnostics process, spare-parts plan, and the timeline for local or EU support coverage.",
        supporting_proof: ["support SLA", "maintenance plan and spare parts"],
        risk_level: "high"
      },
      {
        objection: "Will this disrupt our WMS or daily warehouse flow?",
        response:
          "Start with operator tablet dispatch or CSV task import on one route, keep manual fallback available, and postpone deeper WMS integration until expansion.",
        supporting_proof: ["WMS integration workflow", "installation plan", "pilot KPI plan"],
        risk_level: "high"
      },
      {
        objection: "Is the safety evidence ready for a live Italian warehouse?",
        response:
          "Provide a buyer-readable CE/safety readiness summary, operating limits, route risk assessment, and first-week supervised launch plan before approval.",
        supporting_proof: ["CE and safety summary", "risk assessment summary", "operator and supervisor training pack"],
        risk_level: "critical"
      }
    ],
    proof_checklist: [
      {
        proof_id: "technical_specifications",
        name: "technical specifications",
        category: "technical",
        status: "available",
        buyer_confidence_impact: "high",
        recommended_action: "Turn the existing specs into a concise buyer appendix covering payload, speed, battery, charging, connectivity, and operating limits."
      },
      {
        proof_id: "ce_and_safety_summary",
        name: "CE and safety summary",
        category: "safety",
        status: "partial",
        buyer_confidence_impact: "critical",
        recommended_action: "Prepare a buyer-readable safety readiness summary and clearly avoid claiming safety status beyond the documents provided."
      },
      {
        proof_id: "support_sla",
        name: "support SLA",
        category: "support",
        status: "missing",
        buyer_confidence_impact: "high",
        recommended_action: "Define support hours, response targets, escalation path, remote diagnostics, and first-week support coverage."
      },
      {
        proof_id: "maintenance_plan_and_spare_parts",
        name: "maintenance plan and spare parts",
        category: "support",
        status: "missing",
        buyer_confidence_impact: "high",
        recommended_action: "Prepare preventive maintenance tasks, critical spare list, EU or Italy spare availability, and ownership during the pilot."
      },
      {
        proof_id: "wms_integration_workflow",
        name: "WMS integration workflow",
        category: "integration",
        status: "partial",
        buyer_confidence_impact: "high",
        recommended_action: "Document tablet dispatch, CSV task import, and REST API handoff as separate pilot and expansion options."
      },
      {
        proof_id: "pilot_kpi_plan",
        name: "pilot KPI plan",
        category: "business_case",
        status: "recommended",
        buyer_confidence_impact: "high",
        recommended_action: "Prepare the baseline window, data owner, weekly review cadence, and success thresholds before outreach."
      },
      {
        proof_id: "roi_model_with_italian_assumptions",
        name: "ROI model with Italian assumptions",
        category: "business_case",
        status: "recommended",
        buyer_confidence_impact: "high",
        recommended_action: "Build a simple calculator using walking-time baseline, route volume, shift pattern, and manual fallback assumptions."
      }
    ],
    sales_pack: {
      outreach_email: {
        subject: "45-day AMR pilot for picking-to-packing transport",
        body:
          "Hello,\n\nWe help fulfilment warehouses test AMR internal transport on one controlled route before committing to a larger automation project. For an Italian 3PL site, we would propose a 45-day pilot with two NSM-300 AMRs moving totes between picking and packing, manual fallback kept available, and weekly KPI review around walking time, route availability, and totes moved per hour.\n\nThe first step would be a 30-minute route-fit discussion with operations and IT to confirm the baseline, safety review, and minimum integration path.\n\nBest regards,\nPilotOps AI demo sales pack"
      },
      meeting_pitch:
        "We are proposing a bounded pilot, not a full warehouse redesign: two AMRs, one route, tablet or CSV dispatch first, weekly KPI review, and an exit condition if the agreed operational or support thresholds are not met.",
      one_page_pilot_proposal: {
        headline: "Low-risk AMR pilot for internal transport in Italian fulfilment warehouses",
        buyer_problem:
          "Picking-to-packing movement consumes operator time, creates handoff variability, and is difficult to automate with fixed conveyors in a first project.",
        pilot_scope:
          "Two NSM-300 AMRs operate for 45 days on one mapped route between picking and packing, with manual fallback and supervised launch.",
        success_metrics: ["Manual walking time reduction", "Totes moved per hour", "Route availability", "Operator handoff time"],
        proof_to_share: [
          "technical specifications",
          "CE and safety summary",
          "WMS integration workflow",
          "support SLA",
          "pilot KPI plan"
        ],
        decision_request:
          "Approve a route-fit workshop to confirm the pilot route, baseline measurement window, safety review, and minimum integration mode."
      },
      roi_argument:
        "The pilot does not ask the buyer to trust a generic ROI claim. It measures walking time avoided, route throughput, availability, and handoff reliability on one live route, then uses those buyer-specific measurements to decide whether a six-AMR expansion is justified.",
      follow_up_message:
        "Thank you for reviewing the AMR pilot idea. The proposed next step is a route-fit workshop covering the picking-to-packing baseline, safety conditions, support expectations, and whether tablet dispatch or CSV import is enough for the first 45 days."
    },
    next_7_days_plan: [
      {
        day: 1,
        action: "Finalize the buyer-ready technical and safety proof pack.",
        owner: "Vendor expansion lead",
        output: "Technical specs, CE/safety summary, and operating-limit appendix"
      },
      {
        day: 2,
        action: "Define the pilot support and spare-parts model.",
        owner: "Operations support lead",
        output: "Support SLA draft and spare-parts plan"
      },
      {
        day: 3,
        action: "Prepare the minimum viable integration workflow.",
        owner: "Solutions engineer",
        output: "Tablet dispatch, CSV import, and REST API handoff note"
      },
      {
        day: 4,
        action: "Build the route baseline and KPI worksheet.",
        owner: "Business analyst",
        output: "Walking-time, movement-count, availability, and handoff-time template"
      },
      {
        day: 5,
        action: "Prioritize five curated 3PL and e-commerce fulfilment accounts.",
        owner: "Business development",
        output: "Account shortlist with company-level outreach angles"
      },
      {
        day: 6,
        action: "Send role-based outreach to operations or warehouse leadership paths.",
        owner: "Sales lead",
        output: "First outreach batch using company-level contact routes only"
      },
      {
        day: 7,
        action: "Review buyer replies, objections, and missing proof.",
        owner: "Expansion team",
        output: "Updated battlecard and pilot proposal"
      }
    ]
  };
}

export const deterministicPilotAnalysis = buildDeterministicPilotAnalysis();
