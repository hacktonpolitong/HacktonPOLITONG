import type { PilotAnalysis, ProductProfile } from "./pilot-analysis-types";

export const demoProductProfile: ProductProfile = {
  companyName: "Shenzhen MovePilot Robotics",
  productCategory: "AMR robots for internal warehouse transport",
  targetMarket: "Italy",
  description:
    "The MP-800 moves totes, cartons and small carts between picking, packing and dispatch staging areas. It can start with operator tablet dispatch before deeper WMS integration.",
  benefits: [
    "Reduce manual walking time",
    "Deploy in one warehouse zone before scaling",
    "Avoid full conveyor redesign",
    "Support modular fleet expansion"
  ],
  currentProof: [
    "Chinese case studies",
    "Technical specifications",
    "REST API summary",
    "Partial CE safety summary"
  ],
  documentationStatus: "Specs available, safety summary partial, no Italian reference yet.",
  pilotAmbition: "Win a 45-day paid pilot with a mid-size Italian 3PL.",
  constraints: [
    "No local Italian maintenance partner confirmed",
    "Integration should begin with tablet dispatch or CSV workflow",
    "ROI assumptions must be localized"
  ]
};

export function buildDemoPilotAnalysis(profile: ProductProfile): PilotAnalysis {
  return {
  product_summary: {
    company_name: profile.companyName,
    product_name: "MP-800 Autonomous Mobile Robot",
    product_category: profile.productCategory,
    target_market: "Italy",
    confidence_score: 82
  },
  buyer_segment_recommendation: {
    recommended_segment_id: "it_3pl_ecommerce",
    segment_name: "Mid-size Italian 3PL and e-commerce fulfilment warehouses in Northern Italy",
    typical_buyer_profile: "Operations Director or Head of Logistics Innovation managing throughput pressure without a full automation redesign.",
    fit_score: 82,
    why_this_segment: [
      "Operational pressure is high enough to justify automation pilots.",
      "Procurement is usually faster than large enterprise automation programs.",
      "AMRs can be tested in one zone without changing the whole warehouse."
    ]
  },
  warehouse_process_recommendation: {
    process_id: "internal_transport_picking_to_packing",
    process_name: "Internal transport from picking to packing",
    pilot_suitability_score: 86,
    why_suitable: [
      "The route can be bounded, observed and measured quickly.",
      "Manual fallback remains available during the pilot.",
      "The workflow creates clear before-and-after productivity evidence."
    ],
    operational_boundaries: [
      "One mapped route only",
      "Two AMRs",
      "Operator tablet dispatch before deep WMS integration"
    ],
    kpis: [
      {
        name: "Manual walking time",
        measurement: "Baseline operator walking minutes compared with pilot period",
        target: "15-25% reduction"
      },
      {
        name: "Totes moved per hour",
        measurement: "Route-level tote movement count during stable pilot windows",
        target: "Baseline plus 15%"
      },
      {
        name: "Route availability",
        measurement: "AMR availability during agreed operating windows",
        target: "95%"
      }
    ]
  },
  why_now: [
    "Italian warehouses are under pressure to improve productivity without large redesign cycles.",
    "Mid-size logistics operators need modular automation that can be tested before capex expansion.",
    "A limited AMR pilot gives the buyer evidence for a broader automation roadmap."
  ],
  trust_gaps: [
    {
      gap_id: "no_italian_reference",
      title: "No Italian case study",
      risk_level: "high",
      buyer_concern: "We do not know whether this system works in an Italian warehouse context.",
      recommended_mitigation: "Position the pilot as the first local proof with narrow scope, clear KPIs and an exit clause.",
      required_proof: ["Chinese case study summary", "Pilot KPI plan", "Exit conditions"],
      owner: "vendor"
    },
    {
      gap_id: "local_maintenance_unclear",
      title: "Local maintenance model unclear",
      risk_level: "high",
      buyer_concern: "Who responds if the robot stops during operations?",
      recommended_mitigation: "Prepare a support SLA, spare-parts plan and partner-search timeline before the first buyer call.",
      required_proof: ["Support SLA", "Spare-parts plan", "Escalation workflow"],
      owner: "vendor"
    },
    {
      gap_id: "wms_integration_unclear",
      title: "WMS integration not localized",
      risk_level: "medium",
      buyer_concern: "How much IT work is required before the pilot can start?",
      recommended_mitigation: "Begin with operator tablet dispatch or CSV task import, then show the REST API handoff path.",
      required_proof: ["Integration workflow", "API summary", "Pilot data requirements"],
      owner: "joint"
    }
  ],
  pilot_offer: {
    title: "45-day one-route AMR pilot",
    duration_days: 45,
    scope: "One warehouse zone, one mapped route between picking and packing, and two MP-800 AMRs.",
    included_systems: ["2 MP-800 AMRs", "Fleet dashboard", "Charging station", "Operator tablet workflow"],
    required_setup: ["Warehouse floor map", "Wi-Fi check", "Defined pickup and drop-off points", "Operator briefing"],
    kpis: [
      {
        name: "Manual walking time reduction",
        target: "15-25% reduction on selected route"
      },
      {
        name: "Route availability",
        target: "95% during agreed operating windows"
      }
    ],
    buyer_risk_reducers: ["Pilot exit clause", "No full warehouse redesign", "Weekly KPI review"],
    proof_required_before_launch: ["Technical specs", "CE safety summary", "Support SLA draft", "Pilot exit conditions"],
    exit_clause: "Buyer can stop after 45 days if agreed KPI and support conditions are not met.",
    next_commercial_step: "Convert to a six-month expansion plan if KPIs and support commitments are met."
  },
  target_account_shortlist: [
    {
      company_name: "FERCAM",
      website: "https://www.fercam.com",
      hq_region: "other",
      logistics_category: "3PL and e-commerce fulfilment",
      warehouse_signals: [
        "contract logistics and warehousing services",
        "multiple specialized logistics centres in Italy and Europe",
        "warehouse management, stock handling, order management, shipping and returns"
      ],
      likely_process_fit: ["internal transport", "picking support", "pallet movement", "inventory scanning"],
      recommended_buyer_roles: ["Contract Logistics Director", "Operations Director", "Warehouse Manager"],
      outreach_angle:
        "FERCAM is a strong AMR/AGV pilot candidate because its contract logistics network handles warehouse flows where internal transport can be tested in bounded zones.",
      source_note:
        "Official FERCAM pages on logistics and contract logistics/warehousing."
    },
    {
      company_name: "Arcese",
      website: "https://arcese.com",
      hq_region: "other",
      logistics_category: "3PL and e-commerce fulfilment",
      warehouse_signals: [
        "contract logistics services",
        "inbound and outbound logistics",
        "warehouse flow optimization",
        "e-commerce logistics including warehousing, order preparation and returns"
      ],
      likely_process_fit: ["internal transport", "picking support", "inventory scanning", "line-side replenishment"],
      recommended_buyer_roles: ["Contract Logistics Director", "Operations Director", "E-commerce Logistics Manager"],
      outreach_angle:
        "Arcese is relevant for an AMR pilot because its e-commerce and contract logistics services include picking, packing, returns and warehouse flow optimization.",
      source_note: "Official Arcese contract logistics page."
    },
    {
      company_name: "BCUBE",
      website: "https://www.bcube.com",
      hq_region: "Piedmont",
      logistics_category: "3PL and e-commerce fulfilment",
      warehouse_signals: [
        "Italian integrated logistics operator",
        "contract logistics and customized supply chain services",
        "production logistics, inbound logistics, spare parts logistics and consumer retail services"
      ],
      likely_process_fit: ["internal transport", "picking support", "pallet movement", "line-side replenishment"],
      recommended_buyer_roles: ["Operations Director", "Contract Logistics Director", "Warehouse Manager"],
      outreach_angle:
        "BCUBE is a credible AMR/AGV target because it already positions logistics as technology-enabled across production, inbound and spare-parts flows.",
      source_note: "Official BCUBE homepage and contacts page."
    }
  ],
  objection_battlecard: [
    {
      objection: "We do not know your brand in Italy.",
      response: "Start with a limited workflow pilot, measurable KPIs and a clear exit clause.",
      supporting_proof: ["Chinese case study summary", "Pilot KPI plan"],
      risk_level: "high"
    },
    {
      objection: "Who maintains the system locally?",
      response: "Present the remote support process, spare-parts availability and local partner plan.",
      supporting_proof: ["Support SLA", "Spare-parts plan"],
      risk_level: "high"
    },
    {
      objection: "Will this disrupt daily operations?",
      response: "Deploy in one route between picking and packing, with rollback criteria agreed before launch.",
      supporting_proof: ["Operational boundaries", "Exit clause"],
      risk_level: "medium"
    }
  ],
  proof_checklist: [
    {
      proof_id: "technical_specs",
      name: "Technical specifications",
      category: "technical",
      status: "available",
      buyer_confidence_impact: "high",
      recommended_action: "Use as the core technical appendix."
    },
    {
      proof_id: "ce_safety_summary",
      name: "CE and safety summary",
      category: "safety",
      status: "partial",
      buyer_confidence_impact: "critical",
      recommended_action: "Condense into a one-page buyer-facing readiness summary."
    },
    {
      proof_id: "support_sla",
      name: "Local maintenance and support SLA",
      category: "support",
      status: "missing",
      buyer_confidence_impact: "critical",
      recommended_action: "Define SLA, escalation path and spare-parts handling."
    },
    {
      proof_id: "roi_model_italy",
      name: "Italian ROI model",
      category: "business_case",
      status: "recommended",
      buyer_confidence_impact: "medium",
      recommended_action: "Prepare a configurable calculator for the first call."
    }
  ],
  sales_pack: {
    outreach_email: {
      subject: "45-day AMR pilot for picking-to-packing transport",
      body: "A concise first outreach email draft for Italian 3PL operations leaders."
    },
    meeting_pitch:
      "We propose a one-route AMR pilot that measures walking-time reduction and route availability before any wider automation commitment.",
    one_page_pilot_proposal: {
      headline: "Low-risk AMR pilot for internal warehouse transport",
      buyer_problem: "Operators lose time moving totes between picking and packing during peak fulfilment windows.",
      pilot_scope: "Two AMRs, one mapped route, 45 days, weekly KPI review.",
      success_metrics: ["Walking-time reduction", "Route availability", "Totes moved per hour"],
      proof_to_share: ["Technical specs", "CE safety summary", "Chinese case study summary"],
      decision_request: "Approve a discovery call to validate route, baseline and support requirements."
    },
    roi_argument: "Measure labour time saved, route consistency and avoided conveyor redesign before expansion.",
    follow_up_message: "Short follow-up note summarizing scope, proof items and the requested next meeting."
  },
  next_7_days_plan: [
    {
      day: 1,
      action: "Finalize technical and safety one-pager.",
      owner: "Vendor expansion lead",
      output: "Buyer-ready proof pack"
    },
    {
      day: 2,
      action: "Draft outreach list by 3PL and e-commerce fulfilment segment.",
      owner: "Business development",
      output: "Prioritized target list"
    },
    {
      day: 3,
      action: "Prepare discovery questions for route baseline and WMS integration.",
      owner: "Solutions engineer",
      output: "Discovery call guide"
    },
    {
      day: 4,
      action: "Send the first pilot proposal to two friendly targets or partners.",
      owner: "Sales lead",
      output: "Initial buyer conversations"
    },
    {
      day: 5,
      action: "Capture objections and update the pilot package.",
      owner: "Expansion team",
      output: "Revised battlecard"
    }
  ]
};
}

export const mockPilotAnalysis: PilotAnalysis = buildDemoPilotAnalysis(demoProductProfile);
