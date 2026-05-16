import type { PilotAnalysis, ProductProfile } from "@/lib/pilot-analysis-types";

export function buildPilotPackFilename(profile: ProductProfile, analysis: PilotAnalysis) {
  const companySlug = slugify(profile.companyName || analysis.product_summary.company_name || "pilotops");
  const analysisSlug = slugify(analysis.metadata.analysis_id || "analysis");

  return `${companySlug}-pilotops-export-pack-${analysisSlug}.md`;
}

export function buildPilotPackMarkdown(profile: ProductProfile, analysis: PilotAnalysis) {
  const decisionRows = buildSegmentDecisionRows(analysis);
  const targetAccounts = analysis.target_account_shortlist
    .map(
      (account, index) => `### ${index + 1}. ${account.company_name}

- Website: ${account.website}
- Region: ${account.hq_region ?? "region not verified"}
- Category: ${account.logistics_category}
- Outreach angle: ${account.outreach_angle}
- Warehouse signals:
${formatList(account.warehouse_signals)}
- Process fit:
${formatList(account.likely_process_fit)}
- Recommended buyer roles:
${formatList(account.recommended_buyer_roles)}
- Source note: ${account.source_note}`
    )
    .join("\n\n");

  return `# PilotOps AI Export Pack

Generated: ${analysis.metadata.created_at}
Analysis ID: ${analysis.metadata.analysis_id}
Target market: ${analysis.metadata.target_market}
Engine: ${analysis.metadata.provider === "local" ? "Local deterministic engine" : `OpenRouter ${analysis.metadata.model}`}

## Product

- Company: ${profile.companyName}
- Product: ${analysis.product_summary.product_name}
- Category: ${analysis.product_summary.product_category}
- Primary use case: ${analysis.product_summary.primary_use_case}
- Confidence score: ${analysis.product_summary.confidence_score}/100
- Pilot complexity: ${analysis.product_summary.pilot_complexity}

## Recommended First Pilot Wedge

- Buyer segment: ${analysis.buyer_segment_recommendation.segment_name}
- Buyer profile: ${analysis.buyer_segment_recommendation.typical_buyer_profile}
- Segment fit: ${analysis.buyer_segment_recommendation.fit_score}/100
- Warehouse process: ${analysis.warehouse_process_recommendation.process_name}
- Pilotability: ${analysis.warehouse_process_recommendation.pilot_suitability_score}/100

### Why This Segment Wins

${formatList(analysis.buyer_segment_recommendation.why_this_segment)}

### Why This Process Works

${formatList(analysis.warehouse_process_recommendation.why_suitable)}

## Product Evidence Extracted

### Core Benefits

${formatList(analysis.product_summary.core_benefits)}

### Available Proof

${formatList(analysis.product_summary.available_proof)}

### Missing Proof

${formatList(analysis.product_summary.missing_proof)}

### Deployment Constraints

${formatList(analysis.product_summary.deployment_constraints)}

## Segment Decision Matrix

| Segment | Fit | Process fit | Proof readiness | Pilotability | Tradeoff |
| --- | --- | --- | --- | --- | --- |
${decisionRows
  .map(
    (row) =>
      `| ${formatTableCell(row.segment)} | ${formatTableCell(row.fitScore)} | ${formatTableCell(row.processFit)} | ${formatTableCell(row.proofReadiness)} | ${formatTableCell(row.pilotability)} | ${formatTableCell(row.tradeoff)} |`
  )
  .join("\n")}

## Recommended Pilot Offer

- Title: ${analysis.pilot_offer.title}
- Duration: ${analysis.pilot_offer.duration_days} days
- Scope: ${analysis.pilot_offer.scope}
- Exit clause: ${analysis.pilot_offer.exit_clause}
- Next commercial step: ${analysis.pilot_offer.next_commercial_step}

### Included Systems

${formatList(analysis.pilot_offer.included_systems)}

### Required Setup

${formatList(analysis.pilot_offer.required_setup)}

### KPIs

${formatList(analysis.pilot_offer.kpis.map((kpi) => `${kpi.name}: ${kpi.target}`))}

### Buyer Risk Reducers

${formatList(analysis.pilot_offer.buyer_risk_reducers)}

## Trust Gap Analysis

${analysis.trust_gaps
  .map(
    (gap) => `### ${gap.title}

- Risk: ${gap.risk_level}
- Buyer concern: ${gap.buyer_concern}
- Recommended mitigation: ${gap.recommended_mitigation}
- Required proof:
${formatList(gap.required_proof)}
- Owner: ${gap.owner}`
  )
  .join("\n\n")}

## Target Account Shortlist

${targetAccounts || "No target accounts available in this analysis."}

## Buyer Objection Battlecard

${analysis.objection_battlecard
  .map(
    (item) => `### ${item.objection}

- Response: ${item.response}
- Risk: ${item.risk_level}
- Supporting proof:
${formatList(item.supporting_proof)}`
  )
  .join("\n\n")}

## Documentation Checklist

${analysis.proof_checklist
  .map(
    (item) => `- ${item.name} (${item.status}, ${item.buyer_confidence_impact} impact): ${item.recommended_action}`
  )
  .join("\n")}

## Sales Pack

### Outreach Email

Subject: ${analysis.sales_pack.outreach_email.subject}

${analysis.sales_pack.outreach_email.body}

### Meeting Pitch

${analysis.sales_pack.meeting_pitch}

### One-Page Pilot Proposal

- Headline: ${analysis.sales_pack.one_page_pilot_proposal.headline}
- Buyer problem: ${analysis.sales_pack.one_page_pilot_proposal.buyer_problem}
- Pilot scope: ${analysis.sales_pack.one_page_pilot_proposal.pilot_scope}
- Decision request: ${analysis.sales_pack.one_page_pilot_proposal.decision_request}

Success metrics:
${formatList(analysis.sales_pack.one_page_pilot_proposal.success_metrics)}

Proof to share:
${formatList(analysis.sales_pack.one_page_pilot_proposal.proof_to_share)}

### ROI Argument

${analysis.sales_pack.roi_argument}

### Follow-Up Message

${analysis.sales_pack.follow_up_message}

## Next 7 Days Action Plan

${analysis.next_7_days_plan
  .map((item) => `- Day ${item.day}: ${item.action} Owner: ${item.owner}. Output: ${item.output}.`)
  .join("\n")}

## Assumptions

${formatList(analysis.metadata.assumptions)}
`;
}

