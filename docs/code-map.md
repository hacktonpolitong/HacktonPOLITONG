# Code Map

This map reflects the repository during early MVP setup. It should be updated as AI/backend and frontend implementation branches continue to integrate.

## Root Files

- `README.md`: contributor onboarding, planned setup commands, environment notes, and links to key docs.
- `AGENTS.md`: operating guide for AI coding agents.
- `pilotops_ai_product_spec.md`: source product specification for PilotOps AI.
- `pilotops_ai_market_tech_analysis.md`: market, API, plugin, and repository analysis.
- `package.json`: frontend scaffold scripts and dependencies, when present on the active branch.

## Docs Directory

- `docs/team_setup_plan.md`: team ownership split, branch names, deliverables, and review matrix.
- `docs/project-brief.md`: short product brief and MVP framing.
- `docs/architecture.md`: planned system architecture and flow.
- `docs/code-map.md`: this repository map.
- `docs/ai-pipeline.md`: structured AI pipeline design owned by Jacopo.
- `docs/data-model.md`: local data and schema documentation owned by Jacopo.
- `docs/testing-and-evals.md`: planned testing and AI evaluation documentation owned by Jacopo.
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

When present, `src/` contains the frontend scaffold owned by Matteo:

- `src/app/`: Next.js app files.
- `src/components/`: reusable UI, dashboard, and screen components.
- `src/lib/`: typed mock data and shared helpers.

## Current Application State

The repository may include a frontend scaffold and package scripts, but the AI endpoint is not complete yet. Current pending areas:

- no API route implementation;
- no AI pipeline implementation;
- automated tests and schema validation scripts may still be pending.

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
