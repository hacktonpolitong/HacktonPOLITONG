# Demo Plan

## Purpose

This document defines how PilotOps AI will be demonstrated during the hackathon as a live MVP.

The demo must prove that PilotOps AI is more than a static presentation or clickable mockup: it should show a working web app that turns a Chinese warehouse automation product into a localized, low-risk Italian pilot package.

The priority is to deliver a stable, credible, and testable live link. Real-time AI generation is valuable, but the MVP should still behave like a functional product without it by using a small deterministic analysis engine, local seed datasets, and structured output rendering.

## Demo Goal

The demo should help judges understand three things quickly:

1. The user is a Chinese warehouse automation vendor preparing Italian market entry.
2. The product does not generate a generic market report.
3. The output is a practical Pilot Control Room with buyer segment, pilot process, trust gaps, pilot offer, proof checklist, sales pack, and next actions.

The core message is:

> PilotOps AI turns a Chinese warehouse automation product into a localized, low-risk Italian pilot package.

## Live MVP Strategy

The recommended demo structure is:

```text
Vercel live link
        -> Next.js web app
        -> interactive intake flow
        -> analysis loading state
        -> server-side analysis route with deterministic seed-data fallback
        -> Pilot Control Room rendered from structured analysis output
        -> optional live AI generation when API keys and connectivity are reliable
```

This keeps the demo usable even if external AI APIs are slow, unavailable, rate-limited, or not configured, while still satisfying the requirement that the deliverable is a functional product rather than a mockup.

## Functional MVP Requirement

The submitted hackathon deliverable should be treated as a working MVP, not a mockup.

Minimum requirement:

- the app is deployed at a public live URL;
- the user can click through the full flow;
- the intake step shows a prefilled product/company profile and allows the presenter to rename the demo vendor without invalidating the AMR scenario;
- the analysis result is generated through `POST /api/analyze`, with a deterministic AMR/3PL fallback when no live AI key is configured;
- the dashboard remains coherent with the locked AMR/3PL demo scenario and renders a complete structured Pilot Control Room;
- the result uses the structured Pilot Control Room schema;
- the app can be tested by judges without private credentials;
- any AI API integration is server-side and optional for the default test path.

The MVP does not need to be a production-grade market intelligence system. It does need to behave like a real first version of the product.

## Hosting Plan

The MVP should be deployed on Vercel.

Expected deployment flow:

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Let Vercel detect the Next.js app.
4. Use `npm run build` as the build command.
5. Use the generated Vercel URL as the live MVP link.

The live URL should be shared with judges and included in the presentation materials.

## Demo Modes

### Mode 1: Stable Functional MVP Mode

Stable functional MVP mode is the default mode for the presentation and judge testing.

Behavior:

- the app loads from the public Vercel link;
- the user can start a pilot analysis;
- the intake screen is prefilled for speed and keeps the AMR/3PL scenario locked for demo consistency;
- the app shows an AI-style analysis loading state;
- the app calls `POST /api/analyze`, which returns the deterministic AMR/3PL analysis when no live AI key is configured;
- the Pilot Control Room appears with structured output generated from the fallback analysis or a validated live AI response;
- no external AI API call is required.

Why this matters:

- no API cost is required;
- the demo works even with weak internet;
- judges can test the full flow without private credentials;
- the output remains aligned with the product spec.

### Mode 2: Optional Live AI Mode

Optional live AI mode can be shown only if the API integration is ready and stable.

Behavior:

- the app sends intake data to a server-side API route or server action;
- the server calls the selected AI provider using environment variables;
- the provider returns structured pilot analysis JSON;
- the dashboard renders the generated result;
- if the API fails, the app falls back to the stable local MVP analysis.

This mode should never expose API keys in frontend code.

Expected environment variables, if live AI is enabled:

```text
OPENROUTER_API_KEY
OPENROUTER_FALLBACK_API_KEY
OPENROUTER_MODEL
OPENROUTER_SITE_URL
OPENROUTER_APP_NAME
```

Only the variables needed by the implemented provider should be configured.

## Demo Scenario

The primary scenario should use the existing AMR-focused product story.

Chinese vendor:

- a warehouse automation company selling AMR robots;
- product focus: autonomous internal warehouse transport;
- target market: Italy;
- available proof: product specs, Chinese case studies, partial CE/safety summary;
- missing proof: Italian case study, local maintenance model, localized ROI argument.

Expected output:

- best buyer segment: mid-size Italian 3PL or e-commerce fulfilment warehouses;
- best pilot process: internal transport between picking and packing;
- main trust gaps: local support, Italian reference, WMS integration clarity, ROI localization;
- recommended pilot: 45-day limited pilot with 2 AMRs and measurable KPIs;
- sales assets: outreach email, pilot one-pager, objection battlecard, proof checklist, next 7 days plan.

## User Journey

### Step 1: Start Screen

The user lands on the live MVP link and sees a clear product promise.

Expected action:

- click the primary action to start the pilot analysis.

The screen should make clear that the app creates a first Italian pilot strategy, not a generic report.

### Step 2: Product Intake

The user enters or reviews the Chinese vendor profile.

Recommended fields:

- company name;
- product category;
- product description;
- current proof available;
- documentation status;
- target market;
- pilot ambition;
- known constraints.

For the live presentation, this step should be fast. The demo uses prefilled data so the presenter does not spend time typing. The company name can be edited, while the product category, proof inputs, and constraints remain locked so the deterministic AMR/3PL fallback stays coherent.

### Step 3: Documentation Readiness Signals

The Product Intake and Pilot Control Room show what proof an Italian buyer will probably expect. This is not a separate screen in the current MVP.

Expected checklist categories:

- technical specifications;
- CE or safety documentation summary;
- installation requirements;
- maintenance and support plan;
- WMS or IT integration information;
- case study evidence;
- ROI evidence;
- warranty or failure response;
- pilot exit conditions.

This step helps judges see that PilotOps AI handles trust and buyer risk, not only marketing copy.

### Step 4: Analysis Loading

The app shows a short analysis sequence.

Suggested modules:

- parsing product fit;
- matching Italian buyer segment;
- selecting warehouse pilot process;
- ranking target account shortlist;
- identifying trust gaps;
- generating pilot offer;
- preparing sales pack.

The loading state should be long enough to feel intentional, but short enough to keep the demo moving.

### Step 5: Pilot Control Room

The dashboard is the main proof of value.

Required sections:

- Pilot Fit Score;
- Best First Buyer Segment;
- Best Warehouse Process;
- Why Now;
- Trust Gap Analysis;
- Recommended Pilot Offer;
- Target Account Shortlist;
- Buyer Objection Battlecard;
- Documentation / Proof Checklist;
- Ready-to-Send Sales Pack;
- Next 7 Days Action Plan.

The presenter should highlight that the output is structured, specific, and immediately actionable.

## Minimum Product Logic

To avoid looking like a mockup, the MVP should include a small but real analysis layer.

Recommended local logic:

1. Classify the product category from the intake selection or text keywords.
2. Match the category to a buyer segment from `data/italian_segments.json`.
3. Select a warehouse process from `data/warehouse_processes.json`.
4. Score pilot fit based on product category, proof availability, integration complexity, and support readiness.
5. Select trust gaps from `data/trust_gaps.json` based on missing or partial proof.
6. Build the proof checklist from `data/proof_checklist.json`.
7. Generate a pilot offer from templates and selected process data.
8. Generate sales pack text from the selected segment, process, and trust gaps.
9. Return a structured object matching `schemas/pilot_analysis.schema.json`.

This can be deterministic and lightweight. The key is that the user input drives the output.

Current visible behavior:

- the app always routes through `POST /api/analyze`;
- without OpenRouter keys, the route returns a stable deterministic AMR/3PL Pilot Control Room;
- with valid OpenRouter keys, the route attempts live AI generation and validates the response before rendering it;
- if live AI fails, times out, or returns unsafe/invalid content, the deterministic Pilot Control Room is shown.

## Presentation Script

Suggested 2-minute flow:

1. Open the Vercel live link.
2. Explain the user: a Chinese AMR vendor wants to enter Italy.
3. Click start analysis.
4. Show the prefilled intake data.
5. Submit the analysis.
6. Let the loading screen show the AI workflow modules.
7. Open the Pilot Control Room.
8. Highlight the recommended buyer segment.
9. Highlight the recommended warehouse process.
10. Highlight the trust gaps and recommended fixes.
11. Open the pilot offer and explain why it is low risk for the Italian buyer.
12. Open the sales pack and buyer objection battlecard.
13. Close with: "This is not a market report. It is a first-pilot entry strategy."

## Judge Testing Path

Judges should be able to test the live link without needing private API keys.

Minimum testable path:

1. Open the live URL.
2. Start the analysis.
3. Review or edit demo input.
4. Submit.
5. Reach the Pilot Control Room.
6. Inspect the recommendation sections.
7. Inspect the Target Account Shortlist and confirm it is described as curated company-level data, not scraped leads.
8. Confirm the dashboard renders without private credentials.

If live AI is enabled, judges may optionally test a new input. The app should still show a clear result if the AI call fails.

## Reliability Requirements

The demo should be designed around reliability first.

Required safeguards:

- keep a stable local analysis fallback available;
- avoid requiring API keys for the main judge path;
- never expose keys with `NEXT_PUBLIC_` variables;
- test the Vercel URL before the presentation;
- test the same URL on a second device or browser;
- keep a local fallback ready with `npm run dev`;
- avoid introducing features that require paid services unless they improve the demo materially.

## API Cost Position

The live MVP link does not require AI API spending by itself.

Costs are only introduced if the app performs real AI calls through OpenRouter.

Recommended approach:

- use local deterministic analysis for the default demo;
- use live AI only as an optional enhancement through server-side OpenRouter keys;
- set spending or usage limits on any API key used for the hackathon;
- create a dedicated demo API key when possible;
- revoke or rotate shared demo keys after the event.

## Success Criteria

The demo is successful when:

- the Vercel link opens reliably;
- the main flow can be completed by a judge;
- the prefilled intake keeps the AMR/3PL demo scenario coherent;
- output is generated through the analysis route and remains usable without API keys;
- live AI, when configured, is optional and falls back safely;
- the output clearly matches the AMR-to-Italy use case;
- the dashboard feels like a control room, not a static slide;
- the result contains concrete buyer, process, trust, pilot, proof, and sales recommendations;
- the app remains usable without external AI calls;
- optional live AI does not break the default flow.

## Pre-Presentation Checklist

Before presenting:

1. Run `npm run lint` if available and expected to pass.
2. Run `npm run build`.
3. Deploy to Vercel.
4. Open the production Vercel URL.
5. Complete the demo flow once from start to dashboard.
6. Verify that no API key is committed to Git.
7. Verify that required environment variables are configured only in Vercel if live AI is used.
8. Test the link from a different browser or device.
9. Prepare the local fallback with `npm run dev`.
10. Keep the demo AMR scenario ready for the spoken pitch.

## Open Decisions

The team still needs to decide:

- whether the presentation should show live AI mode or only the stable deterministic path;
- which OpenRouter model should be used if live AI is shown;
- how many product categories the local MVP analysis should support beyond the demo AMR profile;
- whether to expose copy/export actions in the first live MVP;
- whether to include source citations in the Pilot Control Room;
- whether the live URL should use the default Vercel domain or a custom project name.
