# Operational Task Split - Market Entry Decision Engine

## Document Objective

This document splits the work between **Matteo**, **Francesco**, and **Jacopo** to turn the current app from a prefilled AMR/3PL demo into a real **Market Entry Segment Decision Engine**.

The MVP objective is to let a Chinese warehouse automation startup enter a real product profile, paste evidence/documentation, and receive a concrete recommendation on the first Italian segment where it can realistically win a pilot.

The final product must deliver on this promise:

> I paste a Chinese warehouse automation product -> the AI understands category, proof, and constraints -> compares Italian segments -> chooses the first realistic wedge -> generates pilot package, trust gaps, target accounts, and sales pack.

---

## 1. Diagnosis Of The Current State

The app already has a solid technical base:

- Existing Next.js flow.
- Existing `POST /api/analyze` API.
- Existing OpenRouter integration.
- Existing deterministic fallback.
- Existing runtime validation.
- Dashboard already able to show:
  - recommended segment;
  - warehouse process;
  - trust gaps;
  - pilot offer;
  - target accounts;
  - proof checklist;
  - sales pack;
  - next actions.
- Existing seed data.
- `npm run lint` and `npm run build` are already passing.

The main problem is that the app is still too demo-oriented:

- fallback is hardcoded around AMR, 3PL/e-commerce, and internal transport;
- intake is almost fixed;
- no real evidence extraction from pasted text;
- no real segment scoring;
- no visible decision matrix;
- OpenRouter prompt is still too tied to the AMR/3PL demo;
- risk of mismatch between schema, types, and validator.

---

## 2. Target MVP

The target MVP must not be a generic market report generator.

It must be a **Market Entry Segment Decision Engine**.

### Ideal Flow

1. The user enters or edits a product profile.
2. The user pastes evidence/documentation:
   - Chinese documentation;
   - website or product page text;
   - technical specifications;
   - notes on certifications/proof;
   - case studies, ROI, deployment, or constraints.
3. The backend extracts a lightweight evidence profile.
4. The backend maps product capabilities to warehouse processes.
5. The backend evaluates Italian segments using the seed datasets.
6. The backend chooses the first market entry wedge.
7. The backend explains why the winning segment beats the alternatives.
8. The backend generates the Pilot Control Room output.
9. The frontend shows:
   - product evidence summary;
   - segment decision matrix;
   - why this segment wins;
   - pilot package;
   - trust gaps;
   - proof checklist;
   - target account shortlist;
   - sales pack.

### Out Of Scope For This Sprint

Do not implement now:

- OCR;
- complex PDF parsing;
- live web scraping;
- CRM enrichment;
- personal contact collection;
- autonomous outreach;
- certified compliance claims;
- complex RAG;
- generic market reports.

---

## 3. Task Split

# Francesco - Backend Decision Engine, Contract, And Deterministic Pipeline

## Objective

Francesco must turn `/api/analyze` into the real core of the product.

The backend must receive real inputs, read the evidence, use local datasets, choose segment/process/pilot, and return a valid `PilotAnalysis`.

OpenRouter must be optional. If the API key is missing or the AI output is invalid, the system must use the local deterministic pipeline instead of falling back to the old fixed AMR/3PL fallback.

---

## Task P0 - Do Immediately

### 1. Update The API Contract

Create or update the types:

```ts
EvidenceInputs
AnalyzeRequestBody
ProductEvidenceProfile // optional
SegmentScoreCard       // optional
```

The request must accept at least:

```json
{
  "profile": {
    "companyName": "Shenzhen Northstar Mobility",
    "productCategory": "AMR",
    "targetMarket": "Italy",
    "description": "Autonomous mobile robot for warehouse internal transport.",
    "benefits": ["Reduce manual walking time"],
    "currentProof": ["Technical specifications"],
    "documentationStatus": "CE summary partial; Italian reference missing.",
    "pilotAmbition": "Win first Italian pilot.",
    "constraints": ["No local maintenance partner identified"]
  },
  "evidence_inputs": {
    "chinese_documentation_text": "",
    "website_product_text": "",
    "technical_specs_text": "",
    "proof_certification_notes": "",
    "case_study_roi_notes": ""
  }
}
```

---

### 2. Implement Deterministic Stages

Create real functions, even if simple:

```ts
parseProductProfile(input): ProductSummary
```

It must:

- classify product category:
  - AMR;
  - AGV;
  - sorting automation;
  - palletizing;
  - picking robot;
  - inventory scanning;
  - WMS/AI orchestration;
- identify the operational use case;
- extract constraints, infrastructure, integration needs, safety assumptions, and support model;
- separate available proof from missing proof;
- estimate `pilot_complexity`.

