# PilotOps AI Pipeline

This document defines the structured AI workflow for turning a Chinese warehouse automation product profile into a practical Italian first-pilot package. The pipeline is intentionally narrow: it does not produce a broad market report, a lead list, or compliance certification. It produces the structured output needed by the Pilot Control Room.

## Pipeline Principles

- The target market is always Italy.
- The client is a Chinese warehouse automation vendor.
- The final buyer is an Italian warehouse, logistics, fulfilment, retail, manufacturing, pharma, parcel, or food and beverage operator.
- Each stage returns structured JSON that can be validated, logged, reviewed, and rendered.
- Seed datasets provide the baseline domain knowledge; the model should explain when a recommendation comes from product evidence, seed data, or an inference.
- The final response must match `schemas/pilot_analysis.schema.json`.

## Inputs

Required user inputs:

- Company name
- Product category
- Product description
- Target market, fixed to Italy for the MVP
- Product benefits
- Current proof available
- Documentation status
- Desired pilot ambition
- Known constraints

Optional inputs:

- Technical specs
- Certification summary
- Brochure or deck text
- Chinese case study summary
- Pricing range
- Installation requirements
- Maintenance model
- WMS or IT integration notes

Seed datasets:

- `data/italian_segments.json`
- `data/warehouse_processes.json`
- `data/trust_gaps.json`
- `data/proof_checklist.json`
- `data/demo_amr_profile.json`
- `data/italian_target_accounts.json`

## Stage 1: Product Parser

Purpose: convert raw intake into a normalized product summary.

Inputs:

- User-provided product profile
- Uploaded or pasted documentation text, if available
- `data/demo_amr_profile.json` for the demo scenario

Logic:

- Classify the product category, such as AMR, AGV, sorting automation, palletizing, picking robot, inventory scanning, or WMS/AI orchestration.
- Identify the operational use case and the warehouse process families it can affect.
- Extract deployment constraints, required infrastructure, integration needs, safety assumptions, and support model.
- Detect proof assets and gaps from the documentation status.
- Estimate pilot complexity and buyer concern areas.

Expected structured output:

```json
{
  "stage": "product_parser",
  "product_summary": {
    "company_name": "Shenzhen MovePilot Robotics",
    "product_name": "MP-800 Autonomous Mobile Robot",
    "product_category": "AMR",
    "primary_use_case": "Internal transport between picking, packing, and dispatch zones",
    "target_market": "Italy",
    "core_benefits": ["Reduce manual walking time", "Deploy without fixed conveyors"],
    "deployment_constraints": ["Requires floor mapping", "Needs Wi-Fi coverage", "Requires WMS task handoff"],
    "available_proof": ["Technical specs", "Chinese case studies", "Partial CE safety summary"],
    "missing_proof": ["Italian reference", "Localized ROI model", "Italian support SLA"],
    "pilot_complexity": "medium"
  }
}
```

## Stage 2: Segment Matcher

Purpose: select the Italian buyer segment most likely to approve a first pilot.

Inputs:

- Stage 1 product summary
- `data/italian_segments.json`

Logic:

- Score segment fit using process match, pain intensity, pilotability, sales-cycle practicality, proof burden, and support risk.
- Favor segments where a limited pilot can be approved without redesigning the whole warehouse.
- Explain why the recommended segment is stronger than alternatives.

Expected structured output:

```json
{
  "stage": "segment_matcher",
  "buyer_segment_recommendation": {
    "recommended_segment_id": "it_3pl_ecommerce",
    "segment_name": "Mid-size 3PL and e-commerce fulfilment warehouses",
    "fit_score": 88,
    "why_this_segment": [
      "AMRs can be piloted in a bounded picking-to-packing route",
      "Italian 3PLs face labor and throughput pressure without always having enterprise automation budgets",
      "A 45-day trial can create measurable evidence for a larger rollout"
    ],
    "alternative_segments": [
      {
        "segment_id": "it_retail_logistics",
        "segment_name": "Retail logistics and fashion distribution",
        "fit_score": 78,
        "tradeoff": "Good fit for internal transport, but seasonal peaks and store replenishment calendars can complicate pilot timing"
      }
    ]
  }
}
```

## Stage 3: Process Selector

