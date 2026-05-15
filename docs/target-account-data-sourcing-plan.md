# Target Account Data Sourcing Plan

## Purpose

This document defines how PilotOps AI should obtain, verify, and maintain the initial Italian target-account database used by the MVP.

The database should help the Pilot Control Room show a concrete shortlist of plausible Italian warehouse/logistics companies for a first pilot. It should not become a broad lead-scraping system, a CRM, or a database of personal contacts.

## MVP Position

For the hackathon MVP, the target-account database should be:

- curated;
- company-level only;
- sourced from public information;
- small enough to review manually;
- structured enough to rank automatically;
- usable without paid data providers;
- honest about source limitations.

The MVP should not claim that the shortlist is exhaustive, live-scraped, verified sales intent, or guaranteed buyer demand.

## Current Starting Point

The repository already includes:

- `data/italian_target_accounts.json`
- `docs/data-model.md`
- `docs/ai-pipeline.md`
- `schemas/pilot_analysis.schema.json`

The current target-account dataset is the initial seed. The plan below explains how to expand it safely and systematically.

## Data We Need

Each target-account record should describe a company, not a person.

Required fields for the initial database:

```json
{
  "company_name": "Example Logistics S.p.A.",
  "website": "https://example.com",
  "hq_region": "Lombardy",
  "logistics_category": "3PL and e-commerce fulfilment",
  "warehouse_signals": ["contract logistics", "fulfilment", "warehouse management"],
  "likely_process_fit": ["internal transport", "picking support"],
  "recommended_buyer_roles": ["Operations Director", "Warehouse Manager"],
  "outreach_angle": "Why this company is a plausible first-pilot target.",
  "source_note": "Public source used for curation."
}
```

Recommended optional fields for later:

```json
{
  "source_urls": ["https://example.com/logistics"],
  "verification_status": "verified_public_source",
  "confidence_score": 82,
  "last_checked": "2026-05-16",
  "data_origin": "official_website",
  "notes": "Short internal note about ambiguity or source caveat."
}
```

Do not include:

- personal names;
- personal emails;
- phone numbers;
- LinkedIn profile URLs;
- scraped employee data;
- private contact details;
- claims that a company is actively buying unless there is a cited public source.

## Target Segments

The first database should cover the same segments used by the MVP:

1. 3PL and e-commerce fulfilment.
2. Retail logistics and fashion distribution.
3. Food and beverage logistics.
4. Pharma logistics.
5. Parcel, courier, and sorting operations.
6. Manufacturing and industrial distribution.

Recommended initial size:

- 5 to 8 companies per segment;
- 30 to 50 total records;
- at least 20 records verified from official company websites;
- at least 5 strong AMR/AGV-fit records for the live demo path.

## Source Tiers

### Tier 1: Public Official Sources

Use these first.

Examples:

- official company website;
- official company logistics, warehouse, or contract logistics pages;
- official press releases;
- official annual report or sustainability report;
- official location or network pages;
- public trade association profiles.

These are best for the MVP because they are easy to cite and safe to show.

### Tier 2: Public Directories and Maps

Use these for discovery and cross-checking, not as the only source when possible.

Examples:

- OpenStreetMap / Overpass API;
- Google Places API;
- Geoapify Places;
- Kompass public pages;
- public logistics directories;
- trade fair exhibitor lists.

These can help discover companies and facilities, but records should still be verified against official company pages before inclusion.

### Tier 3: Company Data Providers

Use later if the team gets access.

Examples:

- Registro Imprese / InfoCamere / Telemaco;
- Cerved;
- Atoka;
- Creditsafe;
- CRIBIS;
- AIDA / Bureau van Dijk;
- Kompass paid database.

These are useful for legal entity data, size, financials, ATECO/NACE codes, and better filtering. They usually require paid access, account approval, or API keys.

### Tier 4: Sales Intelligence Providers

Use only in a later product version, not the MVP default.

Examples:

- Apollo;
- Cognism;
- ZoomInfo-like services.

