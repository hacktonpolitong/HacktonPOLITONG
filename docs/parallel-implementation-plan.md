# Parallel Implementation Plan

## Current State

PilotOps AI now has the core MVP path implemented:

- editable frontend intake with product fields and text-readable evidence file uploads;
- `POST /api/analyze` server route;
- deterministic market-entry engine in `src/lib/market-entry-engine.ts`;
- optional OpenRouter path in `src/lib/openrouter-client.ts`;
- runtime validation and deterministic fallback;
- Product Evidence, Segment Decision Matrix, and Why This Segment Wins sections in the Control Room;
- curated target-account shortlist from `data/italian_target_accounts.json`;
- fixture evals and schema validation through npm scripts.

## Workstreams

### Francesco - Backend Engine

Status: implemented for MVP.

Owned behavior:

- parse `profile` and `evidence_inputs`;
- classify AMR, AGV, sorting automation, palletizing automation, picking robot, inventory scanning robot, and WMS/orchestration;
- score Italian buyer segments;
- select a warehouse process;
- generate trust gaps, pilot package, proof checklist, target accounts, sales pack, and next actions;
- keep the deterministic result usable without OpenRouter keys.

### Matteo - Frontend Experience

Status: implemented for MVP.

Owned behavior:

- editable intake;
- evidence file ingestion in-browser for text-readable files;
- loading sequence that communicates the analysis stages;
- Pilot Control Room with evidence summary, decision matrix, segment rationale, pilot package, trust gaps, target accounts, proof checklist, sales pack, and action plan.

### Jacopo - Data, Prompting, QA

Status: implemented for MVP.

Owned behavior:

- seed dataset coherence;
- OpenRouter prompt guardrails;
- no live scraping, personal contacts, guaranteed buyers, or compliance-certification claims;
- fixture evals for AMR, parcel sorting, inventory scanning, palletizing, strong proof, and region preference;
- docs updated to describe real implemented behavior.

## Final Merge Criteria

Before merging demo-readiness changes:

```bash
npm run lint
npm run build
npm run eval:fixtures
npm run validate:schema
```

Manual check:

- start screen opens;
- intake can be edited;
- evidence files can be uploaded as text-readable files;
- submit reaches loading and then the Pilot Control Room;
- Target Account Shortlist remains visible;
- no section claims live scraping, personal contacts, guaranteed buyers, certified compliance, or exhaustive leads.

## Remaining Product Decisions

These are intentionally outside the MVP implementation:

- whether to show live AI mode in the final pitch or rely only on deterministic mode;
- whether to add copy/export buttons with real file generation;
- whether to add source citations inside dashboard cards;
- whether to add PDF/OCR ingestion after the hackathon.
