# Code Map

This map reflects the repository during the project foundation phase. It should be updated after the AI/data and frontend setup branches are integrated.

## Root Files

- `README.md`: contributor onboarding, planned setup commands, environment notes, and links to key docs.
- `AGENTS.md`: operating guide for AI coding agents.
- `pilotops_ai_product_spec.md`: source product specification for PilotOps AI.
- `pilotops_ai_market_tech_analysis.md`: market, API, plugin, and repository analysis.

## Docs Directory

- `docs/team_setup_plan.md`: team ownership split, branch names, deliverables, and review matrix.
- `docs/project-brief.md`: short product brief and MVP framing.
- `docs/architecture.md`: planned system architecture and flow.
- `docs/code-map.md`: this repository map.
- `docs/decisions/ADR-0001-mvp-scope.md`: initial MVP scope decision.

## Planned Directories

These directories are expected from other setup branches, but are not part of Francesco's foundation implementation:

- `data/`: planned local JSON seed datasets owned by Jacopo.
- `schemas/`: planned structured output schemas owned by Jacopo.
- app/source directory: planned frontend and API scaffold owned by Matteo, exact path to be defined by the chosen Next.js setup.
- `docs/ai-pipeline.md`: planned AI pipeline documentation owned by Jacopo.
- `docs/data-model.md`: planned data model documentation owned by Jacopo.
- `docs/testing-and-evals.md`: planned testing and AI evaluation documentation owned by Jacopo.
- `docs/ui-system.md`: planned UI system documentation owned by Matteo.

## Current Application State

No runnable application exists yet. There is currently:

- no `package.json`;
- no Next.js app scaffold;
- no API route implementation;
- no AI pipeline implementation;
- no local seed data;
- no test/lint command.

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