```ts
matchItalianSegment(productSummary, italianSegments): BuyerSegmentRecommendation
```

It must:

- actually read `data/italian_segments.json`;
- compare category/use case/processes with the segments;
- consider proof burden and support risk;
- choose the most pilotable segment;
- generate alternatives with tradeoffs.

```ts
selectWarehouseProcess(productSummary, segment, warehouseProcesses): WarehouseProcessRecommendation
```

It must:

- read `data/warehouse_processes.json`;
- match the product against `suitable_product_categories`;
- choose a measurable and limited process;
- generate KPIs and operational boundaries.

```ts
analyzeTrustGaps(productSummary, segment, process, trustGaps, proofChecklist): TrustGap[]
```

It must:

- compare available proof with required proof;
- if CE/safety proof is missing, generate a high/critical risk;
- if local maintenance is missing, generate a high risk;
- if localized ROI is missing, generate a medium/high risk;
- if Italian reference is missing, generate a high risk;
- produce concrete mitigations.

```ts
generatePilotPackage(productSummary, segment, process, trustGaps): PilotOffer
```

It must generate:

- duration;
- scope;
- required setup;
- KPIs;
- exit clause;
- next commercial step.

The pilot must be limited, measurable, and realistic. Avoid "full warehouse transformation".

```ts
findTargetAccounts(segment, process, regionPreference, italianTargetAccounts): TargetAccount[]
```

It must:

- filter by `logistics_category`;
- boost `likely_process_fit`;
- boost `hq_region`, if present;
- boost coherent `warehouse_signals`;
- return 5-10 companies;
- avoid scraping;
- avoid inventing personal contacts.

```ts
generateSalesPack(productSummary, segment, process, pilotOffer, trustGaps, shortlist): SalesPack
```

It must produce:

- outreach email;
- meeting pitch;
- one-page pilot proposal;
- ROI argument;
- objection battlecard;
- proof checklist summary.

```ts
assemblePilotAnalysis(stages): PilotAnalysis
```

It must:

- compose the final object;
- include metadata, assumptions, and dataset versions;
- guarantee a shape compliant with the schema;
- validate with `isPilotAnalysisUsable`;
- use fallback only if something essential is missing.

---

## Main Files For Francesco

```txt
src/app/api/analyze/route.ts
src/lib/product-evidence-parser.ts
src/lib/segment-scoring-engine.ts
src/lib/market-entry-assembler.ts
src/lib/pilot-analysis-fallback.ts
src/lib/pilot-analysis-types.ts
src/lib/pilot-analysis-validation.ts
schemas/pilot_analysis.schema.json
```

---

## Important Rule For Francesco

Watch the risk of schema/type/validator drift.

If new top-level fields are added, for example:

```json
{
  "product_evidence_profile": {},
  "segment_scorecards": []
}
```

then all of these must be updated together:

```txt
TypeScript types
JSON schema
validator
fallback
frontend usage
```

If the risk is too high, use the safer solution:

- do not add new top-level fields;
- put the new information inside already validated fields such as:
  - `product_summary`;
  - `buyer_segment_recommendation`;
  - `warehouse_process_recommendation`;
  - `trust_gaps`;
  - `metadata.assumptions`.

---

## Definition Of Done For Francesco

Francesco is done when:

- `/api/analyze` actually uses input and `evidence_inputs`;
- it works without `OPENROUTER_API_KEY`;
- if OpenRouter fails, it uses the deterministic pipeline;
- changing product category changes the output;
- changing proof changes trust gaps/proof checklist;
- the output remains schema-valid;
- `npm run lint` passes;
- `npm run build` passes.

---

# Matteo - Real Intake, Dashboard, And Decision Matrix

## Objective

Matteo must make the user feel they are using a real analysis engine.

The UI must stop feeling like a prefilled demo and must clearly show:

- what was extracted from the product;
- which segment wins;
- why that segment wins;
- which alternatives were rejected;
- which pilot package should be proposed;
- which trust gaps block the sale.

---

## Task P0 - Do Immediately

### 1. Make Intake Real

Add or make editable the fields:

- company name;
- product category;
- product description;
- target market fixed to Italy;
- benefits;
- current proof;
- documentation status;
- desired pilot ambition;
- known constraints.

Add textareas for:

- Chinese documentation text;
- website/product page text;
- technical specs text;
- proof/certification notes;
- case study/ROI/deployment notes.

---

### 2. Send The Correct Body To `/api/analyze`

The UI must send:

```json
{
  "profile": {},
  "evidence_inputs": {}
}
```

Even if the backend is not complete yet, Matteo can already prepare this structure.

---

### 3. Update The Loading Screen

The loading screen should not only say it is "analyzing".

It must communicate the product steps:

- extracting product evidence;
- scoring Italian buyer segments;
- selecting first pilot wedge;
- assembling pilot package;
- preparing target account shortlist.

---

## Task P1 - After Backend Stabilization

Add top sections to the Control Room:

## Product Evidence Extracted

Show:

- detected category;
- capabilities;
- supported processes;
- available proof;
- missing proof;
- constraints;
- confidence score, if available.

## Segment Decision Matrix

Show:

- segment;
- total score;
- process fit;
- pain intensity;
- pilotability;
- proof readiness;
- sales-cycle practicality;
- support risk;
- tradeoff.

If the backend does not yet return `segment_scorecards`, derive a simplified matrix from:

```txt
buyer_segment_recommendation
buyer_segment_recommendation.alternative_segments
warehouse_process_recommendation
product_summary.available_proof
product_summary.missing_proof
```

## Why This Segment Wins

Show near the top:

- why it is the best first wedge;
- why it is more pilotable than the alternatives;
- which risk remains;
- which proof is needed to close the pilot.

---

## Main Files For Matteo

```txt
src/components/pilot-ops-app.tsx
src/components/screens/intake-screen.tsx
src/components/screens/control-room-screen.tsx
src/components/screens/analysis-loading-screen.tsx
```

Optional files:

```txt
src/components/dashboard/segment-decision-matrix.tsx
src/components/dashboard/product-evidence-card.tsx
```

---

## Important Rules For Matteo

Matteo should avoid touching:

```txt
src/app/api/analyze/route.ts
src/lib/openrouter-client.ts
data/
schemas/
```

His area is frontend.

The UI must not promise:

- live scraping;
- guaranteed buyers;
- personal contacts;
- certified compliance;
- exhaustive leads;
- autonomous outreach automation.

The message must remain:

> first Italian pilot package, not generic market report.

---

## Definition Of Done For Matteo

Matteo is done when:

- the user can paste documentation/proof/specs;
- the request includes `profile` + `evidence_inputs`;
- the Control Room clearly shows the first market entry wedge;
- the dashboard feels dynamic, not prefilled;
- the decision matrix is visible or safely derived;
- the UI works even if the backend uses deterministic fallback;
- `npm run lint` passes;
- `npm run build` passes.

---

# Jacopo - Data Quality, OpenRouter Prompting, QA, And Docs

## Objective

Jacopo must make the product intelligence credible.

His work is to ensure that:

- seed datasets truly support a decision;
- the OpenRouter prompt does not invent things;
- QA proves that the product is not hardcoded to AMR/3PL;
- final documents describe real behavior, not planned behavior.

---

## Task P0 - Do Immediately

### 1. Review Seed Data

Check:

```txt
data/italian_segments.json
data/warehouse_processes.json
data/trust_gaps.json
data/proof_checklist.json
data/italian_target_accounts.json
```

Verify that:

- every segment has useful scoring signals;
- every process has coherent product categories;
- `likely_process_fit` is useful for ranking;
- target account categories match the segments;
- there is no personal data;
- source notes are prudent.

---

### 2. Prepare QA Fixtures

Create manual cases to test at least:

1. AMR;
2. parcel sorting automation;
3. inventory scanning robot;
4. palletizing automation.

Each fixture should contain:

- product category;
- product description;
- available proof;
- missing proof;
- constraints;
- expected output;
- what to check in the dashboard.

---

## Task P1 - After Francesco

Update `src/lib/openrouter-client.ts`.

The prompt must stop being an AMR/3PL generator.

It must behave like a decision engine:

- read product evidence;
- evaluate segment fit;
- evaluate process fit;
- produce trust gaps;
- generate pilot package;
- generate sales pack;
- use only curated target accounts.

The prompt must explicitly forbid:

- certified compliance unless proven;
- live scraping;
- personal contact harvesting;
- guaranteed buyers;
- invented companies;
- exhaustive lead lists;
- unsupported claims.

---

## Task P2 - End Of Sprint

Update the final documents:

```txt
docs/ai-pipeline.md
docs/testing-and-evals.md
docs/parallel-implementation-plan.md
```

Docs should be updated only after the real implementation.

They must describe:

- what the pipeline actually does;
- what is deterministic;
- what OpenRouter does;
- what happens if OpenRouter fails;
- which datasets are used;
- which guardrails are implemented;
- which manual tests passed.

---

## Main Files For Jacopo

```txt
data/italian_segments.json
data/warehouse_processes.json
data/trust_gaps.json
data/proof_checklist.json
data/italian_target_accounts.json
src/lib/openrouter-client.ts
docs/ai-pipeline.md
docs/testing-and-evals.md
docs/parallel-implementation-plan.md
```

---

## Definition Of Done For Jacopo

