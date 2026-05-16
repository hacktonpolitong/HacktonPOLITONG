# Architecture

This document describes the MVP architecture for PilotOps AI. The repository currently contains documentation, seed datasets, a structured output schema, a frontend app, a server-side analysis route, a deterministic market-entry engine, and optional OpenRouter integration.

## System Overview

PilotOps AI is a web app with:

- a product intake flow;
- a documentation readiness step;
- a structured AI analysis pipeline;
- local seed knowledge for the MVP;
- a Pilot Control Room dashboard;
- a Target Account Shortlist generated from a curated target-account database;
- generated sales materials.

The core system boundary is:

```text
Product intake + docs summary
        -> AI analysis pipeline + seed knowledge
        -> structured pilot analysis JSON
        -> Pilot Control Room dashboard, including Target Account Shortlist
```

## Frontend

Current frontend direction:

- React / Next.js;
- TypeScript;
- Tailwind CSS;
- dashboard-oriented UI;
- copy/export actions for generated materials.

Implemented screens:

1. Landing or start screen.
2. Product intake screen.
3. Documentation readiness checklist.
4. AI analysis loading screen.
5. Pilot Control Room.

The frontend should not be a plain chat interface. The primary output should feel like an operational dashboard for first-pilot decision-making.

Frontend implementation belongs to Matteo's scope.

## Backend / API Layer

The backend/API layer receives product intake data plus evidence text, builds a deterministic market-entry analysis from local seed data, optionally calls OpenRouter, validates live AI output, and returns structured JSON for dashboard rendering.

Expected responsibilities:

- validate intake payloads;
- load relevant seed datasets;
- call the AI analysis pipeline;
- enforce structured output contracts;
- return a complete Pilot Control Room payload;
- handle analysis errors in a way the UI can display clearly.

The current implementation uses a Next.js API route at `src/app/api/analyze/route.ts`.

## AI Pipeline

The AI should be called through structured steps, not one generic prompt.

Implemented deterministic pipeline:

1. Product parser: understand product type, warehouse use case, operational value, constraints, documentation state, and likely pilot scale.
2. Segment matcher: match the product to the most suitable Italian warehouse/logistics buyer segment.
3. Process selector: choose the warehouse workflow that is realistic for a low-risk first pilot.
4. Target account finder: filter and rank companies from the curated Italian target-account database using the recommended segment, warehouse process, priority region, product category, proof/trust gap compatibility, and pilot suitability.
5. Trust gap analyzer: identify buyer concerns and missing proof.
6. Pilot package generator: define pilot scope, duration, setup, KPIs, risk reducers, proof required, and next commercial step.
7. Sales pack generator: produce outreach email, meeting pitch, one-page proposal, proof checklist, objection battlecard, and action plan.
8. Structured output formatter: return a predictable JSON object for the dashboard.

OpenRouter is implemented as an optional live AI layer through `src/lib/openrouter-client.ts`. The deterministic engine remains the stable default and is used whenever no key is configured, `PILOTOPS_FORCE_LOCAL_ENGINE=1`, the provider fails, or live output fails validation.

## Seed Datasets

The MVP should use local seed datasets where possible instead of depending on broad live scraping.

Implemented seed data areas:

- Italian warehouse/logistics buyer segments;
- warehouse automation process options;
- common trust gaps;
- documentation and proof checklist items;
- buyer objections;
- competitor or alternative categories;
- demo AMR product profile.
- curated Italian target accounts in `data/italian_target_accounts.json`.

The target-account dataset should support company-level public contact paths and role-based outreach. It must not be treated as live web scraping, personal lead harvesting, or a source of private personal emails.

Seed dataset design belongs to Jacopo's setup scope.

## Product Intake to Pilot Control Room Flow

1. The user provides company and product information.
2. The user provides current proof and documentation status, either as fields or summaries.
3. The system evaluates documentation readiness against buyer proof expectations.
4. The backend loads relevant seed knowledge.
5. The AI pipeline classifies the product and maps it to an Italian buyer segment.
6. The pipeline selects the best pilot warehouse process.
7. The pipeline filters and ranks compatible Italian target accounts from the curated target-account database.
8. The pipeline identifies trust gaps and buyer objections.
9. The pipeline generates the recommended pilot offer and sales pack.
10. The backend returns structured JSON.
11. The frontend renders the Pilot Control Room dashboard.

## Pilot Control Room Output

The dashboard should include:

- Pilot Fit Score;
- Best First Buyer Segment;
- Best Warehouse Process;
- Why Now / timing signals;
- Trust Gap Analysis;
- Recommended Pilot Offer;
- Buyer Objection Battlecard;
- Documentation / Proof Checklist;
- Target Account Shortlist;
- Ready-to-Send Sales Pack;
- Next 7 Days Action Plan.

## Current QA Notes

The repository exposes:

- `npm run eval:fixtures`: starts the local app with the deterministic engine forced, runs AMR, parcel sorting, inventory scanning, palletizing, strong-proof, and region-preference scenarios, and checks expected behavior.
- `npm run validate:schema`: runs the same fixtures and validates every response against `schemas/pilot_analysis.schema.json` using the local schema subset needed by the MVP.
