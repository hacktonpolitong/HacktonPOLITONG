# Task Split Operativo — Market Entry Decision Engine

## Obiettivo del documento

Questo documento divide il lavoro tra **Matteo**, **Francesco** e **Jacopo** per trasformare l'app attuale da demo precompilata AMR/3PL a un vero **Market Entry Segment Decision Engine**.

L'obiettivo dell'MVP è permettere a una startup cinese di warehouse automation di inserire un profilo prodotto reale, incollare evidenze/documentazione, e ottenere una raccomandazione concreta sul primo segmento italiano dove può realisticamente vincere un pilot.

Il prodotto finale deve rispondere a questa promessa:

> Incollo un prodotto cinese di warehouse automation → l'AI capisce categoria, proof e vincoli → confronta i segmenti italiani → sceglie il primo wedge realistico → genera pilot package, trust gaps, target accounts e sales pack.

---

## 1. Diagnosi dello stato attuale

L'app ha già una buona base tecnica:

- Flow Next.js già esistente.
- API `POST /api/analyze` già presente.
- Integrazione OpenRouter già presente.
- Fallback deterministico già presente.
- Validazione runtime già presente.
- Dashboard già capace di mostrare:
  - segmento consigliato;
  - processo warehouse;
  - trust gaps;
  - pilot offer;
  - target accounts;
  - proof checklist;
  - sales pack;
  - next actions.
- Seed data già presenti.
- `npm run lint` e `npm run build` risultano già passanti.

Il problema principale è che l'app è ancora troppo demo-oriented:

- fallback hardcoded su AMR, 3PL/e-commerce e internal transport;
- intake quasi bloccato;
- nessuna vera estrazione di evidenze dal testo incollato;
- nessuno scoring reale dei segmenti;
- nessuna decision matrix visibile;
- OpenRouter prompt ancora troppo vincolato alla demo AMR/3PL;
- rischio di mismatch tra schema, tipi e validator.

---

## 2. Target MVP

Il target MVP non deve essere un generatore generico di market report.

Deve essere un **Market Entry Segment Decision Engine**.

### Flow ideale

1. L'utente inserisce o modifica un profilo prodotto.
2. L'utente incolla evidenze/documentazione:
   - documentazione cinese;
   - testo da sito o product page;
   - specifiche tecniche;
   - note su certificazioni/proof;
   - case study, ROI, deployment o vincoli.
3. Il backend estrae un profilo evidenze leggero.
4. Il backend mappa le capability del prodotto ai processi warehouse.
5. Il backend valuta i segmenti italiani usando i seed dataset.
6. Il backend sceglie il primo market entry wedge.
7. Il backend spiega perché il segmento vincente batte le alternative.
8. Il backend genera il Pilot Control Room output.
9. Il frontend mostra:
   - product evidence summary;
   - segment decision matrix;
   - why this segment wins;
   - pilot package;
   - trust gaps;
   - proof checklist;
   - target account shortlist;
   - sales pack.

### Fuori scope per questo sprint

Non devono essere implementati ora:

- OCR;
- parsing PDF complesso;
- live web scraping;
- CRM enrichment;
- raccolta di contatti personali;
- autonomous outreach;
- claim di compliance certificata;
- RAG complesso;
- market report generici.

---

## 3. Divisione dei task

# Francesco — Backend Decision Engine, Contract e Pipeline Deterministica

## Obiettivo

Francesco deve trasformare `/api/analyze` nel cuore reale del prodotto.

Il backend deve ricevere input veri, leggere le evidenze, usare i dataset locali, scegliere segmento/processo/pilot e restituire un `PilotAnalysis` valido.

OpenRouter deve essere opzionale. Se manca la API key o l'output AI non è valido, il sistema deve usare la pipeline deterministica locale, non tornare al vecchio fallback fisso AMR/3PL.

---

## Task P0 — Da fare subito

### 1. Aggiornare il contratto API

Creare o aggiornare i tipi:

```ts
EvidenceInputs
AnalyzeRequestBody
ProductEvidenceProfile // opzionale
SegmentScoreCard       // opzionale
```

La request deve accettare almeno:

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

### 2. Implementare gli stage deterministici

Creare funzioni reali, anche semplici ma funzionanti:

```ts
parseProductProfile(input): ProductSummary
```

Deve:

- classificare categoria prodotto:
  - AMR;
  - AGV;
  - sorting automation;
  - palletizing;
  - picking robot;
  - inventory scanning;
  - WMS/AI orchestration;
- identificare use case operativo;
- estrarre vincoli, infrastruttura, integration needs, safety assumptions, support model;
- separare proof disponibili e proof mancanti;
- stimare `pilot_complexity`.

```ts
matchItalianSegment(productSummary, italianSegments): BuyerSegmentRecommendation
```

Deve:

- leggere davvero `data/italian_segments.json`;
- confrontare categoria/use case/processi con i segmenti;
- considerare proof burden e support risk;
- scegliere il segmento più pilotabile;
- generare alternative con tradeoff.

```ts
selectWarehouseProcess(productSummary, segment, warehouseProcesses): WarehouseProcessRecommendation
```

Deve:

- leggere `data/warehouse_processes.json`;
- fare match tra prodotto e `suitable_product_categories`;
- scegliere un processo misurabile e limitato;
- generare KPI e operational boundaries.

```ts
analyzeTrustGaps(productSummary, segment, process, trustGaps, proofChecklist): TrustGap[]
```

Deve:

- confrontare proof disponibili e proof richiesti;
- se manca CE/safety, generare rischio high/critical;
- se manca manutenzione locale, generare rischio high;
- se manca ROI localizzato, generare rischio medium/high;
- se manca referenza italiana, generare rischio high;
- produrre mitigation concrete.

```ts
generatePilotPackage(productSummary, segment, process, trustGaps): PilotOffer
```

Deve generare:

- durata;
- scope;
- setup richiesto;
- KPI;
- exit clause;
- next commercial step.

Il pilot deve essere limitato, misurabile e realistico. Evitare “full warehouse transformation”.

```ts
findTargetAccounts(segment, process, regionPreference, italianTargetAccounts): TargetAccount[]
```

Deve:

- filtrare per `logistics_category`;
- boostare `likely_process_fit`;
- boostare `hq_region`, se presente;
- boostare `warehouse_signals` coerenti;
- restituire 5-10 aziende;
- non fare scraping;
- non inventare contatti personali.

```ts
generateSalesPack(productSummary, segment, process, pilotOffer, trustGaps, shortlist): SalesPack
```

Deve produrre:

- outreach email;
- meeting pitch;
- one-page pilot proposal;
- ROI argument;
- objection battlecard;
- proof checklist summary.

```ts
assemblePilotAnalysis(stages): PilotAnalysis
```

Deve:

- comporre l'oggetto finale;
- includere metadata, assumptions e dataset versions;
- garantire shape conforme allo schema;
- validare con `isPilotAnalysisUsable`;
- usare fallback solo se manca qualcosa di essenziale.

---

## File principali Francesco

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

## Regola importante per Francesco

Attenzione al rischio schema/type/validator drift.

Se vengono aggiunti nuovi campi top-level, ad esempio:

```json
{
  "product_evidence_profile": {},
  "segment_scorecards": []
}
```

allora bisogna aggiornare insieme:

```txt
TypeScript types
JSON schema
validator
fallback
frontend usage
```

Se il rischio è troppo alto, usare la soluzione sicura:

- non aggiungere nuovi top-level fields;
- inserire le nuove informazioni dentro campi già validati come:
  - `product_summary`;
  - `buyer_segment_recommendation`;
  - `warehouse_process_recommendation`;
  - `trust_gaps`;
  - `metadata.assumptions`.

---

## Definition of Done Francesco

Francesco ha finito quando:

