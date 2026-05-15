# PilotOps AI Data Model

This document describes the local JSON files owned by the AI/data pipeline and the master output schema used by the Pilot Control Room.

## File Overview

| File | Purpose | Primary Consumer |
|---|---|---|
| `data/italian_segments.json` | Italian warehouse/logistics buyer segment knowledge base | Segment Matcher |
| `data/warehouse_processes.json` | Warehouse process options with pilot suitability scoring | Process Selector |
| `data/trust_gaps.json` | Cross-border trust risks for Chinese vendors entering Italy | Trust Gap Analyzer |
| `data/proof_checklist.json` | Proof and documentation requirements for Italian market entry pilots | Trust Gap Analyzer, Sales Pack Generator |
| `data/demo_amr_profile.json` | Complete demo product intake for the AMR walkthrough | Product Parser, demo mode |
| `data/italian_target_accounts.json` | Curated Italian warehouse/logistics companies for AMR/AGV pilot prospecting | Target Account Finder |
| `schemas/pilot_analysis.schema.json` | Draft-07 schema for final Pilot Control Room output | Backend, frontend, evals |

## `italian_segments.json`

Shape:

```json
{
  "version": "1.0",
  "market": "Italy",
  "segments": [
    {
      "id": "it_3pl_ecommerce",
      "name": "Mid-size 3PL and e-commerce fulfilment warehouses",
      "typical_buyer_profile": {
        "decision_makers": ["Operations Director", "Warehouse Manager"],
        "company_profile": "Italian or Italy-based logistics operator serving e-commerce and retail clients.",
        "warehouse_context": "Multi-client fulfilment sites with picking, packing, dispatch, and returns flows.",
        "regions": ["Lombardy", "Veneto", "Emilia-Romagna", "Piedmont"]
      },
      "common_warehouse_processes": ["internal_transport_picking_to_packing"],
      "key_objections": ["local maintenance", "WMS integration"],
      "proof_requirements": ["technical_specs", "support_sla"],
      "fit_score_weight_rationale": {
        "process_fit": 0.3,
        "pain_intensity": 0.25,
        "pilotability": 0.2,
        "proof_burden": 0.15,
        "sales_cycle_practicality": 0.1
      }
    }
  ]
}
```

Notes:

- `id` is stable and should be used in pipeline outputs.
- `fit_score_weight_rationale` documents how the segment should be scored, but it is not itself the final score.
- `proof_requirements` values should match proof IDs from `proof_checklist.json` where possible.

## `warehouse_processes.json`

Shape:

```json
{
  "version": "1.0",
  "processes": [
    {
      "id": "internal_transport_picking_to_packing",
      "name": "Internal transport between picking and packing",
      "description": "Move totes or carts from picking aisles to packing benches.",
      "suitable_product_categories": ["AMR", "AGV"],
      "segment_fit": ["it_3pl_ecommerce", "it_retail_logistics"],
      "pilot_suitability_score": 91,
      "score_rationale": "Bounded, repetitive, measurable, and deployable without full warehouse redesign.",
      "kpis": ["manual_walking_time_reduction"],
      "constraints": ["Clear route", "Wi-Fi coverage"],
      "recommended_pilot_shape": {
        "duration_days": 45,
        "systems": "2 AMRs",
        "scope": "One mapped route"
      }
    }
  ]
}
```

Notes:

- `pilot_suitability_score` is a seed score from 0 to 100.
- The AI may adjust the final recommendation score based on product evidence, but must preserve the rationale.

## `trust_gaps.json`

Shape:

```json
{
  "version": "1.0",
  "trust_gaps": [
    {
      "id": "local_maintenance_unclear",
      "title": "Local maintenance and response model unclear",
      "risk_level": "high",
      "applies_to": ["AMR", "AGV", "sorting automation"],
      "buyer_concern": "Italian warehouse operators need confidence that downtime will not block dispatch.",
      "recommended_mitigation": "Prepare an Italian or EU support response plan with spare parts availability.",
      "proof_to_prepare": ["support_sla", "spare_parts_plan"]
    }
  ]
}
```

Notes:

- `risk_level` must be one of `low`, `medium`, `high`, or `critical`.
- `proof_to_prepare` should reference proof checklist IDs.

## `proof_checklist.json`

Shape:

```json
{
  "version": "1.0",
  "status_options": ["available", "partial", "missing", "recommended"],
  "items": [
    {
      "id": "technical_specs",
      "name": "Technical specifications",
      "category": "technical",
      "why_italian_buyer_needs_it": "Operations and engineering teams need operating limits before accepting a pilot.",
      "minimum_content": ["Payload", "Speed", "Battery runtime"],
      "required_for_pilot": true,
      "buyer_confidence_impact": "high"
    }
  ]
}
```

Notes:

- The pipeline compares demo or user-provided document status against these items.
- This file is not a legal compliance validator. It is a buyer-readiness checklist.