Purpose: choose the specific warehouse workflow to automate first.

Inputs:

- Stage 1 product summary
- Stage 2 segment recommendation
- `data/warehouse_processes.json`

Logic:

- Score each candidate process by product fit, measurability, buyer risk, installation disruption, data availability, and repeatability.
- Prefer one-zone or one-route pilots that can show measurable improvement.
- Avoid recommending full warehouse transformation as a first step.

Expected structured output:

```json
{
  "stage": "process_selector",
  "warehouse_process_recommendation": {
    "process_id": "internal_transport_picking_to_packing",
    "process_name": "Internal transport between picking and packing",
    "pilot_suitability_score": 91,
    "why_suitable": [
      "The process is repetitive and measurable",
      "It can run in one controlled warehouse zone",
      "It reduces walking time without changing the full WMS architecture"
    ],
    "pilot_kpis": ["Manual walking minutes avoided", "Totes moved per hour", "Route availability", "Operator handoff time"],
    "operational_boundaries": ["One mapped route", "Two AMRs", "Day-shift supervision during the first week"]
  }
}
```

## Stage 4: Trust Gap Analyzer

Purpose: identify what would prevent an Italian buyer from approving the pilot.

Inputs:

- Stage 1 product summary
- Stage 2 segment recommendation
- Stage 3 process recommendation
- `data/trust_gaps.json`
- `data/proof_checklist.json`

Logic:

- Compare available proof against expected buyer requirements.
- Prioritize gaps that block legal review, operations approval, IT approval, maintenance acceptance, or finance justification.
- Convert each gap into a concrete mitigation.

Expected structured output:

```json
{
  "stage": "trust_gap_analyzer",
  "trust_gaps": [
    {
      "gap_id": "local_maintenance_unclear",
      "title": "Local maintenance and response model unclear",
      "risk_level": "high",
      "buyer_concern": "The warehouse director will worry about downtime if the robot stops during dispatch preparation.",
      "recommended_mitigation": "Present a first-pilot support plan with remote diagnostics, spare parts held in Italy or the EU, and a named local response partner.",
      "required_proof": ["Support SLA", "Spare parts plan", "Escalation contact list"]
    }
  ]
}
```

## Stage 5: Pilot Package Generator

Purpose: design the first pilot package that the Italian buyer can realistically approve.

Inputs:

- Stage 1 product summary
- Stage 2 segment recommendation
- Stage 3 process recommendation
- Stage 4 trust gaps

Logic:

- Define pilot scope, duration, setup, KPIs, exit clause, proof required before launch, and commercial next step.
- Keep the scope operationally small and measurable.
- Reduce buyer risk with clear boundaries and a no-full-redesign framing.

Expected structured output:

```json
{
  "stage": "pilot_package_generator",
  "pilot_offer": {
    "title": "45-day AMR internal transport pilot for a Northern Italy 3PL fulfilment warehouse",
    "duration_days": 45,
    "scope": "Two AMRs move totes between picking and packing across one mapped route during day shift.",
    "included_systems": ["2 AMRs", "Fleet dashboard", "Route map", "Remote monitoring"],
    "required_setup": ["Floor mapping", "Charging location", "WMS task export or operator tablet workflow"],
    "kpis": [
      {
        "name": "Manual walking time reduction",
        "target": "15-25 percent reduction on the selected route"
      }
    ],
    "buyer_risk_reducers": ["One-zone pilot", "Exit clause after 45 days", "No conveyor removal"],
    "exit_clause": "Buyer can stop after the pilot if agreed KPIs or support response commitments are not met.",
    "next_commercial_step": "Convert to a 6-robot paid deployment across picking-to-packing and dispatch staging."
  }
}
```

## Stage 6: Target Account Finder

Purpose: rank a shortlist of Italian target accounts that match the selected buyer segment, warehouse process, and pilot strategy.

Inputs:

- Stage 2 selected segment
- Stage 3 selected process
- HQ region preference or target regions, when available
- `data/italian_target_accounts.json`

Logic:

- Filter accounts by `logistics_category` mapped to the selected segment.
- Filter or boost accounts whose `likely_process_fit` includes the selected process family.
- Boost accounts whose `hq_region` matches the preferred Italian pilot region.
- Boost accounts whose `warehouse_signals` support the selected pilot use case, such as fulfilment, cold chain, sorting hub, automated warehouse, distribution centre, or line-side flow.
- Return a ranked shortlist of 5 to 10 accounts.
- Use only the curated seed dataset in the MVP; do not make live API calls, scrape websites, enrich contacts, or infer personal contact data.

Expected structured output:

```json
{
  "stage": "target_account_finder",
  "target_account_shortlist": [
    {
      "company_name": "Example Logistics S.p.A.",
      "website": "https://example.com",
      "hq_region": "Lombardy",
      "logistics_category": "3PL and e-commerce fulfilment",
      "warehouse_signals": ["contract logistics and warehousing services"],
      "likely_process_fit": ["internal transport", "picking support"],
      "recommended_buyer_roles": ["Operations Director", "Warehouse Manager"],
      "outreach_angle": "This account matches the selected AMR internal transport pilot because its public warehouse signals show fulfilment flows and repeatable picking-to-packing movement.",
      "source_note": "Official company website or public press release."
    }
  ]
}
```

## Stage 7: Sales Pack Generator

Purpose: produce ready-to-use commercial material for the Head of International Expansion.

Inputs:

- Stages 1 through 6
- Proof checklist results
- Objection patterns from seed data
- Target account shortlist, when available

Logic:

- Generate concise outbound material that speaks to Italian operations risk, not abstract AI value.
- Include a first outreach email, meeting pitch, one-page pilot proposal, ROI argument, objection battlecard, and proof checklist summary.
- When a target account shortlist exists, adapt outreach angles to the selected account category without inventing personal contacts.
- Keep language practical, specific, and credible.

Expected structured output:

```json
{
  "stage": "sales_pack_generator",
  "sales_pack": {
    "outreach_email": {
      "subject": "45-day AMR pilot for picking-to-packing transport",
      "body": "We help 3PL warehouses test AMR transport in one controlled route before committing to a larger automation project..."
    },
    "meeting_pitch": "We are proposing a bounded pilot, not a full warehouse redesign...",
    "one_page_pilot_proposal": {
      "headline": "Low-risk AMR pilot for internal transport",
      "sections": ["Buyer problem", "Pilot scope", "KPIs", "Proof provided", "Next step"]
    },
    "roi_argument": "The pilot measures walking time avoided, tote movements per hour, and dispatch handoff reliability before asking for a larger rollout."
  }
}
```

## Stage 8: Evidence and Schema Assembler

Purpose: assemble the final Pilot Control Room response and attach source/evidence notes.

Inputs:

- Stages 1 through 7
- Seed dataset records used
- Optional cited market or compliance snippets, when the backend adds web or file-search tools

Logic:

- Ensure every required field in `schemas/pilot_analysis.schema.json` is present.
- Keep evidence notes separate from claims that require legal or compliance validation.
- Flag assumptions so the frontend can show confidence and readiness without pretending the pilot is guaranteed.
- Return one object suitable for dashboard rendering.

Expected structured output:

```json
{
  "stage": "evidence_schema_assembler",
  "final_output_contract": "schemas/pilot_analysis.schema.json",
  "dataset_records_used": ["it_3pl_ecommerce", "internal_transport_picking_to_packing", "local_maintenance_unclear"],
  "assumptions": ["The buyer operates a mid-size fulfilment warehouse in Northern Italy", "The AMRs can operate safely on the selected route after mapping"],
  "validation_status": "schema_ready"
}
```

## Final Output

The backend should return a single JSON object matching `schemas/pilot_analysis.schema.json`. The frontend should render it into the Pilot Control Room sections:

- Product summary
- Best first buyer segment
- Best warehouse process
- Trust gap analysis
- Recommended pilot offer
- Target account shortlist
- Buyer objection battlecard
- Proof checklist
- Sales pack
- Next 7 days action plan

## Guardrails

- Do not recommend a full market-entry strategy when the input only supports a first pilot.
- Do not claim CE compliance is verified unless the provided documents prove it.
- Do not claim live-scraped or complete Italian leads exist in the MVP; the target-account shortlist comes from a curated seed dataset.
- Do not hide missing proof; convert it into a buyer-trust action.
- Do not generate generic sales copy that could apply to any SaaS or robotics company.