- `/api/analyze` usa davvero input e `evidence_inputs`;
- funziona senza `OPENROUTER_API_KEY`;
- se OpenRouter fallisce, usa la pipeline deterministica;
- cambiando product category cambia output;
- cambiando proof cambiano trust gaps/proof checklist;
- l'output rimane schema-valid;
- `npm run lint` passa;
- `npm run build` passa.

---

# Matteo — Intake Reale, Dashboard e Decision Matrix

## Obiettivo

Matteo deve far percepire all'utente che sta usando un vero motore di analisi.

La UI deve smettere di sembrare una demo precompilata e deve mostrare chiaramente:

- cosa è stato estratto dal prodotto;
- quale segmento vince;
- perché quel segmento vince;
- quali alternative sono state scartate;
- quale pilot package proporre;
- quali trust gaps bloccano la vendita.

---

## Task P0 — Da fare subito

### 1. Rendere reale l'intake

Aggiungere o rendere editabili i campi:

- company name;
- product category;
- product description;
- target market fisso su Italy;
- benefits;
- current proof;
- documentation status;
- desired pilot ambition;
- known constraints.

Aggiungere textarea per:

- Chinese documentation text;
- website/product page text;
- technical specs text;
- proof/certification notes;
- case study/ROI/deployment notes.

---

### 2. Mandare il body corretto a `/api/analyze`

La UI deve inviare:

```json
{
  "profile": {},
  "evidence_inputs": {}
}
```

Anche se il backend non è ancora completo, Matteo può già preparare questa struttura.

---

### 3. Aggiornare loading screen

Il loading non deve dire solo che sta “analizzando”.

Deve comunicare gli step del prodotto:

- extracting product evidence;
- scoring Italian buyer segments;
- selecting first pilot wedge;
- assembling pilot package;
- preparing target account shortlist.

---

## Task P1 — Dopo stabilizzazione backend

Aggiungere nella Control Room sezioni in alto:

## Product Evidence Extracted

Mostrare:

- categoria rilevata;
- capabilities;
- processi supportati;
- proof disponibili;
- proof mancanti;
- vincoli;
- confidence score, se disponibile.

## Segment Decision Matrix

Mostrare:

- segmento;
- total score;
- process fit;
- pain intensity;
- pilotability;
- proof readiness;
- sales-cycle practicality;
- support risk;
- tradeoff.

Se il backend non restituisce ancora `segment_scorecards`, derivare una matrix semplificata da:

```txt
buyer_segment_recommendation
buyer_segment_recommendation.alternative_segments
warehouse_process_recommendation
product_summary.available_proof
product_summary.missing_proof
```

## Why This Segment Wins

Mostrare vicino all'inizio:

- perché è il primo wedge migliore;
- perché è più pilotabile delle alternative;
- quale rischio rimane;
- quale proof serve per chiudere il pilot.

---

## File principali Matteo

```txt
src/components/pilot-ops-app.tsx
src/components/screens/intake-screen.tsx
src/components/screens/control-room-screen.tsx
src/components/screens/analysis-loading-screen.tsx
```

File opzionali:

```txt
src/components/dashboard/segment-decision-matrix.tsx
src/components/dashboard/product-evidence-card.tsx
```

---

## Regole importanti per Matteo

Matteo deve evitare di toccare:

```txt
src/app/api/analyze/route.ts
src/lib/openrouter-client.ts
data/
schemas/
```

La sua area è frontend.

La UI non deve promettere:

- scraping live;
- buyer garantiti;
- contatti personali;
- compliance certificata;
- lead esaustivi;
- automazione outreach autonoma.

Il messaggio deve restare:

> first Italian pilot package, not generic market report.

---

## Definition of Done Matteo

Matteo ha finito quando:

- l'utente può incollare documentazione/proof/specs;
- la request include `profile` + `evidence_inputs`;
- la Control Room mostra chiaramente il first market entry wedge;
- la dashboard sembra dinamica, non precompilata;
- la decision matrix è visibile o derivata in modo sicuro;
- la UI funziona anche se il backend usa fallback deterministico;
- `npm run lint` passa;
- `npm run build` passa.

