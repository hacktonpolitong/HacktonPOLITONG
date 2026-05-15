# Implementation Task Split

## 1. Current Repo Reality Check

Current `main` reality, verified from the local repository at commit `a618f9b`:

- PR #5 is merged. `git log --oneline` shows `a618f9b feat(jacopo/data): populate JSON seed files from data sourcing research (#5)` at the tip of `main`.
- The repository contains product, architecture, AI pipeline, data model, testing/eval, UI, team setup, and demo documentation in `README.md`, `AGENTS.md`, `pilotops_ai_product_spec.md`, `pilotops_ai_market_tech_analysis.md`, and `docs/`.
- The app scaffold exists in `src/` with Next.js App Router files under `src/app/`, screen components under `src/components/screens/`, dashboard/UI components under `src/components/dashboard/` and `src/components/ui/`, and mock/frontend data under `src/lib/`.
- `package.json` exposes only `npm run dev`, `npm run build`, and `npm run lint`. There are no test, schema validation, eval, or deployment scripts.
- `npm run lint` passes.
- `npm run build` passes and produces a static `/` route.
- Jacopo's seed data normalization work should be treated as complete for hackathon purposes. The data folder contains `data/demo_amr_profile.json`, `data/italian_segments.json`, `data/warehouse_processes.json`, `data/trust_gaps.json`, `data/proof_checklist.json`, and `data/italian_target_accounts.json`.
- `data/italian_target_accounts.json` exists and contains 30 curated company records with public company-level fields: `company_name`, `website`, `hq_region`, `logistics_category`, `warehouse_signals`, `likely_process_fit`, `recommended_buyer_roles`, `outreach_angle`, and `source_note`.
- `schemas/pilot_analysis.schema.json` exists and defines the structured Pilot Control Room output. It includes `metadata`, product summary, buyer segment, warehouse process, trust gaps, pilot offer, target account shortlist, objection battlecard, proof checklist, next 7 days plan, and sales pack. In the current schema, `target_account_shortlist` exists as a property but is not in the top-level `required` array.
- The current app supports the broad PilotOps AI story visually: `StartScreen` has the product promise, `IntakeScreen` shows a demo AMR profile, `AnalysisLoadingScreen` simulates engine modules, and `ControlRoomScreen` renders buyer segment, process, trust gaps, pilot offer, objections, proof checklist, sales pack, and next actions.
- The current app does not yet deliver a convincing AI-powered live MVP. `src/components/pilot-ops-app.tsx` uses client state and a 1.5 second timeout to move from analysis loading to `mockPilotAnalysis`; no real analysis endpoint is called.
- There are no API routes, server actions, `src/app/api/`, `route.ts`, `use server` actions, or analysis endpoint files.
- There is no OpenAI/Orbit implementation. `package.json` has no OpenAI SDK dependency, and `README.md` still describes AI/API integration as planned.
- There is no `.env.example`. Environment variables are documented only as future/planned items in `README.md` and `docs/demo-plan.md`.
- The default demo path currently works without API keys because it is fully mock-driven.
- The product intake is not a real editable intake yet. `src/components/screens/intake-screen.tsx` renders read-only fields from `demoProductProfile`.
- The documentation readiness checklist exists only as part of the final dashboard. There is no separate readiness screen between intake and analysis.
- `src/lib/mock-pilot-analysis.ts` and `src/lib/pilot-analysis-types.ts` are not aligned with the current schema and PR #5 data shape. The frontend type includes `why_now`, while the schema has no `why_now` property. The frontend type and mock do not include `metadata` or `target_account_shortlist`.
- Target Account Shortlist is documented and seeded but not rendered in the current dashboard. `ControlRoomScreen` has no target account section.
- Some docs are stale after PR #5. `docs/data-model.md` knows about the target-account dataset, but `README.md`, `docs/architecture.md`, and `docs/code-map.md` still contain planned/incomplete language for `data/italian_target_accounts.json`.
- Deployment guidance exists in `docs/demo-plan.md`, but README demo/deployment instructions are still minimal and do not yet describe the final hackathon demo path.

What appears complete enough for the MVP:

- Product focus and non-goals are clear.
- Seed data is good enough for a deterministic fallback.
- Demo AMR scenario exists.
- Frontend scaffold builds and already communicates a control-room style.
- Core dashboard components are small and reusable.
- Stable mock path exists and can be preserved as the no-key fallback.

What is incomplete:

- No backend/API analysis route.
- No server-side AI call.
- No deterministic local analysis assembler from seed data.
- No safe API failure fallback wired into the flow.
- No schema-aligned frontend contract.
- No Target Account Shortlist rendering.
- No editable intake.
- No README instructions for the final demo/deployment path.
- No validation/eval script.
- No final video/deck readiness checklist in the runnable docs.

What is documented but not implemented:

- AI endpoint and backend integration in `README.md` and `docs/architecture.md`.
- Structured pipeline execution in `docs/ai-pipeline.md`.
- Separate documentation readiness step in `docs/architecture.md` and `docs/demo-plan.md`.
- Target Account Shortlist rendering in `docs/ui-system.md`.
- Validation/eval commands in `docs/testing-and-evals.md`.
- Optional live AI mode in `docs/demo-plan.md`.

What blocks a convincing live demo:

- The dashboard still announces itself as mock output.
- There is no visible Target Account Shortlist.
- The analysis is not triggered through any API/server pathway.
- The user cannot edit the intake.
- The fallback is not formally wired as an API fallback; it is only the whole app path.
- README does not yet tell judges/team how to run or deploy the final demo.

What can be ignored if time is short:

- File upload and document ingestion.
- Web search, citations, and live market research.
- CRM, export/download, auth, persistence, database, and outreach sending.
- Complex eval suite.
- Full schema validation script if manual JSON review is faster.
- Recharts or additional chart libraries.
- Perfect data-model/docs cleanup outside the final README and demo-critical notes.

Whether the app currently supports the PilotOps AI story:

- Yes, as a clickable mock demo.
- Not yet, as an AI-centered MVP. The current app demonstrates the concept but does not yet prove the engine.

Obvious technical risks:

- Schema, frontend type, mock data, and seed data shapes are drifting.
- If live AI is added without a deterministic fallback, the demo can fail due to missing keys, rate limits, or network issues.
- If teams edit `src/lib/pilot-analysis-types.ts`, `src/lib/mock-pilot-analysis.ts`, and `src/components/screens/control-room-screen.tsx` in parallel without coordination, merge conflicts are likely.
- `docs/code-map.md` and `README.md` are stale after PR #5, which can confuse implementation agents.
- The current branch observed for this planning work was not named `main`, but its HEAD matched local `main`. The working tree also had a pre-existing `.gitignore` modification outside this task.

## 2. MVP Gap Analysis

| Capability | Current status | Gap | Priority | Suggested owner |
|---|---|---|---|---|
| start screen / clear product promise | Implemented in `src/components/screens/start-screen.tsx` and aligned with PilotOps AI positioning. | Needs small copy polish only if demo script needs tighter wording. | P2 | Matteo |
| product intake flow | Implemented as read-only demo review in `src/components/screens/intake-screen.tsx`. | Needs editable fields or at least a convincing prefilled form with submit state. | P0 | Matteo |
| documentation readiness checklist | Rendered only inside final dashboard from mock proof checklist. | Needs a visible readiness moment before or during analysis, or a clearly labeled dashboard section if time is short. | P1 | Matteo |
| AI-style analysis flow | Implemented as timed loading screen. | Add target-account ranking module and connect to actual API/fallback result state. | P1 | Matteo |
| structured analysis result | Schema exists; mock result exists. | Mock/frontend type does not match current schema or seed data shape. | P0 | Francesco |
| API route or server action for analysis | Not implemented. No `src/app/api` or server action exists. | Need `POST /api/analyze` or server action with fallback-first behavior. | P0 | Francesco |
| safe fallback to demo result | Exists only as direct frontend mock path. | Need server/client fallback that returns demo result when no API key or AI call fails. | P0 | Francesco |
| schema-aligned Pilot Control Room output | Schema exists; UI consumes a different `PilotAnalysis` shape. | Align shared type/mock/result with schema or choose a documented demo contract and keep it consistent. | P0 | Francesco |
| buyer segment recommendation | Rendered from mock data. | Needs to come from API/fallback result and use seed-consistent IDs/names. | P0 | Francesco |
| warehouse process recommendation | Rendered from mock data. | Needs seed-consistent process IDs after PR #5, for example `internal_transport` rather than the old `internal_transport_picking_to_packing`. | P0 | Francesco |
| trust gap analysis | Rendered from mock data. | Needs seed-consistent IDs and enough buyer-specific language for demo. | P1 | Francesco |
| pilot offer | Rendered from mock data. | Needs to be generated/assembled by fallback/API and remain bounded to 45-day AMR pilot. | P1 | Francesco |
| objection battlecard | Rendered from mock data. | Needs to stay concrete and visible; can remain fallback-generated for demo. | P1 | Francesco |
| proof checklist | Rendered from mock data. | Needs proof IDs/statuses aligned with `data/proof_checklist.json`. | P1 | Francesco |
| Target Account Shortlist | Seed data exists in `data/italian_target_accounts.json`; schema has property. | Not in frontend type, not in mock, not rendered in dashboard. | P0 | Matteo |
| sales pack | Rendered as asset summaries, not full content. | Needs clearer ready-to-send value, at least subject/body preview or copy-ready blocks. | P1 | Matteo |
| next 7 days action plan | Rendered from mock data. | Needs 7-day shape or acceptable 5-day demo plan; should be consistent with schema max 7. | P2 | Francesco |
| demo AMR scenario | Exists in `data/demo_amr_profile.json` and separate frontend mock. | Frontend mock uses old company/product names, not PR #5 demo profile. Decide whether to keep polished fictional UI copy or align to data. | P1 | Jacopo |
| live deployment readiness | `npm run build` passes; Vercel plan documented in `docs/demo-plan.md`. | README lacks final demo/deployment steps; no live URL checklist. | P1 | Jacopo |
| README demo instructions | README still says AI endpoint pending and target accounts planned. | Update after implementation to describe stable demo mode, optional AI mode, env vars, and run/deploy steps honestly. | P1 | Jacopo |
| 1 to 1.5 minute video readiness | `docs/demo-plan.md` has a 2-minute script, not final 1 to 1.5 minute checklist. | Need concise recording script tied to actual implemented screens. | P1 | Jacopo |
| pitch deck readiness | Not implemented as files. Product narrative exists in docs. | Need max 10-slide checklist and content ownership; deck itself can live outside repo if time is short. | P2 | Jacopo |