function buildSegmentDecisionRows(analysis: PilotAnalysis) {
  const proofReadiness = formatProofReadiness(
    analysis.product_summary.available_proof.length,
    analysis.product_summary.missing_proof.length
  );
  const selectedProcess = analysis.warehouse_process_recommendation.process_name;

  return [
    {
      segment: analysis.buyer_segment_recommendation.segment_name,
      fitScore: `${analysis.buyer_segment_recommendation.fit_score}/100`,
      processFit: selectedProcess,
      proofReadiness,
      pilotability: `${analysis.warehouse_process_recommendation.pilot_suitability_score}/100`,
      tradeoff: "Recommended first wedge"
    },
    ...analysis.buyer_segment_recommendation.alternative_segments.map((segment) => ({
      segment: segment.segment_name,
      fitScore: `${segment.fit_score}/100`,
      processFit: selectedProcess,
      proofReadiness,
      pilotability: "Secondary option",
      tradeoff: segment.tradeoff
    }))
  ];
}

function formatProofReadiness(availableCount: number, missingCount: number) {
  const total = availableCount + missingCount;

  if (total === 0) {
    return "Not mapped";
  }

  return `${availableCount}/${total} proof items ready`;
}

function formatList(items: string[]) {
  if (items.length === 0) {
    return "- Not provided";
  }

  return items.map((item) => `- ${item}`).join("\n");
}

function formatTableCell(value: string) {
  return value.replace(/\r?\n/g, " ").replace(/\|/g, "\\|");
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || "pilotops";
}
