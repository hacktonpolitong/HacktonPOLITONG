# Testing and Evals

This document defines how to evaluate the AI pipeline outputs for the PilotOps AI MVP. The goal is to catch generic reports, missing proof logic, weak pilot design, and schema drift before the frontend consumes the output.

## Evaluation Scope

The first evaluation set should cover:

- Product parsing accuracy
- Italian segment matching
- Segment scorecard quality
- Warehouse process selection
- Trust gap prioritization
- Target Account Shortlist quality
- Pilot offer specificity
- Sales pack usefulness
- JSON schema validity

The MVP evals should use local fixtures and deterministic checks first. Model-quality scoring can be added later, but the initial bar is whether the generated Pilot Control Room is specific, complete, and usable.

## Seed Data QA Audit

P0 audit completed for Jacopo-owned seed datasets:

- `data/italian_segments.json`: 6 Italy-specific buyer segments are present and remain mappable to warehouse processes used by the pipeline.
- `data/warehouse_processes.json`: 6 process families are present and cover AMR, AGV, sorting automation, palletizing automation, picking robot, inventory scanning robot, and WMS/orchestration use cases.
- `data/trust_gaps.json`: core Italian buyer trust risks are covered, including no Italian reference customer, local maintenance and spare parts, CE/safety evidence, WMS integration path, localized ROI, documentation language, and installation disruption.
- `data/proof_checklist.json`: proof items cover technical, safety, deployment, support, integration, business-case, and commercial-structure readiness.
- `data/italian_target_accounts.json`: target accounts use public company-level data only. `likely_process_fit` has been normalized so account ranking can distinguish 3PL/e-commerce, retail/fashion, food and beverage, pharma, parcel/sorting, and manufacturing/industrial use cases.

Target-account process-fit normalization:

- `3PL and e-commerce fulfilment`: internal transport, picking support, inventory scanning.
- `Retail logistics and fashion distribution`: picking support, inventory scanning, internal transport; parcel sorting only when public signals mention package or shipment handling.
- `Food and beverage logistics`: pallet movement, internal transport, inventory scanning.
- `Pharma logistics`: inventory scanning, picking support, internal transport.
- `Parcel, courier, and sorting operations`: parcel sorting, internal transport.
- `Manufacturing and industrial distribution`: line-side replenishment, pallet movement, inventory scanning, internal transport.

Safety checks:

- Do not include personal emails, private phone numbers, personal LinkedIn profiles, personal decision-maker data, buying-intent claims, or guaranteed-buyer language.
- Source notes should remain cautious and describe public company pages, public press releases, or public trade information.
- Target accounts are a curated MVP seed for ranking, not an exhaustive lead database.

## Core Fixtures

### Fixture A: AMR Internal Transport

Fixture definition:

```json
{
  "profile": {
    "companyName": "Shenzhen Northstar Mobility",
    "productCategory": "AMR",
    "targetMarket": "Italy",
    "description": "Autonomous mobile robot for moving totes, cartons, and small carts between picking, packing, and dispatch staging zones.",
    "benefits": ["Reduce manual walking time", "Deploy in one bounded route", "Avoid fixed conveyor redesign"],
    "currentProof": ["Technical specifications", "API summary", "Chinese fulfilment workflow case outline"],
    "missingProof": ["Italian reference customer", "local maintenance model", "localized ROI model", "buyer-ready CE/safety summary"],
    "documentationStatus": "CE/safety summary partial; Italian reference missing; local maintenance model missing; ROI model not localized.",
    "pilotAmbition": "Win a 45-day pilot with a mid-size Italian 3PL or e-commerce fulfilment warehouse.",
    "constraints": ["No Italian reference customer", "No local maintenance partner identified", "WMS integration should start with tablet dispatch or CSV import"]
  },
  "evidence_inputs": {
    "chinese_documentation_text": "AMR fleet has been used for tote movement between picking and packing in Chinese fulfilment operations.",
    "website_product_text": "SLAM navigation AMR for internal warehouse transport with fleet dashboard and obstacle detection.",
    "technical_specs_text": "Payload 300 kg, max speed 1.6 m/s, battery runtime 10 hours, Wi-Fi, REST API, CSV task import.",
    "proof_certification_notes": "Partial CE/safety summary available; buyer-ready risk assessment not prepared.",
    "case_study_roi_notes": "Chinese case outline available; Italian ROI assumptions still missing."
  }
}
```

Expected behavior:

- Product category: AMR
- Recommended buyer segment: 3PL/e-commerce fulfilment or retail logistics, with 3PL/e-commerce preferred when the product emphasizes tote movement between picking and packing.
- Recommended process: internal transport.
- Target Account Shortlist: compatible Italian 3PL/e-commerce fulfilment accounts from the curated target-account database, ideally in Lombardy, Veneto, Emilia-Romagna, or Piedmont when enough verified accounts exist.
- High-priority trust gaps: local maintenance, Italian reference, localized ROI, WMS integration, CE/safety evidence.
- Pilot offer: bounded 45-day pilot, 2 AMRs, one mapped route, measurable KPIs, exit clause.

Pass criteria:

- Output validates against `schemas/pilot_analysis.schema.json`.
- Output includes `product_evidence_profile` and `segment_scorecards`.
- Output includes `target_account_shortlist`.
- The pilot does not require a full warehouse redesign.
- Shortlisted accounts match the recommended buyer segment and warehouse process.
- The sales pack includes concrete Italian buyer objections and responses.

Dashboard checks:

- First viewport shows AMR, Italy, internal transport, and 3PL/e-commerce or retail fit without reverting to a generic market report.
- Trust gaps visibly prioritize CE/safety, local maintenance, Italian reference, ROI, and WMS integration.
- Target Account Shortlist shows curated company-level accounts only, not personal contacts or guaranteed leads.

### Fixture B: Sorting Automation for Parcel Flow

Fixture definition:

```json
{
  "profile": {
    "companyName": "Guangzhou SortLine Automation",
    "productCategory": "sorting automation",
    "targetMarket": "Italy",
    "description": "Modular parcel sorter for courier depots handling mixed small parcels, e-commerce parcels, and returns.",
    "benefits": ["Increase parcels per hour", "Reduce manual sorting errors", "Add modular sorting lanes"],
    "currentProof": ["Technical specifications", "Chinese parcel hub case study", "Throughput test video"],
    "missingProof": ["buyer-ready CE/safety summary", "Italian parcel-hub reference", "local maintenance plan", "localized ROI model"],
    "documentationStatus": "CE/safety summary partial; barcode/WMS integration notes partial; Italian reference missing; maintenance plan missing.",
    "pilotAmbition": "Pilot one parcel sorting lane in an Italian courier depot.",
    "constraints": ["Requires conveyor interface", "Needs barcode scan integration", "Installation can only occur over a weekend"]
  },
  "evidence_inputs": {
    "chinese_documentation_text": "Sorter deployed in Chinese parcel hub for mixed parcel and returns flow.",
    "website_product_text": "Modular sortation system for courier depots and e-commerce parcel operations.",
    "technical_specs_text": "Lane-based sorter, barcode scan handoff, modular diverts, weekend installation option.",
    "proof_certification_notes": "Partial safety file; CE/safety summary not yet buyer-ready for Italy.",
    "case_study_roi_notes": "Throughput video available; Italian labor and mis-sort baseline not yet localized."
  }
}
```

Expected behavior:

- Recommended buyer segment: parcel/sorting operations.
- Recommended process: parcel sorting or dispatch sorting.
- High-priority trust gaps: installation downtime, safety documentation, integration with barcode/WMS systems, local maintenance.
- Pilot should be scoped to one lane or one shift, not a whole hub.
- KPIs should include parcels per hour, mis-sort rate, sorting lane uptime, and exception handling time.
- Target Account Shortlist should not drift into unrelated generic logistics companies without parcel/sorting relevance.

Dashboard checks:

- Buyer segment and shortlist stay focused on parcel, courier, and sorting operations.
- Warehouse process is parcel sorting, with KPIs around throughput, mis-sort rate, lane uptime, and exception handling.
- Trust gaps call out installation downtime, barcode/WMS integration, CE/safety, and local maintenance.

### Fixture C: Inventory Scanning Robot

Fixture definition:

```json
{
  "profile": {
    "companyName": "Hangzhou ScanFleet Robotics",
    "productCategory": "inventory scanning robot",
    "targetMarket": "Italy",
    "description": "Autonomous inventory scanning robot for barcode and shelf-location checks in high-SKU warehouses.",
    "benefits": ["Improve inventory accuracy", "Reduce manual cycle count time", "Increase scan coverage outside peak shifts"],
    "currentProof": ["Technical specifications", "Scanning accuracy test report", "Chinese retail warehouse case summary"],
    "missingProof": ["Italian reference customer", "data security summary", "local maintenance model", "buyer-ready CE/safety summary"],
    "documentationStatus": "CE/safety evidence partial; data security summary missing; Italian reference missing; local support model missing.",
    "pilotAmbition": "Pilot autonomous cycle counting in one Italian retail, pharma, or manufacturing warehouse zone.",
    "constraints": ["Needs barcode visibility", "Requires Wi-Fi coverage", "Must avoid interfering with picking operations"]
  },
  "evidence_inputs": {
    "chinese_documentation_text": "Robot used for night-shift cycle counting and barcode scan coverage in Chinese retail warehouses.",
    "website_product_text": "Inventory scanning robot for barcode checks, location verification, and cycle-count automation.",
    "technical_specs_text": "Autonomous navigation, barcode camera, scan logs, dashboard export, Wi-Fi connectivity.",
    "proof_certification_notes": "Partial safety summary; data handling and IT security note not ready.",
    "case_study_roi_notes": "Chinese case claims faster cycle counts; Italian accuracy and labor baseline missing."
  }
}
```

