# PilotOps AI

PilotOps AI is a B2B AI-powered web application for the Shanghai International Hackathon 2026.

It helps Chinese warehouse automation companies prepare their first realistic Italian pilot strategy. The product turns a company's product description and available documentation into a practical Pilot Entry Package: the best Italian buyer segment, the best warehouse process to pilot, the main trust gaps to close, a Target Account Shortlist of relevant Italian companies, and the sales materials needed to start a credible buyer conversation.

PilotOps AI is not intended to be a generic market report generator. The MVP focus is narrower: help a Head of International Expansion understand what to do next to sell a low-risk first pilot in the Italian warehouse/logistics market.

## Current Repository State

This repository is still in early MVP setup.

At this stage it contains product documentation, market/technical analysis, team setup planning, seed data, a structured output schema, and a frontend scaffold. The AI endpoint and full backend integration are still pending.

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
- Target Account Shortlist from a curated target-account database;
- sales pack generation;
- Pilot Control Room dashboard.

The MVP should not attempt to:

- cover every European market;
- certify legal or compliance readiness;
- guarantee real sales leads;
- build a full CRM;
- scrape the web at scale;
- collect private personal contact data or personal decision-maker emails;
- behave as a plain chatbot;
- produce only a generic consulting report.

## Planned Technical Direction

The product spec and technical analysis currently point toward:

- Frontend: Next.js, React, TypeScript, Tailwind CSS.
- UI: dashboard-oriented Pilot Control Room, with shadcn/ui or equivalent components planned.
- Backend/API layer: Next.js API routes or server actions are expected, but the AI analysis endpoint is not implemented yet.
- AI layer: OpenAI Responses API with structured outputs is the preferred direction.
- Data layer: local JSON seed datasets for the MVP, with `data/italian_target_accounts.json` planned for the Target Account Shortlist and optional document ingestion later.

Some frontend dependencies and scripts are present; AI/API integration remains planned.

## Install Dependencies

Application dependencies are defined in `package.json` when the frontend scaffold is present.

Expected setup:

```bash
npm install
```

Use the exact command from `package.json`.

## Run the App

Use the package scripts when the local dependency install is available.

Expected local command:

```bash
npm run dev
```

The app currently relies on mock/frontend data until the AI endpoint is connected.

## Environment Variables

No environment variables are required for documentation review or local mock UI work.

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