---

# Jacopo — Data Quality, OpenRouter Prompting, QA e Docs

## Obiettivo

Jacopo deve rendere credibile l'intelligenza del prodotto.

Il suo lavoro è assicurarsi che:

- i seed dataset permettano davvero una decisione;
- il prompt OpenRouter non inventi cose;
- la QA dimostri che il prodotto non è hardcoded su AMR/3PL;
- i documenti finali descrivano il comportamento reale, non quello pianificato.

---

## Task P0 — Da fare subito

### 1. Review dei seed data

Controllare:

```txt
data/italian_segments.json
data/warehouse_processes.json
data/trust_gaps.json
data/proof_checklist.json
data/italian_target_accounts.json
```

Verificare che:

- ogni segmento abbia segnali utili allo scoring;
- ogni processo abbia categorie prodotto coerenti;
- `likely_process_fit` sia utile per ranking;
- le categorie target account combacino con i segmenti;
- non ci siano dati personali;
- i source notes siano prudenti.

---

### 2. Preparare QA fixtures

Creare casi manuali per testare almeno:

1. AMR;
2. parcel sorting automation;
3. inventory scanning robot;
4. palletizing automation.

Ogni fixture dovrebbe contenere:

- product category;
- product description;
- proof disponibili;
- proof mancanti;
- vincoli;
- output atteso;
- cosa controllare nella dashboard.

---

## Task P1 — Dopo Francesco

Aggiornare `src/lib/openrouter-client.ts`.

Il prompt deve smettere di essere un generatore AMR/3PL.

Deve comportarsi come decision engine:

- leggere product evidence;
- valutare segment fit;
- valutare process fit;
- produrre trust gaps;
- generare pilot package;
- generare sales pack;
- usare solo target accounts curati.

Il prompt deve vietare esplicitamente:

- compliance certificata se non provata;
- live scraping;
- personal contact harvesting;
- buyer garantiti;
- aziende inventate;
- lead list esaustive;
- claim non supportati.

---

## Task P2 — Fine sprint

Aggiornare i documenti finali:

```txt
docs/ai-pipeline.md
docs/testing-and-evals.md
docs/parallel-implementation-plan.md
```

I docs vanno aggiornati solo dopo l'implementazione reale.

Devono descrivere:

- cosa fa davvero la pipeline;
- cosa è deterministico;
- cosa fa OpenRouter;
- cosa succede se OpenRouter fallisce;
- quali dataset sono usati;
- quali guardrail sono implementate;
- quali test manuali sono passati.

---

## File principali Jacopo

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

## Definition of Done Jacopo

Jacopo ha finito quando:

- il prompt supporta più product categories;
- i seed data sono coerenti con scoring e shortlist;
- i test QA dimostrano che il prodotto non resta bloccato su AMR/3PL;
- nessun output promette certificazioni, contatti, buyer o compliance non verificati;
- i documenti sono aggiornati al comportamento reale;
- `npm run lint` passa;
- `npm run build` passa.

---

# 4. Ordine di integrazione consigliato

## Branch

Da `main` aggiornato:

```bash
git checkout main
git pull --rebase origin main
```

Creare i branch:

```bash
# Francesco
git checkout -b feature/francesco-market-scoring-engine

# Matteo
git checkout -b feature/matteo-intake-decision-matrix

# Jacopo
git checkout -b feature/jacopo-market-data-ai-prompting
```

---

## Merge order consigliato

```txt
1. Francesco -> main
2. Matteo rebase su main -> merge
3. Jacopo rebase su main -> merge
```

Motivo:

- Francesco definisce contratto API e output reale.
- Matteo dipende da quei dati per la dashboard.
- Jacopo aggiorna prompt/docs/QA sul comportamento finale.

---

# 5. Test manuali minimi

Il prodotto può essere considerato davvero dinamico solo se questi test passano.

