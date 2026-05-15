# PilotOps AI

PilotOps AI is a B2B AI-powered web application for the Shanghai International Hackathon 2026.

It helps Chinese warehouse automation companies prepare their first realistic Italian pilot strategy. The product turns a company's product description and available documentation into a practical Pilot Entry Package: the best Italian buyer segment, the best warehouse process to pilot, the main trust gaps to close, and the sales materials needed to start a credible buyer conversation.

PilotOps AI is not intended to be a generic market report generator. The MVP focus is narrower: help a Head of International Expansion understand what to do next to sell a low-risk first pilot in the Italian warehouse/logistics market.

## Current Repository State

This repository is in the initial foundation phase.

At this stage it contains product documentation, market/technical analysis, team setup planning, and foundation docs. The application scaffold has not been added yet.

## MVP Scope

The MVP is expected to include:

- product intake;
- documentation readiness checklist;
- AI analysis pipeline;
- Italian buyer segment recommendation;
- warehouse process recommendation;
- trust gap analysis;
- pilot offer generation;
- buyer objection battlecard;
- sales pack generation;
- Pilot Control Room dashboard.

The MVP should not attempt to:

- cover every European market;
- certify legal or compliance readiness;
- guarantee real sales leads;
- build a full CRM;
- scrape the web at scale;
- behave as a plain chatbot;
- produce only a generic consulting report.

## Planned Technical Direction

The product spec and technical analysis currently point toward:

- Frontend: Next.js, React, TypeScript, Tailwind CSS.
- UI: dashboard-oriented Pilot Control Room, with shadcn/ui or equivalent components planned.
- Backend/API layer: Next.js API routes or server actions are expected, but not implemented yet.
- AI layer: OpenAI Responses API with structured outputs is the preferred direction.
- Data layer: local JSON seed datasets for the MVP, with optional document ingestion later.

These are planned directions, not installed dependencies in the current repository.

## Install Dependencies

No application dependencies are currently defined because the app scaffold has not been created yet.

After the frontend/backend scaffold is added, the expected setup will likely be:

```bash
npm install
```

Use the exact command from `package.json` once that file exists.

## Run the App

There is no runnable app yet in this foundation branch.

After the scaffold is added, the expected local command will likely be:

```bash
npm run dev
```

Use the exact script names exposed by `package.json` once the app exists.

## Environment Variables

No environment variables are required by the current documentation-only repository.

Expected future variables:

- `OPENAI_API_KEY`: planned for the AI analysis pipeline.
- `OPENAI_MODEL`: optional model selector if the implementation supports it.
- `TAVILY_API_KEY` or `EXA_API_KEY`: optional and only if the team adds external web research.

Do not add API keys to the repository. Use a local `.env.local` file once the app scaffold supports it.

## Key Documents

- [Product spec](./pilotops_ai_product_spec.md): product vision, MVP scope, user flow, and expected output.
- [Market and tech analysis](./pilotops_ai_market_tech_analysis.md): similar tools, recommended APIs, and useful repositories.
- [Team setup plan](./docs/team_setup_plan.md): ownership split across Francesco, Jacopo, and Matteo.
- [Project brief](./docs/project-brief.md): short product summary for contributors.
- [Architecture](./docs/architecture.md): planned system boundaries and data flow.
- [Code map](./docs/code-map.md): current repository map and future integration notes.
- [Agent guide](./AGENTS.md): working rules for AI coding agents.
- [ADR 0001](./docs/decisions/ADR-0001-mvp-scope.md): initial MVP scope decision.

## Team Workflow

Initial setup work is split by branch:

- `setup/francesco-project-foundation`: project foundation, documentation, onboarding, workflow.
- `setup/jacopo-ai-data-pipeline`: AI pipeline design, schemas, seed datasets, evaluation fixtures.
- `setup/matteo-frontend-control-room`: frontend scaffold and Pilot Control Room UX.

Each branch should stay small and reviewable. See [team setup plan](./docs/team_setup_plan.md) for review ownership.