Jacopo is done when:

- the prompt supports multiple product categories;
- seed data is coherent with scoring and shortlist;
- QA tests prove the product is not stuck on AMR/3PL;
- no output promises unverified certifications, contacts, buyers, or compliance;
- docs are updated to match real behavior;
- `npm run lint` passes;
- `npm run build` passes.

---

# 4. Recommended Integration Order

## Branches

From updated `main`:

```bash
git checkout main
git pull --rebase origin main
```

Create the branches:

```bash
# Francesco
git checkout -b feature/francesco-market-scoring-engine

# Matteo
git checkout -b feature/matteo-intake-decision-matrix

# Jacopo
git checkout -b feature/jacopo-market-data-ai-prompting
```

---

## Recommended Merge Order

```txt
1. Francesco -> main
2. Matteo rebase onto main -> merge
3. Jacopo rebase onto main -> merge
```

Reason:

- Francesco defines the API contract and real output.
- Matteo depends on those data points for the dashboard.
- Jacopo updates prompts/docs/QA around the final behavior.

---

# 5. Minimum Manual Tests

The product can be considered genuinely dynamic only if these tests pass.

## Test 1 - Parcel Sorting Automation

Input:

```txt
Product category: parcel sorting automation
```

Expected output:

- recommended process related to parcel sorting;
- shortlist coherent with parcel/courier/logistics hubs;
- KPIs related to sorting throughput, mis-sort rate, and parcels/hour.

---

## Test 2 - Inventory Scanning Robot

Input:

```txt
Product category: inventory scanning robot
```

Expected output:

- recommended process related to inventory scanning/cycle counting;
- KPIs related to accuracy, scan coverage, and cycle count time;
- segments compatible with warehouses where inventory accuracy matters.

---

## Test 3 - Missing CE/Safety Proof

Input:

```txt
CE/safety proof missing or partial
```

Expected output:

- safety trust gap is high/critical;
- proof checklist shows missing proof;
- sales pack does not claim verified compliance.

---

## Test 4 - Missing Local Maintenance

Input:

```txt
No local maintenance partner identified
```

Expected output:

- support/local maintenance trust gap is high;
- concrete mitigation:
  - remote diagnostics;
  - spare parts plan;
  - named local response partner;
  - support SLA.

---

## Test 5 - Strong Proof Inserted

Input:

```txt
Strong technical specs, Chinese case study, ROI notes, partial CE summary, support plan
```

Expected output:

- proof readiness improves;
- some gaps decrease;
- confidence/fit improves, if implemented.

---

## Test 6 - Region Preference

Input:

```txt
Region preference: Lombardy or Emilia-Romagna
```

Expected output:

- shortlist boosts companies in that region;
- if there are not enough matches, it keeps a clear caveat.

---

# 6. Verification Commands For Each PR

Before opening or updating a PR:

```bash
git status --short
npm run lint
npm run build
```

If tests are added:

```bash
npm test
```

---

# 7. Final Demo Acceptance Criteria

The demo is ready when:

- the app starts locally with `npm run dev`;
- `npm run lint` passes;
- `npm run build` passes;
- intake accepts product description and evidence text;
- `/api/analyze` responds even without an API key;
- with an API key, OpenRouter is attempted but is not required for the product to work;
- if OpenRouter fails, the deterministic fallback still produces credible output;
- the dashboard shows the first market entry wedge;
- the dashboard shows segment scores or a derived decision matrix;
- the dashboard explains why the chosen segment beats the alternatives;
- the dashboard shows pilot package, trust gaps, proof checklist, target accounts, and sales pack;
- there are no claims about live scraping, guaranteed buyers, personal contacts, or certified compliance;
- target accounts come only from the curated seed dataset;
- the message remains: `first Italian pilot package`, not `generic market report`.

---

# 8. Strategic Priority

The priority is not adding many features.

The priority is showing judges one clear behavior:

> The product takes a real profile, reads evidence, reasons across Italian segments, chooses a realistic first pilot, and generates an operational market entry package.

This is stronger than a generic dashboard because it directly answers the hackathon criteria:

- clarity of the idea;
- real usefulness;
- execution;
- AI integration;
- pitch quality.

---

# 9. Final Summary For The Team

## Francesco

Builds the engine.

```txt
Real input -> parser -> scoring -> segment/process/pilot -> valid PilotAnalysis
```

## Matteo

Builds the user experience.

```txt
Real intake -> evidence text -> decision matrix -> credible Control Room
```

## Jacopo

Makes the system credible and safe.

```txt
Seed data -> prompt guardrails -> QA fixtures -> final docs
```

The team works in parallel, but the merge must respect the API contract: backend first, then UI, then final prompt/docs/QA.
