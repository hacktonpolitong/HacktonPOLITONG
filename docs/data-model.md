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

## Master Schema

`schemas/pilot_analysis.schema.json` defines the final dashboard contract. Required top-level fields:

- `metadata`
- `product_summary`
- `buyer_segment_recommendation`
- `warehouse_process_recommendation`
- `trust_gaps`
- `pilot_offer`
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