Priority key:

- P0 = blocking for demo.
- P1 = must-have for convincing demo.
- P2 = polish.
- P3 = only if time remains.

## 3. Dependency Graph

| Task ID | Task | Owner | Priority | Depends on | Can run in parallel with | Risk | Fallback |
|---|---|---|---|---|---|---|---|
| F1 | Define final app-facing `PilotAnalysis` contract and align mock/fallback result with PR #5 seed IDs and schema fields. | Francesco | P0 | None | M1, M2, J1 | Touches shared `src/lib` files used by UI. | Keep old mock fields plus add missing fields to avoid breaking current UI. |
| F2 | Build deterministic local analysis assembler from `data/demo_amr_profile.json`, `data/italian_segments.json`, `data/warehouse_processes.json`, `data/trust_gaps.json`, `data/proof_checklist.json`, and `data/italian_target_accounts.json`. | Francesco | P0 | F1 | M1, J1 | Overengineering can burn time. | Hard-code the demo AMR result while sourcing shortlist from target accounts. |
| F3 | Add `POST /api/analyze` route returning fallback result by default and optional live AI only when env vars are present. | Francesco | P0 | F1, F2 | M2, J2 | Live AI may fail or require package changes. | No live AI; route always returns deterministic fallback with `mode: "fallback"`. |
| F4 | Add safe client/API error behavior contract: no API key, bad response, or timeout still returns the demo result. | Francesco | P0 | F3 | M3 | Failure state may leak to judges. | Client catches failures and switches to imported fallback mock. |
| F5 | Document env variable behavior in PR summary for Jacopo to copy into README. | Francesco | P1 | F3 | J2 | Docs drift. | State "no env required for default demo." |
| M1 | Make intake feel real: editable prefilled fields, clear target market fixed to Italy, fast submit. | Matteo | P0 | None | F1, F2, J1 | Form state conflicts with API wiring if both edit `pilot-ops-app.tsx`. | Keep data local in `IntakeScreen`; pass the same shape through callback later. |
| M2 | Polish loading flow and include target-account ranking module. | Matteo | P1 | None | F1, F2, J1 | Loading can feel fake if too short. | Keep timed sequence but label modules as structured engine steps. |
| M3 | Connect frontend flow to `/api/analyze`, preserve no-key fallback, and remove "Mock output" messaging from dashboard. | Matteo | P0 | F3 | J2 | Merge conflict in `pilot-ops-app.tsx` with Francesco if not coordinated. | If F3 is not merged, keep client mock path and improve wording. |
| M4 | Render Target Account Shortlist in `ControlRoomScreen` using compact rows/cards with company, region, category, process fit, roles, outreach angle, and source note. | Matteo | P0 | F1 | J1, J2 | Type mismatch if F1 not merged. | Use a narrow local type matching `data/italian_target_accounts.json`. |
| M5 | Improve dashboard scanability for video: first viewport shows fit score, segment, process, and next scroll reveals shortlist/trust gaps. | Matteo | P1 | M4 | J2 | Polish can expand scope. | Only adjust section order and headings. |
| J1 | QA PR #5 integration: compare seed data IDs/labels against fallback result, UI copy, and schema without changing data files unless a true blocker exists. | Jacopo | P1 | None | F1, M1, M2 | Duplicate data normalization work. | File issues or patch only small copy/ID mismatches after agreement. |
| J2 | Update README/demo instructions after F and M branches land: stable demo mode, optional AI mode, Vercel deployment, no-key path, env vars if used. | Jacopo | P1 | F3, M3 | M4 | README can become aspirational. | Keep README honest: default path uses fallback, live AI optional. |
| J3 | Manual QA checklist: local build, no console errors, no exposed secrets, target shortlist visible, fallback without env, optional AI if present. | Jacopo | P0 | F3, M3, M4 | J2 | QA starts too late. | Test stable demo path first; optional AI is not blocking. |
| J4 | Prepare 1 to 1.5 minute demo video script and max 10-slide deck checklist in docs or issue notes. | Jacopo | P1 | M5 | F5 | Video script may not match final UI. | Use final screen names and stable fallback only. |
| J5 | Safe bugfix pass after merge, limited to docs wording, console/build warnings, and obvious demo blockers. | Jacopo | P1 | F and M PRs merged | None | Last-minute broad edits. | Only patch bugs that break demo or misstate product. |