## `demo_amr_profile.json`

Shape:

```json
{
  "company": {
    "name": "Shenzhen MovePilot Robotics",
    "country": "China",
    "buyer_user": "Head of International Expansion"
  },
  "product": {
    "name": "MP-800 Autonomous Mobile Robot",
    "category": "AMR",
    "description": "Autonomous mobile robot for warehouse internal transport."
  },
  "target_market": {
    "country": "Italy",
    "entry_goal": "Win first paid pilot"
  }
}
```

Notes:

- The actual file includes detailed specs, proof status, integration notes, constraints, and demo assumptions.
- The demo profile should be complete enough to pass through every pipeline stage without user input.

## `italian_target_accounts.json`

Purpose: curated Italian warehouse and logistics companies for AMR/AGV pilot prospecting. The file gives the Pilot Control Room a concrete target-account shortlist after the pipeline has selected the best buyer segment and warehouse process.

Shape:

```json
[
  {
    "company_name": "Example Logistics S.p.A.",
    "website": "https://example.com",
    "hq_region": "Lombardy",
    "logistics_category": "3PL and e-commerce fulfilment",
    "warehouse_signals": ["contract logistics and warehousing services"],
    "likely_process_fit": ["internal transport", "picking support"],
    "recommended_buyer_roles": ["Operations Director", "Warehouse Manager"],
    "outreach_angle": "Why this company is a plausible AMR/AGV pilot target now.",
    "source_note": "Official company website, press release, or public trade directory used for curation."
  }
]
```

Fields:

- `company_name` (`string`): public company name shown in the shortlist.
- `website` (`string`): official company domain only.
- `hq_region` (`string` or `null`): headquarters or best verified Italian region, using Lombardy, Veneto, Emilia-Romagna, Piedmont, Lazio, other, or `null` when not verified from public sources.
- `logistics_category` (`string`): one of the six target categories used by the MVP: 3PL and e-commerce fulfilment, retail logistics and fashion distribution, food and beverage logistics, pharma logistics, parcel/courier/sorting operations, or manufacturing and industrial distribution.
- `warehouse_signals` (`array<string>`): public company-level signals that suggest warehouse, fulfilment, distribution, sorting, cold-chain, pharma, or industrial logistics relevance.
- `likely_process_fit` (`array<string>`): warehouse processes likely relevant to the company, using the process labels from the seed process model such as internal transport, picking support, parcel sorting, pallet movement, inventory scanning, and line-side replenishment.
- `recommended_buyer_roles` (`array<string>`): role titles to approach, never real people or personal contact details.
- `outreach_angle` (`string`): one concise reason the AMR/AGV vendor should approach this account for a pilot conversation.
- `source_note` (`string`): public sourcing note, usually official websites, press releases, or public trade directories.

Sourcing approach:

- Use public company-level data only.
- Prefer official company websites, official press releases, public trade directories, and public company materials.
- Do not include personal contacts, private emails, phone numbers, LinkedIn profiles, or scraped personal data.
- Treat the dataset as a curated MVP seed, not a live or exhaustive Italian company database.
- It is not a guarantee that any account will buy, reply, or accept a pilot.

Filtering logic:

1. Take `selected_segment` and `selected_process` from the Segment Matcher and Process Selector.
2. Filter accounts where `logistics_category` maps to the selected segment.
3. Filter or boost accounts where `likely_process_fit` includes the selected process family.
4. Boost accounts whose `hq_region` matches the preferred pilot region, when a region preference exists.
5. Boost accounts whose `warehouse_signals` mention process-relevant signals such as fulfilment, cold chain, sorting hub, automated warehouse, distribution centre, or line-side flow.
6. Return the top 5 to 10 accounts as `target_account_shortlist`, ordered by fit and with the outreach angle preserved.

## Master Schema

`schemas/pilot_analysis.schema.json` defines the final dashboard contract. Required top-level fields:

- `metadata`
- `product_summary`
- `buyer_segment_recommendation`
- `warehouse_process_recommendation`
- `trust_gaps`
- `pilot_offer`
- `target_account_shortlist` (optional)
- `objection_battlecard`
- `proof_checklist`
- `next_7_days_plan`
- `sales_pack`

Frontend rendering expectation:

- Each top-level field maps to one Pilot Control Room area.
- Arrays are ordered by priority.
- Scores use 0 to 100 numeric ranges.
- Risk values use `low`, `medium`, `high`, or `critical`.
- Status values use `available`, `partial`, `missing`, or `recommended`.

## Compatibility Rules

- Keep IDs stable once the frontend consumes them.
- Add new optional fields only after checking schema and frontend rendering.
- Do not rename top-level schema fields without coordinating with frontend owners.
- Use Italy-specific warehouse, logistics, and buyer language in seed data.
- Keep compliance content as readiness guidance, not formal certification advice.
- Do not add private personal contact data to target-account outputs.
- Prefer company-level public contact paths and role-based outreach.
