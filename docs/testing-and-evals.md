# Testing and Evals

This document defines how to evaluate the AI pipeline outputs for the PilotOps AI MVP. The goal is to catch generic reports, missing proof logic, weak pilot design, and schema drift before the frontend consumes the output.

## Evaluation Scope

The first evaluation set should cover:

- Product parsing accuracy
- Italian segment matching
- Warehouse process selection
- Trust gap prioritization
- Target Account Shortlist quality
- Pilot offer specificity
- Sales pack usefulness
- JSON schema validity

The MVP evals should use local fixtures and deterministic checks first. Model-quality scoring can be added later, but the initial bar is whether the generated Pilot Control Room is specific, complete, and usable.

## Core Fixtures

### Fixture A: Demo AMR Internal Transport

Source: `data/demo_amr_profile.json`

Expected behavior:

- Product category: AMR
- Recommended buyer segment: 3PL/e-commerce fulfilment or retail logistics, with 3PL/e-commerce preferred when the product emphasizes tote movement between picking and packing.
- Recommended process: internal transport between picking and packing.
- Target Account Shortlist: compatible Italian 3PL/e-commerce fulfilment accounts from the curated target-account database, ideally in Lombardy, Veneto, Emilia-Romagna, or Piedmont when enough verified accounts exist.
- High-priority trust gaps: local maintenance, Italian reference, localized ROI, WMS integration, CE/safety evidence.
- Pilot offer: bounded 45-day pilot, 2 AMRs, one mapped route, measurable KPIs, exit clause.

Pass criteria:

- Output validates against `schemas/pilot_analysis.schema.json`.
- Output includes `target_account_shortlist`.
- The pilot does not require a full warehouse redesign.
- Shortlisted accounts match the recommended buyer segment and warehouse process.
- The sales pack includes concrete Italian buyer objections and responses.

### Fixture B: Sorting Automation for Parcel Flow

Fixture definition:

```json
{
  "company_name": "Guangzhou SortLine Automation",
  "product_category": "sorting automation",
  "product_description": "Modular parcel sorter for courier depots handling mixed small parcels and e-commerce returns.",
  "target_market": "Italy",
  "product_benefits": ["Higher parcels per hour", "Reduced manual sorting errors", "Modular lanes"],
  "current_proof_available": ["Technical specs", "Chinese parcel hub case study", "Throughput test video"],
  "documentation_status": {
    "ce_safety_summary": "partial",
    "wms_integration": "partial",
    "italian_reference": "missing",
    "maintenance_plan": "missing"
  },
  "desired_pilot_ambition": "Pilot one parcel sorting lane in an Italian courier depot",
  "known_constraints": ["Requires conveyor interface", "Needs barcode scan integration", "Installation can only occur over a weekend"]
}
```

Expected behavior:

- Recommended buyer segment: parcel/sorting operations.
- Recommended process: parcel sorting or dispatch sorting.
- High-priority trust gaps: installation downtime, safety documentation, integration with barcode/WMS systems, local maintenance.
- Pilot should be scoped to one lane or one shift, not a whole hub.
- Target Account Shortlist should not drift into unrelated generic logistics companies without parcel/sorting relevance.

### Fixture C: Palletizing Automation for Food and Beverage

Fixture definition:

```json
{
  "company_name": "Suzhou PalletFlex Robotics",
  "product_category": "palletizing automation",
  "product_description": "Robotic palletizing cell for boxed beverage and packaged food warehouse dispatch lines.",
  "target_market": "Italy",
  "product_benefits": ["Reduce manual lifting", "Improve pallet consistency", "Support repetitive end-of-line flows"],
  "current_proof_available": ["Technical specs", "Safety enclosure design", "Chinese food factory case study"],
  "documentation_status": {
    "ce_safety_summary": "partial",
    "installation_plan": "available",
    "italian_reference": "missing",
    "roi_model": "partial"
  },
  "desired_pilot_ambition": "Pilot one palletizing cell after packing",
  "known_constraints": ["Needs end-of-line space", "Requires safety fencing", "Must avoid disruption to dispatch"]
}
```

