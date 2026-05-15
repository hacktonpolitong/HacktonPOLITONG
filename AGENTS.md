# AGENTS.md

This file gives AI coding agents the minimum project context needed to work safely in PilotOps AI.

## Read First

Before making changes, read these files in order:

1. [Product spec](./pilotops_ai_product_spec.md)
2. [Project brief](./docs/project-brief.md)
3. [Architecture](./docs/architecture.md)
4. [Code map](./docs/code-map.md)
5. [Team setup plan](./docs/team_setup_plan.md)

For API/tooling choices, also read [market and tech analysis](./pilotops_ai_market_tech_analysis.md).

## Product Identity

PilotOps AI helps Chinese warehouse automation companies enter the Italian market by identifying the most realistic first pilot opportunity.

The core output is a Pilot Control Room: a structured dashboard showing the recommended Italian buyer segment, warehouse process, trust gaps, pilot package, buyer objections, proof checklist, sales pack, and next actions.

The product is for the Chinese vendor's Head of International Expansion or similar role. The Italian warehouse/logistics company is the final customer the vendor wants to win.

Keep the product focused on this sentence:

> PilotOps AI turns a Chinese warehouse automation product into a localized, low-risk Italian pilot package.

## Non-Goals

Do not turn the MVP into:

- a generic market report generator;
- a broad European market-entry platform;
- a full CRM;
- a lead scraping system;
- an autonomous outreach engine;
- a legal/compliance certification tool;
- a plain chatbot;
- a robotics simulator;
- a guarantee that a pilot will be sold.

## Current Implementation State

This branch is foundation/documentation only. There is no app scaffold, no package manager config, no AI endpoint, no seed dataset directory, and no frontend implementation yet.

When documenting planned systems, use conservative language such as `planned`, `expected`, or `to be defined`.

## Ownership Notes

Initial setup ownership:

- Francesco: project foundation, documentation, onboarding, environment conventions, team workflow.
- Jacopo: AI pipeline, output schema, prompt strategy, seed data, evaluation fixtures.
- Matteo: frontend scaffold, UI system, app screens, dashboard layout.

Agents should stay inside the ownership scope of the active branch. Do not rewrite another teammate's files unless the user explicitly asks or the change is required for consistency.

## Coding Conventions

Until the application scaffold exists:

- keep documentation in Markdown;
- use clear headings and concise lists;
- link related docs with relative links;
- do not add dependencies, package files, or app scaffolding from the foundation branch;
- do not create AI implementation files or datasets from the foundation branch;
- do not create frontend implementation files from the foundation branch.

Once app code exists, follow the conventions established by the scaffold and update this file if needed.

Expected future conventions:

- TypeScript for application code;
- structured AI outputs rather than free-form report blobs;
- local JSON seed data for MVP knowledge where appropriate;
- small, reviewable changes;
- no unrelated refactors during feature work.

## Testing

No runnable app or test suite exists yet.

Before finishing a task:

1. check the current branch with `git branch --show-current`;
2. inspect changed files with `git status --short`;
3. run available lint/test commands only if the repository exposes them;
4. for documentation-only changes, verify required files exist and links are coherent.

When app scripts are added, document the canonical commands here and in [README.md](./README.md).

## PR Expectations

Every PR should explain:

- what changed;
- how to inspect or run it;
- what is intentionally left out;
- screenshots only if UI was touched.

Review should prioritize correctness, scope control, and alignment with the product spec.

