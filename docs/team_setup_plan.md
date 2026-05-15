# PilotOps AI - Initial Team Setup Plan

Owner split: Francesco, Jacopo, Matteo  
Goal: set up the initial working environment so the team can build the MVP in parallel with reciprocal reviews.

## Working Rules

- Each person works on a separate branch.
- Each branch must have a small, reviewable scope.
- No one rewrites another person's files without coordination.
- Every PR must include:
  - what changed;
  - how to run or inspect it;
  - what is intentionally left out;
  - screenshots if UI is touched.
- Reviews should check correctness, clarity and alignment with the product spec, not personal style preferences.

## Branches

- `setup/francesco-project-foundation`
- `setup/jacopo-ai-data-pipeline`
- `setup/matteo-frontend-control-room`

## Task 1 - Francesco: Project Foundation and Developer Context

### Objective

Create the base project structure and the documentation that keeps future agents and team members aligned.

### Ownership

Francesco owns:

- repo structure;
- project documentation;
- onboarding instructions;
- environment conventions;
- team workflow.

### Deliverables

1. Create or update:
   - `README.md`
   - `AGENTS.md`
   - `docs/project-brief.md`
   - `docs/architecture.md`
   - `docs/code-map.md`
   - `docs/decisions/ADR-0001-mvp-scope.md`

2. `README.md` should include:
   - what PilotOps AI is;
   - how to install dependencies;
   - how to run the app;
   - required environment variables;
   - where the main docs live.

3. `AGENTS.md` should include:
   - product identity;
   - non-goals;
   - coding conventions;
   - file ownership notes;
   - how to test;
   - what agents should read first.

4. `docs/architecture.md` should describe:
   - frontend;
   - backend/API layer;
   - AI pipeline;
   - seed datasets;
   - flow from intake to Pilot Control Room.

### Acceptance Criteria

- A new contributor can understand the project in under 10 minutes.
- An AI coding agent can identify the key files and system boundaries.
- Documentation matches the product spec and does not invent unsupported features.

### Reviewers

- Primary reviewer: Jacopo
- Secondary reviewer: Matteo

## Task 2 - Jacopo: AI Pipeline and Data Foundation

### Objective

Define the structured AI workflow and the initial local datasets that power the Pilot Control Room.

### Ownership

Jacopo owns:

- AI pipeline design;
- output JSON schema;
- prompt strategy;
- seed data;
- evaluation fixtures.

### Deliverables

1. Create or update:
   - `docs/ai-pipeline.md`
   - `docs/data-model.md`
   - `docs/testing-and-evals.md`
   - `data/italian_segments.json`
   - `data/warehouse_processes.json`
   - `data/trust_gaps.json`
   - `data/proof_checklist.json`
   - `data/demo_amr_profile.json`
   - `schemas/pilot_analysis.schema.json`

2. `docs/ai-pipeline.md` should define:
   - product parser;
   - segment matcher;
   - process selector;
   - trust gap analyzer;
   - pilot package generator;
   - sales pack generator;
   - expected structured output.

3. Seed datasets should cover at least:
   - 3PL/e-commerce fulfilment;
   - retail logistics;
   - food and beverage logistics;
   - pharma logistics;
   - parcel/sorting operations;
   - manufacturing warehouses.

4. `schemas/pilot_analysis.schema.json` should include:
   - product summary;
   - buyer segment recommendation;
   - warehouse process recommendation;
   - trust gaps;
   - pilot offer;
   - objection battlecard;
   - proof checklist;
   - next 7 days plan;
   - sales pack.

### Acceptance Criteria

- The schema is usable by the backend without ambiguity.
- The seed data is specific to Italy and warehouse/logistics operations.
- The demo AMR profile can drive a full MVP walkthrough.
- The pipeline avoids generic market-report output.

### Reviewers

- Primary reviewer: Matteo
- Secondary reviewer: Francesco

## Task 3 - Matteo: Frontend MVP Skeleton and Pilot Control Room UX

### Objective

Set up the frontend application shell and the first usable Pilot Control Room structure.

### Ownership

Matteo owns:

- frontend scaffold;
- UI system;
- main app screens;
- dashboard layout;
- interaction states.

### Deliverables

1. Create or update the app scaffold:
   - Next.js + TypeScript;
   - Tailwind CSS;
   - shadcn/ui or equivalent component setup;
   - lucide-react icons;
   - Recharts if charts are included.

2. Create or update:
   - `docs/ui-system.md`
   - app landing/start screen;
   - product intake screen;
   - analysis loading screen;
   - Pilot Control Room screen;
   - reusable dashboard components.

3. The Pilot Control Room should include placeholder sections for:
   - Pilot Fit Score;
   - Best First Buyer Segment;
   - Best Warehouse Process;
   - Why Now;
   - Trust Gap Analysis;
   - Recommended Pilot Offer;
   - Buyer Objection Battlecard;
   - Documentation Checklist;
   - Sales Pack;
   - Next 7 Days Action Plan.

4. Use mock data from Jacopo's schema shape, even before the real AI endpoint exists.

### Acceptance Criteria

- The app runs locally.
- The main flow is demoable with mock data.
- Layout feels like an operational dashboard, not a chatbot or generic report.
- UI can later consume structured JSON without a major rewrite.

### Reviewers

- Primary reviewer: Francesco
- Secondary reviewer: Jacopo

## Review Cycle

### Round 1 - Setup Review

Each person opens a PR from their setup branch.

Review matrix:

| PR Owner | Primary Reviewer | Secondary Reviewer |
|---|---|---|
| Francesco | Jacopo | Matteo |
| Jacopo | Matteo | Francesco |
| Matteo | Francesco | Jacopo |

### Round 2 - Integration Review

After the three PRs are individually approved:

1. merge Francesco's foundation branch first;
2. merge Jacopo's AI/data branch second;
3. merge Matteo's frontend branch third;
4. run the app;
5. verify that the frontend can consume mock data matching the schema;
6. update `docs/code-map.md`.

## Suggested First-Day Timeline

### Hour 1

- Francesco creates foundation docs and repo conventions.
- Jacopo drafts schema and seed data list.
- Matteo scaffolds UI and identifies component needs.

### Hour 2

- Francesco finalizes `AGENTS.md` and `README.md`.
- Jacopo creates initial JSON datasets and demo AMR profile.
- Matteo builds the page skeleton and mock dashboard.

### Hour 3

- First PRs opened.
- Reciprocal reviews.
- Fixes and merge order agreed.

### Hour 4

- Integration pass.
- Run local app.
- Align frontend mock data with Jacopo's schema.
- Update docs with any changed decisions.

## Definition of Done

The initial environment is ready when:

- the app can run locally;
- the core docs exist;
- the AI/data schema exists;
- the UI has the main flow mocked;
- every person has reviewed another person's work;
- the next implementation tasks can start without ambiguity.