## Test 1 — Parcel sorting automation

Input:

```txt
Product category: parcel sorting automation
```

Output atteso:

- processo consigliato legato al parcel sorting;
- shortlist coerente con parcel/courier/logistics hub;
- KPI legati a sorting throughput, mis-sort rate, parcels/hour.

---

## Test 2 — Inventory scanning robot

Input:

```txt
Product category: inventory scanning robot
```

Output atteso:

- processo consigliato legato a inventory scanning/cycle counting;
- KPI legati ad accuracy, scan coverage, cycle count time;
- segmenti compatibili con magazzini dove l'inventory accuracy conta.

---

## Test 3 — Missing CE/safety proof

Input:

```txt
CE/safety proof mancante o parziale
```

Output atteso:

- trust gap safety high/critical;
- proof checklist mostra missing proof;
- sales pack non dichiara compliance verificata.

---

## Test 4 — Missing local maintenance

Input:

```txt
No local maintenance partner identified
```

Output atteso:

- trust gap support/local maintenance high;
- mitigation concreta:
  - remote diagnostics;
  - spare parts plan;
  - named local response partner;
  - support SLA.

---

## Test 5 — Strong proof inserted

Input:

```txt
Strong technical specs, Chinese case study, ROI notes, partial CE summary, support plan
```

Output atteso:

- proof readiness migliora;
- alcuni gap diminuiscono;
- confidence/fit migliora, se implementato.

---

## Test 6 — Region preference

Input:

```txt
Region preference: Lombardy oppure Emilia-Romagna
```

Output atteso:

- shortlist boosta aziende in quella regione;
- se non ci sono abbastanza match, mantiene caveat chiaro.

---

# 6. Comandi di verifica per ogni PR

Prima di aprire o aggiornare una PR:

```bash
git status --short
npm run lint
npm run build
```

Se vengono aggiunti test:

```bash
npm test
```

---

# 7. Criteri finali di accettazione demo

La demo è pronta quando:

- l'app parte localmente con `npm run dev`;
- `npm run lint` passa;
- `npm run build` passa;
- l'intake accetta descrizione prodotto e testo evidenze;
- `/api/analyze` risponde anche senza API key;
- con API key, OpenRouter viene tentato ma non è necessario per il funzionamento;
- se OpenRouter fallisce, il fallback deterministico produce comunque un output credibile;
- la dashboard mostra il primo market entry wedge;
- la dashboard mostra segment scores o decision matrix derivata;
- la dashboard spiega perché il segmento scelto batte le alternative;
- la dashboard mostra pilot package, trust gaps, proof checklist, target accounts e sales pack;
- non ci sono claim di scraping live, buyer garantiti, contatti personali o compliance certificata;
- target accounts arrivano solo dal seed dataset curato;
- il messaggio resta: `first Italian pilot package`, non `generic market report`.

---

# 8. Priorità strategica

La priorità non è aggiungere tante feature.

La priorità è far vedere ai giudici un comportamento chiaro:

> Il prodotto prende un profilo reale, legge evidenze, ragiona sui segmenti italiani, sceglie un primo pilot realistico e genera un pacchetto operativo per entrare nel mercato.

Questo è più forte di una dashboard generica perché risponde direttamente ai criteri dell'hackathon:

- chiarezza dell'idea;
- utilità reale;
- execution;
- AI integration;
- pitch quality.

---

# 9. Riassunto finale per il team

## Francesco

Costruisce il motore.

```txt
Input reale -> parser -> scoring -> segment/process/pilot -> PilotAnalysis valido
```

## Matteo

Costruisce l'esperienza utente.

```txt
Intake reale -> evidence text -> decision matrix -> Control Room credibile
```

## Jacopo

Rende il sistema credibile e sicuro.

```txt
Seed data -> prompt guardrails -> QA fixtures -> docs finali
```

Il team lavora in parallelo, ma il merge deve rispettare il contratto API: prima backend, poi UI, poi prompt/docs/QA finali.
