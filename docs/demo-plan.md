# Demo Plan

## Purpose

This document defines how PilotOps AI will be demonstrated during the hackathon as a live MVP.

The demo must prove that PilotOps AI is more than a static presentation: it should show a working web app that turns a Chinese warehouse automation product into a localized, low-risk Italian pilot package.

The priority is to deliver a stable, credible, and testable live link. Real-time AI generation is valuable, but it should not be required for the core demo to work.

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
        -> Pilot Control Room rendered from structured demo data
        -> optional AI generation when API keys and connectivity are reliable
```

This keeps the demo usable even if external AI APIs are slow, unavailable, rate-limited, or not configured.

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

### Mode 1: Stable Demo Mode

Stable demo mode is the default mode for the presentation.

Behavior:

- the app loads from the public Vercel link;
- the user can start a pilot analysis;
- the intake screen is prefilled or can be quickly filled with the demo AMR profile;
- the app shows an AI-style analysis loading state;
- the Pilot Control Room appears with realistic structured output;
- no external AI API call is required.

Why this matters:

- no API cost is required;
- the demo works even with weak internet;
- judges can still test the flow;
- the output remains aligned with the product spec.

### Mode 2: Optional Live AI Mode

Optional live AI mode can be shown only if the API integration is ready and stable.

Behavior:

- the app sends intake data to a server-side API route or server action;
- the server calls the selected AI provider using environment variables;
- the provider returns structured pilot analysis JSON;
- the dashboard renders the generated result;
- if the API fails, the app falls back to the stable demo result.

This mode should never expose API keys in frontend code.

Expected environment variables, if live AI is enabled:

```text
OPENAI_API_KEY
OPENAI_MODEL
ORBIT_API_KEY
ORBIT_BASE_URL
ORBIT_MODEL
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

For the live presentation, this step should be fast. The demo can use prefilled data so the presenter does not spend time typing.

### Step 3: Documentation Readiness

The app shows what proof an Italian buyer will probably expect.

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
- Buyer Objection Battlecard;
- Documentation / Proof Checklist;
- Ready-to-Send Sales Pack;
- Next 7 Days Action Plan.

The presenter should highlight that the output is structured, specific, and immediately actionable.

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

If live AI is enabled, judges may optionally test a new input. The app should still show a clear result if the AI call fails.

## Reliability Requirements

The demo should be designed around reliability first.

Required safeguards:

- keep a stable mock result available;
- avoid requiring API keys for the main judge path;
- never expose keys with `NEXT_PUBLIC_` variables;
- test the Vercel URL before the presentation;
- test the same URL on a second device or browser;
- keep a local fallback ready with `npm run dev`;
- avoid introducing features that require paid services unless they improve the demo materially.

## API Cost Position

The live MVP link does not require AI API spending by itself.

Costs are only introduced if the app performs real AI calls through Orbit AI, OpenAI, or another provider.

Recommended approach:

- use mock data for the default demo;
- use live AI only as an optional enhancement;
- set spending or usage limits on any API key used for the hackathon;
- create a dedicated demo API key when possible;
- revoke or rotate shared demo keys after the event.

## Success Criteria

The demo is successful when:

- the Vercel link opens reliably;
- the main flow can be completed by a judge;
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

- whether the submitted hackathon version will include live AI generation;
- which provider will power live AI if enabled;
- whether judges can edit only the demo AMR profile or submit entirely new products;
- whether to expose copy/export actions in the first live MVP;
- whether to include source citations in the Pilot Control Room;
- whether the live URL should use the default Vercel domain or a custom project name.