These can introduce personal contact and GDPR complexity. The MVP should stay role-based and company-level.

## What Can Be Automated Now

The following can be automated or semi-automated:

1. Discover candidate companies from public directories, maps, and search results.
2. Extract public company-level signals from official pages.
3. Normalize company name, website, region, and logistics category.
4. Classify likely process fit using keyword rules or AI.
5. Generate a first outreach angle.
6. Assign recommended buyer roles by logistics category.
7. Flag records needing manual verification.

The following should remain manual or reviewed before entering the MVP dataset:

- source quality check;
- whether the company is actually relevant to warehouse/logistics operations;
- whether the website is official;
- whether the outreach angle overclaims;
- whether any personal data accidentally entered the record.

## Collection Workflow

### Step 1: Define Query Matrix

Create search queries by segment and region.

Examples:

```text
site:.it logistica conto terzi magazzino Lombardia
site:.it fulfillment e-commerce magazzino Italia
site:.it logistica farmaceutica magazzino Italia
site:.it cold chain logistica alimentare Italia
site:.it corriere hub sorting Italia
site:.it logistica industriale magazzino Emilia-Romagna
```

For map-based discovery:

```text
logistics warehouse Lombardy Italy
fulfilment center Veneto Italy
cold chain logistics Emilia-Romagna Italy
parcel sorting hub Italy
```

### Step 2: Build Candidate List

Collect candidate company names and websites into a temporary review table.

Temporary fields:

```text
company_name
candidate_website
segment_guess
region_guess
discovery_source
review_status
notes
```

Do not add candidates directly to `data/italian_target_accounts.json` until they pass review.

### Step 3: Verify Public Source

For each candidate, find at least one public company-level source.

Preferred verification:

- official company page showing warehousing, logistics, fulfilment, cold chain, sorting, or industrial distribution;
- official page listing Italian locations or logistics services;
- official press release about a warehouse, logistics hub, or automation project.

Reject or postpone if:

- only a social media result exists;
- the company website is unclear;
- the company does not actually operate logistics or warehouse-relevant flows;
- the source is only about transport with no warehouse/process relevance.

### Step 4: Normalize Fields

Map each company into the MVP categories.

Normalize `hq_region` to:

```text
Lombardy
Veneto
Emilia-Romagna
Piedmont
Lazio
other
null
```

Normalize `logistics_category` to one of:

```text
3PL and e-commerce fulfilment
retail logistics and fashion distribution
food and beverage logistics
pharma logistics
parcel/courier/sorting operations
manufacturing and industrial distribution
```

Normalize `likely_process_fit` to values already used by the MVP:

```text
internal transport
picking support
parcel sorting
pallet movement
inventory scanning
line-side replenishment
```

### Step 5: Add Warehouse Signals

Add 2 to 5 short evidence-backed signals.

Good examples:

- contract logistics and warehousing services;
- e-commerce fulfilment, picking, packing, and returns;
- cold-chain warehouse operations;
- pharma distribution and GDP-oriented logistics;
- parcel hub or sorting network;
- production logistics or line-side supply.

Avoid vague signals:

- innovative company;
- large company;
- good logistics player;
- likely interested in robotics.

### Step 6: Generate Outreach Angle

Write one practical reason the company is relevant for a pilot.

Good pattern:

```text
[Company] is a plausible AMR/AGV pilot target because its public warehouse signals show [process], where [pilot process] can be tested in a bounded workflow.
```

Do not write:

- "They need our product";
- "They are looking for automation";
- "They will buy";
- "Contact this specific person."

### Step 7: Manual QA

Before committing data:

1. Confirm the website is official.
2. Confirm no personal data is included.
3. Confirm the source note is specific enough.
4. Confirm the category and process fit are plausible.
5. Confirm the outreach angle does not overclaim.
6. Confirm JSON is valid.

### Step 8: Commit Initial Database

Commit only reviewed records to `data/italian_target_accounts.json`.

Recommended batch size:

- 10 to 20 records per PR;
- one PR for initial MVP seed if time is short;
- separate later PRs for provider/API enrichment.

