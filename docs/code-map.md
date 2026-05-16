# Code Map

This map reflects the repository after the demo-flow, target-account, and analysis API integration branches.

## Root Files

- `README.md`: contributor onboarding, setup commands, environment notes, demo path, and links to key docs.
- `AGENTS.md`: operating guide for AI coding agents.
- `pilotops_ai_product_spec.md`: source product specification for PilotOps AI.
- `pilotops_ai_market_tech_analysis.md`: market, API, plugin, and repository analysis.
- `package.json`: frontend scaffold scripts and dependencies, when present on the active branch.

## Docs Directory

- `docs/team_setup_plan.md`: team ownership split, branch names, deliverables, and review matrix.
- `docs/project-brief.md`: short product brief and MVP framing.
- `docs/architecture.md`: system architecture and flow.
- `docs/code-map.md`: this repository map.
- `docs/ai-pipeline.md`: structured AI pipeline design owned by Jacopo.
- `docs/data-model.md`: local data and schema documentation owned by Jacopo.
- `docs/testing-and-evals.md`: testing and AI evaluation documentation owned by Jacopo.
- `docs/parallel-implementation-plan.md`: current cross-workstream implementation status and final merge checklist.
- `docs/ui-system.md`: frontend UI system documentation owned by Matteo.
- `docs/decisions/ADR-0001-mvp-scope.md`: initial MVP scope decision.

## Data and Schema

These directories exist in the current MVP setup and are owned by Jacopo:

- `data/italian_segments.json`: Italian warehouse/logistics buyer segments.
- `data/warehouse_processes.json`: warehouse process options and pilot suitability data.
- `data/trust_gaps.json`: cross-border buyer trust gaps.
- `data/proof_checklist.json`: buyer proof and documentation readiness checklist.
- `data/demo_amr_profile.json`: demo AMR product profile.
- `data/italian_target_accounts.json`: curated Italian target-account dataset for the Target Account Shortlist.
- `schemas/pilot_analysis.schema.json`: structured Pilot Control Room output schema.

## App Source

`src/` contains the Next.js app, frontend flow, server-side analysis route, deterministic market-entry engine, optional OpenRouter client, and shared validation helpers:

- `src/app/`: Next.js app files, including `src/app/api/analyze/route.ts`.
- `src/components/`: reusable UI, dashboard, and screen components.
- `src/lib/`: demo profile, deterministic market-entry analysis, OpenRouter client, Pilot Analysis types, and response validation helpers.

## Current Application State

The current MVP includes:

- a clickable Start Screen -> Product Intake -> Analysis Loading -> Pilot Control Room flow;
- a server-side `POST /api/analyze` route;
- a deterministic multi-category market-entry engine that works without environment variables;
- optional OpenRouter live AI mode through server-side environment variables;
- Target Account Shortlist rendering from curated company-level seed data.

Fixture evals and schema validation are available through `npm run eval:fixtures` and `npm run validate:schema`.

## Ownership Boundaries

Francesco's foundation branch should modify:

- repository-level documentation;
- onboarding and workflow docs;
- architecture overview;
- code map;
- foundation ADRs.

It should not implement:

- AI pipeline code;
- prompt files;
- JSON seed datasets;
- frontend screens;
- application scaffolding;
- UI components.

## Update Notes for Integration

After Jacopo's AI/data branch is merged, update this map with:

- data file locations;
- schema file locations;
- AI pipeline docs;
- evaluation fixtures;
- any canonical commands for schema validation or evals.

After Matteo's frontend branch is merged, update this map with:

- app directory structure;
- reusable UI component locations;
- route/page locations;
- API route locations if introduced;
- local development commands.

## Review Checklist

When this file changes, confirm:

- paths exist or are clearly marked as planned;
- ownership notes still match `docs/team_setup_plan.md`;
- README and AGENTS still point to the correct key docs;
- no implementation promises are made for code that does not exist.