Expected behavior:

- Recommended buyer segment: food and beverage logistics or manufacturing warehouses.
- Recommended process: pallet movement or end-of-line palletizing.
- High-priority trust gaps: safety validation, installation downtime, ROI localization, support model.
- Pilot should include one SKU family or one dispatch line with clear manual-lift reduction KPIs.
- Target Account Shortlist should match food and beverage logistics or manufacturing warehouse fit, not generic e-commerce fulfilment by default.

## Deterministic Checks

Run these checks on every generated final output:

- JSON parses successfully.
- Output validates against `schemas/pilot_analysis.schema.json`.
- All required top-level dashboard sections are present.
- `target_account_shortlist` is present.
- Each target account has `company_name`, `website`, `hq_region`, `logistics_category`, `warehouse_signals`, `likely_process_fit`, at least one recommended buyer role, an `outreach_angle`, and `source_note`.
- No private personal contact data, personal decision-maker emails, or scraped personal profiles are present.
- Accounts match the recommended buyer segment and warehouse process.
- Each outreach angle is specific to the selected pilot and account fit.
- The shortlist does not drift into generic lead generation or present itself as exhaustive.
- `target_market` is Italy.
- At least one trust gap is `high` or `critical` when the demo profile lacks Italian references or local support proof.
- Pilot offer contains duration, scope, KPIs, buyer risk reducers, exit clause, and next commercial step.
- Sales pack contains outreach email, meeting pitch, one-page proposal, ROI argument, and follow-up message.
- No section is written as a generic market report.

## Recommended Local Commands

Use these after the backend validation script exists:

```bash
npm run eval:fixtures
npm run validate:schema
```

Until those scripts exist, use a simple JSON parse check and a schema validator in the backend task. The schema file is draft-07 and is compatible with common validators such as Ajv.

## Human Review Rubric

Score each generated analysis from 1 to 5:

| Criterion | 1 | 3 | 5 |
|---|---|---|---|
| Italy specificity | Generic Europe language | Mentions Italy but weak warehouse context | Uses Italian buyer, logistics, regional, proof, and support realities |
| Pilot realism | Full transformation or vague trial | Some scope and KPIs | Bounded pilot with route/process, KPIs, exit clause, and proof |
| Trust gap quality | Generic risk list | Correct but shallow risks | Buyer-specific objections with practical mitigations |
| Sales usefulness | Abstract copy | Usable but generic | Ready-to-send material tied to selected segment and process |
| Target account quality | Generic or unrelated accounts | Some account fit but weak reasoning | Segment/process-matched accounts with company-level public contact paths and specific outreach angle |
| Schema quality | Missing required fields | Valid but thin | Valid, complete, ordered by priority, frontend-ready |

Minimum acceptance score for the demo AMR fixture:

- Average score: 4.0 or higher
- No individual criterion below 3
- Schema validation must pass

## Failure Examples

These outputs should fail review:

- Recommending "Italian manufacturing companies" without naming the warehouse process.
- Suggesting full national expansion before the first pilot.
- Claiming CE compliance is complete when the input says the CE summary is partial.
- Producing a long market-size report instead of pilot scope and next actions.
- Presenting the Target Account Shortlist as scraped leads or guaranteed buyers.
- Including personal private contact data or personal decision-maker emails.
- Listing companies that do not match the recommended segment or warehouse process.
- Leaving the sales pack as generic "book a meeting" language.
- Returning a proof checklist without statuses or missing-proof recommendations.

## Review Workflow

1. Run the demo AMR fixture through the pipeline.
2. Validate the output against `schemas/pilot_analysis.schema.json`.
3. Compare selected segment and process against expected behavior.
4. Review Target Account Shortlist for segment/process fit, company-level public website/source notes, and absence of private personal data.
5. Review trust gaps for buyer realism and missing proof.
6. Review pilot offer for operational boundaries and KPIs.
7. Review sales pack for immediate usability by the Head of International Expansion.
8. Record failures as schema defects, data defects, or prompt defects.