## Suggested Initial Data Targets

For the first database expansion, aim for:

| Segment | Target Count | Notes |
|---|---:|---|
| 3PL and e-commerce fulfilment | 8 | Highest priority for AMR demo |
| Retail logistics and fashion distribution | 6 | Strong for picking/internal transport |
| Food and beverage logistics | 5 | Strong for pallet movement/cold chain |
| Pharma logistics | 5 | Trust-heavy and documentation-sensitive |
| Parcel/courier/sorting operations | 5 | Strong for sorting automation |
| Manufacturing and industrial distribution | 6 | Strong for line-side replenishment and pallet flow |

Minimum MVP total: 30 records.

Better hackathon target: 40 records.

## Automation Options

### Option A: Manual Curation

Fastest and safest for the MVP.

Process:

- team researches companies manually;
- records are written into JSON;
- one teammate reviews source notes and scope claims.

Best when:

- time is short;
- source quality matters;
- no external API keys are available.

### Option B: Semi-Automated Discovery

Recommended next step.

Process:

- use Google search, Overpass, Geoapify, OpenCorporates, or OpenRouter-assisted extraction to create a candidate list;
- manually verify official sources;
- write only reviewed records into JSON.

Best when:

- the team wants more coverage;
- a reviewer can filter false positives;
- the MVP still avoids personal data.

### Option C: Commercial Provider Enrichment

Post-MVP or paid pilot path.

Process:

- use Cerved, Atoka, Creditsafe, CRIBIS, AIDA, or Kompass;
- enrich legal entity, size, turnover, ATECO/NACE, and location data;
- keep personal contact data out of the default product unless there is explicit compliance handling.

Best when:

- the product becomes commercial;
- customers need stronger account qualification;
- the team can handle API contracts and data rights.

## Ranking Logic for the App

The app should rank target accounts after the AI/local engine selects:

- buyer segment;
- warehouse process;
- region preference, if available;
- proof/trust gaps.

Simple scoring:

```text
base score = 50
+20 if logistics_category matches selected segment
+15 if likely_process_fit includes selected process family
+10 if hq_region is in a preferred pilot region
+10 if warehouse_signals include process-relevant keywords
+5 if source_note is from official company website
-10 if hq_region is null or source is weak
```

The app should return the top 5 to 10 accounts.

The UI should describe them as:

```text
Curated target accounts to investigate first
```

Not as:

```text
Verified leads
```

## Data Quality Rules

Use these rules before merging new records:

- every record must have a company name and official website;
- every record must have at least one source note;
- every record must be company-level only;
- every record must include at least two warehouse signals;
- every record must include at least one likely process fit;
- every record must include role titles only, not people;
- every outreach angle must be explainable from public signals;
- records with weak evidence should be excluded rather than padded.

## Legal and Scope Guardrails

The MVP should avoid GDPR risk and product overclaiming.

Do:

- use public company-level data;
- show role-based buyer titles;
- cite official sources where possible;
- explain that accounts are candidates for investigation;
- let users export or copy company-level notes only if export is added later.

Do not:

- scrape personal contacts;
- store personal emails or phone numbers;
- claim consent to outreach;
- claim buyer intent without a public source;
- sell the shortlist as a complete Italian lead database;
- automate outreach from the MVP.

## Recommended Ownership

Jacopo should own the dataset structure and source quality.

Matteo should own the UI rendering of the shortlist.

Francesco should own the ranking/fallback logic that turns the dataset into structured Pilot Control Room output.

## Immediate Next Actions

1. Keep the existing `data/italian_target_accounts.json` as the first seed.
2. Review the current 30 records for source quality and category balance.
3. Add optional `source_urls`, `verification_status`, `confidence_score`, and `last_checked` only if the team has time to update the schema and UI safely.
4. Expand to 40 records only after the app can already render the shortlist.
5. Prioritize records that support the AMR demo: 3PL, e-commerce fulfilment, retail logistics, and internal transport fit.
6. Keep paid providers as a post-MVP path unless the team already has access.