## 4. Final Team Split

### Francesco

Mission:

Own the analysis route and result contract so the MVP has an AI-centered architecture with a reliable no-key fallback. The demo must never depend on external AI to work.

Branch name:

`feature/francesco-analysis-api`

Exact tasks:

1. Inspect first:
   - `schemas/pilot_analysis.schema.json`
   - `docs/ai-pipeline.md`
   - `docs/data-model.md`
   - `data/demo_amr_profile.json`
   - `data/italian_segments.json`
   - `data/warehouse_processes.json`
   - `data/trust_gaps.json`
   - `data/proof_checklist.json`
   - `data/italian_target_accounts.json`
   - `src/lib/pilot-analysis-types.ts`
   - `src/lib/mock-pilot-analysis.ts`
   - `src/components/pilot-ops-app.tsx`
2. Align `PilotAnalysis` with the actual result the dashboard will consume.
3. Add a deterministic fallback analysis result that includes:
   - metadata;
   - product summary;
   - buyer segment recommendation;
   - warehouse process recommendation;
   - trust gaps;
   - pilot offer;
   - objection battlecard;
   - proof checklist;
   - target account shortlist from curated seed data;
   - sales pack;
   - next 7 days action plan.
4. Add `POST /api/analyze` as a Next.js route.
5. Make the route return the deterministic fallback when:
   - no AI environment variables are present;
   - the request is malformed but recoverable;
   - the optional AI call fails;
   - the optional AI response is not usable.
6. Optional only if safe: add live AI using server-side env vars and native `fetch`, without exposing keys or making the demo depend on the call.
7. Keep the output English, Italy-specific, and focused on the first pilot package.

Files/folders likely touched:

- `src/app/api/analyze/route.ts`
- `src/lib/pilot-analysis-types.ts`
- `src/lib/mock-pilot-analysis.ts`
- Optional new helper files under `src/lib/`, such as `analysis-fallback.ts`, `analysis-engine.ts`, or `target-account-ranking.ts`

Files/folders to avoid:

- `data/`
- `schemas/`
- `package.json` and `package-lock.json`, unless the team explicitly accepts a dependency change
- UI layout files owned by Matteo, except for a minimal integration contract if needed
- README/docs owned by Jacopo, except PR notes

Dependencies:

- Can start immediately.
- Coordinate with Matteo before changing prop names used by `ControlRoomScreen`.
- Jacopo should review seed ID/name consistency.

Acceptance criteria:

- `POST /api/analyze` exists and returns a complete fallback result with no env vars.
- Result includes at least 5 target accounts from `data/italian_target_accounts.json`.
- Result does not claim live scraping, guaranteed leads, legal compliance, or personal contacts.
- Default route behavior is deterministic and demo-safe.
- Optional live AI, if present, is server-side only and cannot break the fallback.
- `npm run lint` passes.
- `npm run build` passes.

Commands to run before PR:

```bash
git status --short
git diff --check
npm run lint
npm run build
```

Suggested PR title:

`feat: add demo-safe analysis API with structured fallback`

PR summary template:

```markdown
## What changed
- Added the analysis API route.
- Added/updated the schema-aligned fallback analysis result.
- Included target-account shortlist output from curated seed data.

## How to test
- Run `npm run lint`.
- Run `npm run build`.
- POST to `/api/analyze` or run the app flow if Matteo's branch is merged.

## Intentionally left out
- File upload.
- Live web research.
- CRM/outreach automation.
- Required API keys for the default demo.

## Fallback behavior
- No env vars required.
- AI/API failure returns the deterministic demo result.
```

Fallback if blocked:

- Skip live AI entirely.
- Add only a deterministic `POST /api/analyze` route.
- Keep the current frontend mock import available until Matteo wires the route.

### Matteo

Mission:

Make the app feel like a live, polished, judge-clickable PilotOps AI experience. The UI must show the Target Account Shortlist and remove obvious "mock-only" signals from the main demo path.

Branch name:

`feature/matteo-demo-flow-polish`

Exact tasks:

1. Inspect first:
   - `src/components/pilot-ops-app.tsx`
   - `src/components/screens/start-screen.tsx`
   - `src/components/screens/intake-screen.tsx`
   - `src/components/screens/analysis-loading-screen.tsx`
   - `src/components/screens/control-room-screen.tsx`
   - `src/components/dashboard/section-panel.tsx`
   - `src/components/dashboard/fit-score.tsx`
   - `src/components/dashboard/status-pill.tsx`
   - `src/components/ui/button.tsx`
   - `src/components/ui/badge.tsx`
   - `src/lib/pilot-analysis-types.ts`
   - `src/lib/mock-pilot-analysis.ts`
   - `docs/ui-system.md`
2. Make product intake editable while keeping the AMR demo prefilled.
3. Keep target market fixed to Italy in copy and UI.
4. Add visible documentation readiness before the analysis or make the existing checklist more prominent in the dashboard if time is too short.
5. Add target-account ranking to the loading modules.
6. Wire the submit flow to `/api/analyze` after Francesco's route lands.
7. Preserve stable fallback behavior in the client if the API request fails.
8. Render Target Account Shortlist in the Pilot Control Room.
9. Replace "Mock output" copy with demo-safe language such as "Structured pilot analysis generated from the current profile."
10. Improve dashboard order for video: fit score, segment, process, trust gaps, shortlist, pilot offer, sales pack, next actions.

Files/folders likely touched:

- `src/components/pilot-ops-app.tsx`
- `src/components/screens/start-screen.tsx`
- `src/components/screens/intake-screen.tsx`
- `src/components/screens/analysis-loading-screen.tsx`
- `src/components/screens/control-room-screen.tsx`
- `src/app/globals.css`, only for small layout fixes
- Existing dashboard/UI components only if needed

Files/folders to avoid:

- `data/`
- `schemas/`
- `package.json` and `package-lock.json`
- `src/app/api/`
- New UI libraries
- Broad visual redesigns

Dependencies:

- M1 and M2 can start immediately.
- API wiring depends on Francesco's `POST /api/analyze`.
- Shortlist rendering depends on the final `PilotAnalysis` type or a narrow local account type.

Acceptance criteria:

- A judge can open the app, review/edit the demo AMR intake, click analyze, watch the analysis flow, and reach the dashboard.
- Target Account Shortlist is visible and useful.
- Main demo path does not require API keys.
- If the API fails, the user still reaches a credible Pilot Control Room.
- UI remains English-only.
- No section suggests CRM, scraping, personal contacts, legal compliance certification, or guaranteed buyers.
- `npm run lint` passes.
- `npm run build` passes.

Commands to run before PR:

```bash
git status --short
git diff --check
npm run lint
npm run build
```

Suggested PR title:

`feat: polish demo flow and render target account shortlist`

PR summary template:

```markdown
## What changed
- Made the demo intake flow more interactive.
- Connected or prepared the analysis flow for `/api/analyze`.
- Added Target Account Shortlist rendering.
- Polished Pilot Control Room copy and section order.

## How to test
- Run `npm run lint`.
- Run `npm run build`.
- Complete the app flow from start screen to Pilot Control Room.

## Intentionally left out
- Auth.
- File upload.
- CRM/export automation.
- Full visual redesign.

## Screenshots
- Add start/intake/dashboard screenshots if time allows.
```

Fallback if blocked:

- If Francesco's API route is not merged, keep the client mock path but render the shortlist from the mock result.
- If editable intake takes too long, keep prefilled fields but make them look like form fields and submit cleanly.

### Jacopo

Mission:

Protect demo readiness after PR #5. Do not redo data normalization. Own integration QA, README/demo truthfulness, deployment readiness, and final presentation checklists.

Branch name:

`feature/jacopo-demo-readiness-qa`

Exact tasks:

1. Inspect first:
   - `README.md`
   - `docs/demo-plan.md`
   - `docs/code-map.md`
   - `docs/data-model.md`
   - `docs/testing-and-evals.md`
   - `data/demo_amr_profile.json`
   - `data/italian_target_accounts.json`
   - `schemas/pilot_analysis.schema.json`
   - Francesco's PR diff after it opens
   - Matteo's PR diff after it opens
2. Verify seed data and fallback output are consistent enough for the demo.
3. Check that Target Account Shortlist uses public company-level data only.
4. Update README only after implementation lands:
   - install/run commands;
   - default stable demo path;
   - optional live AI path if implemented;
   - env vars, clearly marked optional;
   - Vercel deployment notes;
   - no-key judge path.
5. Update `docs/code-map.md` only if needed to remove stale "target accounts planned" and "no target account dataset" language.
6. Prepare a 1 to 1.5 minute demo video script tied to the final UI.
7. Prepare a pitch deck checklist with max 10 slides.
8. Run manual QA after each merge and record blockers.

Files/folders likely touched:

- `README.md`
- `docs/code-map.md`
- `docs/demo-plan.md`, only if it needs final implemented-path corrections
- Optional small QA notes under `docs/`, if helpful

Files/folders to avoid:

- `data/`, unless a tiny source-note or typo bug blocks the demo
- `schemas/`
- `src/`, unless fixing an obvious demo-breaking bug after coordination
- `package.json` and `package-lock.json`, unless the team explicitly adds validation scripts

Dependencies:

- Can start QA immediately.
- README finalization should wait until Francesco and Matteo have merged enough implementation to document honestly.
- Video/deck script should wait until the final screen order is stable.

Acceptance criteria:

- README describes the actual app, not a planned app.
- README says the default demo path works without API keys.
- Optional AI env vars are clearly optional and server-side only.
- Stale docs do not contradict the final demo path.
- Manual QA confirms: build passes, demo path works, Target Account Shortlist visible, no exposed secrets, and no obvious console errors.
- Video script fits 1 to 1.5 minutes.
- Pitch deck checklist is max 10 slides.

Commands to run before PR:

```bash
git status --short
git diff --check
npm run lint
npm run build
```

Suggested PR title:

`docs: finalize demo readiness and deployment instructions`

PR summary template:

```markdown
## What changed
- Updated README/demo instructions to match the implemented MVP.
- Removed stale planned/incomplete wording where it contradicted the current app.
- Added final demo video and pitch deck readiness notes.

## How to test
- Run `npm run lint`.
- Run `npm run build`.
- Complete the stable demo path without env vars.

## Intentionally left out
- Data normalization changes.
- Schema changes.
- New application features.

## QA notes
- Stable demo path:
- Optional live AI path:
- Deployment readiness:
```

Fallback if blocked:

- If app implementation is still changing, keep README edits minimal and maintain a separate final QA checklist in the PR body.
- If deployment is not ready, document local demo fallback with `npm run dev`.

## 5. Merge and Review Order

Recommended merge order:

1. Merge Francesco's `feature/francesco-analysis-api` first.
2. Merge Matteo's `feature/matteo-demo-flow-polish` second.
3. Merge Jacopo's `feature/jacopo-demo-readiness-qa` third.
4. Allow a final tiny bugfix PR only for demo blockers.

Branches that can start immediately:

- Francesco can start F1/F2/F3 immediately.
- Matteo can start intake/loading/dashboard polish that does not depend on final API types.
- Jacopo can start QA against current docs/data and wait to finalize README until implementation lands.

Tasks that must wait:

- Matteo's API wiring should wait for Francesco's route or be kept behind a small integration patch.
- Jacopo's final README instructions should wait until the actual fallback/live AI behavior is known.
- Video recording should wait until Target Account Shortlist is visible and the stable demo path works.

Review ownership:

- Jacopo reviews Francesco's PR for data/schema/product consistency.
- Francesco reviews Matteo's PR for API/fallback integration and product scope.
- Matteo reviews Jacopo's README/demo docs for screen accuracy and demo clarity.

What to check during review:

1. App still builds.
2. Main demo path works.
3. Output matches the PilotOps AI product story.
4. AI/fallback behavior cannot break the demo.
5. No exposed secrets.
6. Docs and README stay honest.
7. Target Account Shortlist is not presented as scraped leads or guaranteed buyers.
8. No private personal contact data is introduced.
9. Product stays focused on Italy, warehouse automation, and first pilot packaging.

What should not block review:

- Missing live AI, as long as API/fallback architecture is honest and demo-safe.
- Missing file upload.
- Missing export/download.
- Minor visual polish.
- Perfect schema validation automation.
- Full 7-day plan if 5 actions are demo-clear and schema/type allows it.

What must be manually tested after each merge:

- `npm run lint`
- `npm run build`
- Open `/` locally.
- Start analysis from the start screen.
- Complete intake.
- Reach analysis loading.
- Reach Pilot Control Room.
- Confirm Target Account Shortlist is visible after Matteo's PR.
- Confirm no API key is required for default path after Francesco's PR.
- Confirm no browser console errors in the main flow before recording.

## 6. Parallel Work Protocol

Sync main:

```bash
git checkout main
git pull origin main
npm install
npm run lint
npm run build
```

Create branch:

```bash
git checkout -b <branch-name>
```

Before PR:

```bash
git status --short
git diff --check
npm run lint
npm run build
```

Update branch before PR if main changed:

```bash
git fetch origin
git rebase origin/main
```

When to rebase:

- Rebase before opening a PR if `main` changed.
- Rebase after a dependency branch merges, especially Matteo after Francesco's API branch.
- Rebase if a reviewer sees conflicts that are easier to solve on top of fresh `main`.

When to avoid rebase:

- Avoid rebasing after other teammates have based work on your branch, unless everyone agrees.
- Avoid rebasing during a live debugging session right before a demo recording.
- Avoid rebasing with unresolved local changes. Commit or stash your own changes first.

