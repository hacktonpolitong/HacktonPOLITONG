export type ReadinessStatus = "available" | "partial" | "missing" | "recommended";
export type RiskLevel = "low" | "medium" | "high" | "critical";

export type ProductProfile = {
  companyName: string;
  productCategory: string;
  targetMarket: string;
  description: string;
  benefits: string[];
  currentProof: string[];
  documentationStatus: string;
  pilotAmbition: string;
  constraints: string[];
};

export type TargetAccount = {
  company_name: string;
  website: string;
  hq_region: string | null;
  logistics_category: string;
  warehouse_signals: string[];
  likely_process_fit: string[];
  recommended_buyer_roles: string[];
  outreach_angle: string;
  source_note: string;
};

export type PilotAnalysis = {
  product_summary: {
    company_name: string;
    product_name: string;
    product_category: string;
    target_market: "Italy";
    confidence_score: number;
  };
  buyer_segment_recommendation: {
    recommended_segment_id: string;
    segment_name: string;
    typical_buyer_profile: string;
    fit_score: number;
    why_this_segment: string[];
  };
  warehouse_process_recommendation: {
    process_id: string;
    process_name: string;
    pilot_suitability_score: number;
    why_suitable: string[];
    operational_boundaries: string[];
    kpis: Array<{
      name: string;
      measurement: string;
      target: string;
    }>;
  };
  why_now: string[];
  trust_gaps: Array<{
    gap_id: string;
    title: string;
    risk_level: RiskLevel;
    buyer_concern: string;
    recommended_mitigation: string;
    required_proof: string[];
    owner: string;
  }>;
  pilot_offer: {
    title: string;
    duration_days: number;
    scope: string;
    included_systems: string[];
    required_setup: string[];
    kpis: Array<{
      name: string;
      target: string;
    }>;
    buyer_risk_reducers: string[];
    proof_required_before_launch: string[];
    exit_clause: string;
    next_commercial_step: string;
  };
  target_account_shortlist: TargetAccount[];
  objection_battlecard: Array<{
    objection: string;
    response: string;
    supporting_proof: string[];
    risk_level: RiskLevel;
  }>;
  proof_checklist: Array<{
    proof_id: string;
    name: string;
    category: string;
    status: ReadinessStatus;
    buyer_confidence_impact: RiskLevel;
    recommended_action: string;
  }>;
  sales_pack: {
    outreach_email: {
      subject: string;
      body: string;
    };
    meeting_pitch: string;
    one_page_pilot_proposal: {
      headline: string;
      buyer_problem: string;
      pilot_scope: string;
      success_metrics: string[];
      proof_to_share: string[];
      decision_request: string;
    };
    roi_argument: string;
    follow_up_message: string;
  };
  next_7_days_plan: Array<{
    day: number;
    action: string;
    owner: string;
    output: string;
  }>;
};
