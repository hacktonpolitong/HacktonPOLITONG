# PilotOps AI

PilotOps AI is a B2B AI-powered web application for the Shanghai International Hackathon 2026.

It helps Chinese warehouse automation companies prepare their first realistic Italian pilot strategy. The product turns a company's product description and available documentation into a practical Pilot Entry Package: the best Italian buyer segment, the best warehouse process to pilot, the main trust gaps to close, a Target Account Shortlist of relevant Italian companies, and the sales materials needed to start a credible buyer conversation.

PilotOps AI is not intended to be a generic market report generator. The MVP focus is narrower: help a Head of International Expansion understand what to do next to sell a low-risk first pilot in the Italian warehouse/logistics market.

## Current Repository State

This repository contains the hackathon MVP for PilotOps AI:

- a Next.js, React, TypeScript, and Tailwind frontend;
- a prefilled demo intake for the AMR-to-Italy scenario;
- a server-side `POST /api/analyze` route;
- a deterministic local market-entry decision engine that requires no API key;
- optional live AI generation through OpenRouter when server-side environment variables are configured;
- local seed datasets, including a curated Italian Target Account Shortlist dataset;
- the structured Pilot Control Room schema and supporting docs.

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

## Implemented Technical Path

- Frontend: Next.js, React, TypeScript, and Tailwind CSS.
- UI: dashboard-oriented Pilot Control Room with local component primitives.
- Backend/API layer: `POST /api/analyze` implemented as a Next.js route.
- Default analysis path: deterministic local market-entry engine built from the submitted profile, pasted evidence, and seed data.
- Optional live AI path: OpenRouter chat completions, server-side only, with response validation and fallback to the deterministic local engine.
- Data layer: local JSON seed datasets, including `data/italian_target_accounts.json` for the Target Account Shortlist.

## Install Dependencies

Install the dependencies defined in `package.json`:

```bash
npm install
```

## Run the App

Start the local development server:

```bash
npm run dev
```

Build the production bundle:

```bash
npm run build
```

Run lint checks:

```bash
npm run lint
```

## Default Stable Demo Path

No environment variables are required for the default demo.

The stable path is:

1. Open the app.
2. Click `Open Demo Flow` or `Start Analysis`.
3. Review the prefilled `Product Intake` screen for the fictional Chinese AMR vendor.
4. Click `Run Pilot Analysis`.
5. Wait for the `Building the Pilot Control Room` loading state.
6. Review the `Pilot Control Room`: Pilot Fit Score, Best First Buyer Segment, Best Warehouse Process, Why Now, Trust Gap Analysis, Recommended Pilot Offer, Target Account Shortlist, Buyer Objection Battlecard, Documentation Checklist, Sales Pack, and Next 7 Days Action Plan.

The default path uses the server-side analysis route and the deterministic market-entry engine when no OpenRouter key is configured.

## Optional Live AI Path

Live AI mode is implemented as an optional server-side enhancement through OpenRouter.

If `OPENROUTER_API_KEY` is configured, `POST /api/analyze` attempts to generate a structured Pilot Control Room response with OpenRouter. The server validates the response and falls back to the deterministic local market-entry result if the provider fails, times out, returns invalid JSON, or produces unsafe content.

The route accepts `profile` plus optional `evidence_inputs`. It returns the standard Pilot Control Room sections plus `product_evidence_profile` and `segment_scorecards` for the decision matrix. Target accounts always come from the curated local dataset; the app does not scrape, collect personal contacts, guarantee buyers, or certify compliance.

The frontend never requires a key for the demo path.

## Environment Variables

No environment variables are required to run the default demo.

Optional server-side variables for live AI mode:

- `OPENROUTER_API_KEY` (optional): primary OpenRouter API key for live AI generation.
- `OPENROUTER_FALLBACK_API_KEY` (optional): secondary OpenRouter key used if the primary key fails with an eligible error.
- `OPENROUTER_MODEL` (optional): model override. If omitted, the app uses the default model from `src/lib/openrouter-client.ts`.
- `OPENROUTER_SITE_URL` (optional): sent as the OpenRouter HTTP referer header.
- `OPENROUTER_APP_NAME` (optional): sent as the OpenRouter app title header.

Do not add API keys to the repository. Use a local `.env.local` file or Vercel environment variables.

## Vercel Deployment

The MVP is intended to run on Vercel as a standard Next.js app.

- Build command: `npm run build`.
- No environment variables are required for the default demo path.
- Add the optional OpenRouter variables in Vercel only if the team wants to demo live AI mode.

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