How to avoid touching the same files:

- Francesco owns API and analysis helpers under `src/app/api/` and `src/lib/`.
- Matteo owns UI components and screens under `src/components/` and small app styling.
- Jacopo owns README/demo/docs and QA notes after implementation lands.
- Coordinate explicitly before editing `src/components/pilot-ops-app.tsx`, `src/lib/pilot-analysis-types.ts`, or `src/lib/mock-pilot-analysis.ts`; these are shared integration files.

How often to sync:

- Pull/rebase before starting work.
- Fetch after every teammate announces a merge.
- Re-run lint/build after resolving conflicts.
- Do not keep long-running branches open for more than one focused task.

How to keep PRs small:

- One PR should have one mission.
- Prefer adding a helper file over rewriting unrelated modules.
- Do not reformat files outside the change.
- Do not update docs in feature PRs unless the behavior changed and the docs are needed for review.
- Put aspirational ideas in PR notes, not code.

## 7. Individual Codex Implementation Prompts

Francesco Codex prompt:

```text
You are Codex working on branch feature/francesco-analysis-api.

Inspect first:
- schemas/pilot_analysis.schema.json
- docs/ai-pipeline.md
- docs/data-model.md
- data/demo_amr_profile.json
- data/italian_segments.json
- data/warehouse_processes.json
- data/trust_gaps.json
- data/proof_checklist.json
- data/italian_target_accounts.json
- src/lib/pilot-analysis-types.ts
- src/lib/mock-pilot-analysis.ts
- src/components/pilot-ops-app.tsx

Avoid:
- data/
- schemas/
- package.json and package-lock.json unless absolutely necessary
- broad UI layout edits
- live web scraping, CRM, outreach, personal contacts, compliance claims

Scope:
Add a demo-safe analysis backend. Create POST /api/analyze. Align the app-facing PilotAnalysis type and fallback/mock result with the current schema and PR #5 seed data. The route must return a complete deterministic fallback result with no API keys. Optional live AI is allowed only if it is server-side, guarded by env vars, and cannot break fallback.

Acceptance criteria:
- No API key required for default demo.
- /api/analyze returns a structured Pilot Control Room result.
- Result includes target_account_shortlist from curated seed data.
- Result stays focused on PilotOps AI turning a Chinese warehouse automation product into a localized, low-risk Italian pilot package.
- npm run lint passes.
- npm run build passes.

Commands:
git status --short
git diff --check
npm run lint
npm run build

PR title:
feat: add demo-safe analysis API with structured fallback

PR summary format:
## What changed
## How to test
## Intentionally left out
## Fallback behavior
```

Matteo Codex prompt:

```text
You are Codex working on branch feature/matteo-demo-flow-polish.

Inspect first:
- src/components/pilot-ops-app.tsx
- src/components/screens/start-screen.tsx
- src/components/screens/intake-screen.tsx
- src/components/screens/analysis-loading-screen.tsx
- src/components/screens/control-room-screen.tsx
- src/components/dashboard/section-panel.tsx
- src/components/dashboard/fit-score.tsx
- src/components/dashboard/status-pill.tsx
- src/components/ui/button.tsx
- src/components/ui/badge.tsx
- src/lib/pilot-analysis-types.ts
- src/lib/mock-pilot-analysis.ts
- docs/ui-system.md

Avoid:
- data/
- schemas/
- package.json and package-lock.json
- src/app/api/
- new UI libraries
- broad redesigns

Scope:
Make the MVP demo flow judge-ready. Keep the AMR demo prefilled but make intake feel editable. Add target-account ranking to the loading flow. Render Target Account Shortlist in the dashboard. Wire the flow to /api/analyze after Francesco's route exists, preserving client fallback if the API fails. Remove obvious "mock output" copy from the final demo path.

Acceptance criteria:
- User can click from start to intake to analysis to Pilot Control Room.
- Target Account Shortlist is visible.
- Default path works without API keys.
- Dashboard is English, clear, operational, and not a chatbot/report.
- npm run lint passes.
- npm run build passes.

Commands:
git status --short
git diff --check
npm run lint
npm run build

PR title:
feat: polish demo flow and render target account shortlist

PR summary format:
## What changed
## How to test
## Intentionally left out
## Screenshots
```

Jacopo Codex prompt:

```text
You are Codex working on branch feature/jacopo-demo-readiness-qa.

Inspect first:
- README.md
- docs/demo-plan.md
- docs/code-map.md
- docs/data-model.md
- docs/testing-and-evals.md
- data/demo_amr_profile.json
- data/italian_target_accounts.json
- schemas/pilot_analysis.schema.json
- Francesco's PR diff after it opens
- Matteo's PR diff after it opens

Avoid:
- data/ normalization work, because PR #5 is already merged
- schemas/
- application code unless fixing a small demo-breaking bug after coordination
- package files unless the team explicitly agrees

Scope:
Own post-merge integration support, QA, README/demo instructions, deployment readiness, video script, and pitch deck checklist. Keep docs honest: default demo path works without API keys; optional live AI only if implemented and safe.

Acceptance criteria:
- README matches the implemented MVP.
- Stable demo instructions are clear.
- Optional env vars are marked optional and server-side only.
- Vercel/local demo instructions are present.
- Target Account Shortlist and no-personal-data guardrails are clear.
- 1 to 1.5 minute video script is ready.
- Pitch deck checklist has max 10 slides.
- npm run lint passes.
- npm run build passes.

Commands:
git status --short
git diff --check
npm run lint
npm run build

PR title:
docs: finalize demo readiness and deployment instructions

PR summary format:
## What changed
## How to test
## Intentionally left out
## QA notes
```

## 8. Demo Readiness Checklist

Local build:

- [ ] `npm install` completed.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Local app opens with `npm run dev`.

Deployed build:

- [ ] Vercel project connected to the correct GitHub repo.
- [ ] Build command is `npm run build`.
- [ ] Production URL opens on a second browser or device.
- [ ] No environment variables are required for the default demo path.

Stable demo path:

- [ ] Start screen has a clear PilotOps AI product promise.
- [ ] Intake is prefilled and fast to submit.
- [ ] Target market is clearly Italy.
- [ ] Analysis loading appears intentional.
- [ ] Pilot Control Room renders without waiting on external AI.

Optional live AI path:

- [ ] Live AI is server-side only.
- [ ] Missing env vars do not break the app.
- [ ] AI failure falls back to deterministic demo result.
- [ ] No API keys use `NEXT_PUBLIC_`.
- [ ] Optional AI output stays structured and product-specific.

Fallback behavior:

- [ ] No-key path returns a complete demo analysis.
- [ ] API error path returns or displays fallback result.
- [ ] Fallback copy does not claim live research.
- [ ] Fallback includes Target Account Shortlist.

Target Account Shortlist visibility:

- [ ] At least 5 accounts visible.
- [ ] Each account shows company name, website or source, region/category, process fit, roles, and outreach angle.
- [ ] The shortlist is described as curated, not scraped or guaranteed.
- [ ] No personal emails, phone numbers, LinkedIn profiles, or private contacts appear.

Dashboard clarity:

- [ ] First viewport communicates fit score, buyer segment, and pilot process.
- [ ] Trust gaps are clear and actionable.
- [ ] Pilot offer is bounded and low risk.
- [ ] Sales pack feels ready-to-use.
- [ ] Next actions are specific.

Routes and runtime:

- [ ] `/` works.
- [ ] `/api/analyze` works if implemented.
- [ ] No broken routes in the main click path.
- [ ] Browser console has no errors in the demo path.

Environment variables:

- [ ] Default demo requires none.
- [ ] Optional live AI vars are documented only if implemented.
- [ ] No secrets committed.
- [ ] `.env.local` remains local only.

README demo instructions:

- [ ] README explains install, run, build, and default demo path.
- [ ] README explains optional live AI honestly.
- [ ] README mentions Vercel deployment if used.
- [ ] README still preserves product non-goals.

Demo video script:

- [ ] 1 to 1.5 minutes.
- [ ] Shows start, intake, loading, dashboard.
- [ ] Highlights buyer segment, warehouse process, trust gaps, Target Account Shortlist, pilot offer, and sales pack.
- [ ] Ends with "not a market report, a first-pilot package."

Pitch deck max 10 slides:

- [ ] Problem.
- [ ] Target user.
- [ ] Product promise.
- [ ] Demo flow.
- [ ] AI engine.
- [ ] Pilot Control Room output.
- [ ] Target Account Shortlist and trust gap differentiation.
- [ ] Market/why now.
- [ ] Business model or next step.
- [ ] Team and ask.

## 9. Immediate Next Actions

- Current state of main in one sentence: `main` is a buildable mock frontend with strong docs and seed data, but no implemented AI/API route and no visible Target Account Shortlist.
- Branches to create now:
  - `feature/francesco-analysis-api`
  - `feature/matteo-demo-flow-polish`
  - `feature/jacopo-demo-readiness-qa`
- Francesco starts the analysis API, schema-aligned fallback, and safe no-key behavior.
- Matteo starts intake/demo flow polish and Target Account Shortlist UI, coordinating with Francesco on final result shape.
- Jacopo starts QA and waits to finalize README/demo instructions until the implementation branches land.
- Merge first: Francesco's analysis API/fallback PR.
- Test before recording the demo: local build, deployed build, no-key default path, Target Account Shortlist visibility, no console errors, no exposed secrets, and the 1 to 1.5 minute script against the final UI.