Expected behavior:

- Recommended buyer segment: retail logistics, pharma logistics, or manufacturing warehouses where inventory accuracy is operationally important.
- Recommended process: inventory scanning.
- High-priority trust gaps: CE/safety evidence, data security or IT review, Italian reference, local maintenance.
- Pilot should be scoped to one zone, SKU family, or off-peak inventory-counting window.
- KPIs should include scan coverage, inventory accuracy, cycle-count time, exception rate, and operator intervention time.
- Target Account Shortlist should favor accounts with inventory scanning in `likely_process_fit`, not parcel/sorting accounts by default.

Dashboard checks:

- Warehouse process is inventory scanning and does not collapse back to AMR internal transport.
- Shortlist favors retail, pharma, or manufacturing accounts with inventory scanning fit.
- Proof checklist highlights data/security review, CE/safety, Italian reference, and support readiness.

### Fixture D: Palletizing Automation for Food and Beverage

Fixture definition:

```json
{
  "profile": {
    "companyName": "Suzhou PalletFlex Robotics",
    "productCategory": "palletizing automation",
    "targetMarket": "Italy",
    "description": "Robotic palletizing cell for boxed beverage and packaged food warehouse dispatch lines.",
    "benefits": ["Reduce manual lifting", "Improve pallet consistency", "Support repetitive end-of-line flows"],
    "currentProof": ["Technical specifications", "Safety enclosure design", "Chinese food factory case study"],
    "missingProof": ["complete CE/safety summary", "Italian reference customer", "localized ROI model", "local support model"],
    "documentationStatus": "CE/safety summary partial; installation plan available; Italian reference missing; ROI model partial.",
    "pilotAmbition": "Pilot one palletizing cell after packing for a food and beverage warehouse or manufacturing site.",
    "constraints": ["Needs end-of-line space", "Requires safety fencing", "Must avoid disruption to dispatch"]
  },
  "evidence_inputs": {
    "chinese_documentation_text": "Palletizing cell used for boxed beverage end-of-line handling in Chinese food manufacturing.",
    "website_product_text": "Robotic palletizing cell for repetitive cartons, cases, and boxed product flows.",
    "technical_specs_text": "Safety enclosure, gripper options, pallet pattern configuration, end-of-line footprint.",
    "proof_certification_notes": "Safety enclosure design available; CE/safety summary still partial for buyer review.",
    "case_study_roi_notes": "Chinese case study available; Italian manual-lift reduction and dispatch baseline incomplete."
  }
}
```

Expected behavior:

- Recommended buyer segment: food and beverage logistics or manufacturing warehouses.
- Recommended process: pallet movement or end-of-line palletizing.
- High-priority trust gaps: safety validation, installation downtime, ROI localization, support model.
- Pilot should include one SKU family or one dispatch line with clear manual-lift reduction KPIs.
- KPIs should include pallets built per hour, manual lifts avoided, pallet stability/rework rate, and line uptime.
- Target Account Shortlist should match food and beverage logistics or manufacturing warehouse fit, not generic e-commerce fulfilment by default.

Dashboard checks:

- Recommended segment is food and beverage logistics or manufacturing, not generic 3PL by default.
- Recommended process is pallet movement or end-of-line palletizing with safety and disruption risks visible.
- Pilot offer is bounded to one dispatch line, SKU family, or end-of-line cell with manual fallback.

## Deterministic Checks

Run these checks on every generated final output:

- JSON parses successfully.
- Output validates against `schemas/pilot_analysis.schema.json`.
- All required top-level dashboard sections are present.
- `target_account_shortlist` is present.
- `product_evidence_profile` and `segment_scorecards` are present.
- Each target account has `company_name`, `website`, `hq_region`, `logistics_category`, `warehouse_signals`, `likely_process_fit`, at least one `recommended_buyer_roles` entry, `outreach_angle`, and `source_note`.
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
