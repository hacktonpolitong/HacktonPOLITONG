# Backend Review - PilotOps AI

## 1. Sintesi

Il backend attuale e' molto piu' solido di un semplice mock: `POST /api/analyze` legge il payload corrente, costruisce un fallback deterministico dinamico, tenta OpenRouter quando la chiave e' presente, valida la risposta e torna al fallback se l'AI live fallisce. La direzione e' corretta per la demo: il prodotto resta utilizzabile senza API esterna e non dipende da scraping live o database esterni.

Il problema principale non e' piu' "non usa l'input". Il backend usa davvero `profile` ed `evidence_inputs`, ma alcune parti della logica sono ancora fragili: l'estrazione di proof e missing proof e' basata su keyword senza gestione robusta delle negazioni, lo scoring non penalizza abbastanza i gap critici, il validator controlla bene la forma ma poco la coerenza semantica, e il payload OpenRouter e' molto grande e duplicato. Questo puo' produrre output formalmente validi ma non sempre abbastanza affidabili o spiegabili.

La priorita' e' rendere il fallback deterministico piu' coerente e auditabile, perche' e' la base stabile della demo e il template che OpenRouter deve rispettare.

## 2. Cosa funziona bene

- `src/app/api/analyze/route.ts` ha una struttura demo-safe: legge il body, crea un fallback locale, tenta OpenRouter solo se configurato, logga gli eventi principali e ritorna sempre una risposta.
- `src/lib/market-entry-engine.ts` non e' un mock statico: combina `profile` ed `evidence_inputs`, classifica la categoria prodotto, seleziona segmento, processo, trust gaps, pilot offer, shortlist, sales pack e piano 7 giorni.
- Il fallback supporta piu' categorie canoniche: AMR, AGV, sorting automation, palletizing automation, picking robot, inventory scanning robot e WMS/orchestration.
- La Target Account Shortlist usa `data/italian_target_accounts.json`, non inventa aziende nel fallback e resta su dati company-level curati.
- `src/lib/pilot-analysis-validation.ts` impedisce abbastanza bene alcuni errori gravi: shape mancante, shortlist sotto 5 account, aziende non presenti nel dataset curato, email, profili LinkedIn personali, scraping e buyer garantiti.
- Il prompt OpenRouter contiene guardrail corretti: niente compliance certificata non provata, niente scraping live, niente personal contact harvesting, niente aziende inventate, niente lead garantiti.
- La metadata distingue `analysis_mode`, `provider`, `model` e `key_source`, quindi possiamo capire se il risultato finale viene da AI live o fallback locale.

## 3. Problemi principali trovati

### Problema 1 - Estrazione proof troppo keyword-based

- Gravita': alta
- File coinvolti: `src/lib/market-entry-engine.ts`
- Punti rilevanti: `detectAvailableProof`, `detectMissingProof`, `proofStatus`, `detectSupportModel`

Descrizione:

La logica considera proof "available" quando trova keyword come `ce/safety`, `support plan`, `local maintenance`, `ROI`, `case study`, `WMS`, anche se il testo dice che quella proof e' mancante o parziale. Esempio: un input tipo "No CE/safety summary available" contiene comunque `CE/safety summary`, quindi rischia di essere trattato come proof disponibile invece che mancante.

Perche' e' un problema:

Questo puo' abbassare trust gaps che dovrebbero restare `high` o `critical`, specialmente su CE/safety, support SLA, local maintenance e ROI. In demo e' pericoloso: l'utente puo' scrivere chiaramente che manca una prova, ma il backend puo' leggerla al contrario.

Suggerimento di fix:

Separare l'estrazione in tre passaggi: `available_proof`, `partial_proof`, `missing_proof`. Prima rilevare pattern negativi come `no`, `missing`, `not available`, `not prepared`, `partial`, `not buyer-ready`; poi solo dopo segnare proof disponibili. Per CE/safety e local maintenance usare regole conservative: se c'e' dubbio, status `partial` o `missing`, mai `available`.

### Problema 2 - Input incompleti vengono riempiti con default demo AMR

- Gravita': alta
- File coinvolti: `src/lib/market-entry-engine.ts`
- Punti rilevanti: `DEFAULT_PROFILE`, `normalizeAnalyzeRequestBody`, `normalizeProductProfile`, `classifyCategory`

Descrizione:

Se l'input e' parziale, i campi mancanti vengono sostituiti con il profilo demo AMR. Questo aiuta la demo precompilata, ma puo' contaminare analisi reali incomplete. Se l'utente manda solo pochi campi, il backend puo' aggiungere product name, description, benefits o constraints AMR e riportare l'analisi verso il caso originale.

Perche' e' un problema:

Il sistema sembra piu' sicuro di quanto sia. Un input incompleto dovrebbe generare bassa confidence e molte assunzioni, non ereditare dettagli AMR che l'utente non ha fornito.

Suggerimento di fix:

Usare il default demo solo quando il body e' vuoto o quando la UI richiede esplicitamente un demo profile. Per input parziali reali, mantenere i campi mancanti vuoti o con fallback neutri, aggiungendo una assumption tipo "product description not provided". La confidence dovrebbe scendere se mancano campi essenziali.

### Problema 3 - Score e confidence non penalizzano abbastanza proof critiche mancanti

- Gravita': alta
- File coinvolti: `src/lib/market-entry-engine.ts`
- Punti rilevanti: `scoreItalianSegments`, `scoreProcess`, `estimateConfidenceScore`

Descrizione:

Lo score segmento usa product-category fit, process match e penalita' proof relativamente leggere. Lo score processo viene quasi tutto dal seed score del processo. La confidence cresce con lunghezza testo, numero di proof rilevate e campi profilo compilati, ma non scende in modo forte quando mancano CE/safety, local maintenance, support SLA o Italian reference.

Perche' e' un problema:

Un output puo' avere score alto e contemporaneamente trust gaps critici. Questo non e' sempre sbagliato, ma deve essere spiegato meglio: "process fit alto, pilot readiness medio/basso". Oggi rischia di sembrare che il prodotto sia molto pronto solo perche' descrizione e categoria sono buone.

Suggerimento di fix:

Separare gli score: `product_process_fit`, `segment_fit`, `proof_readiness`, `support_readiness`, `pilot_feasibility`, `overall_confidence`. L'overall score dovrebbe essere limitato da missing CE/safety o missing support model. Per esempio, se CE/safety e local maintenance sono entrambi mancanti, `confidence_score` non dovrebbe superare una soglia tipo 55-65 anche se il process fit e' alto.

### Problema 4 - OpenRouter payload molto grande e duplicato

- Gravita': media
- File coinvolti: `src/lib/openrouter-client.ts`
- Punti rilevanti: `OPENROUTER_TIMEOUT_MS`, `buildOpenRouterPayload`

Descrizione:

Il payload OpenRouter include seed datasets completi, target accounts dentro `seed_datasets`, target accounts di nuovo dentro `allowed_target_accounts`, e anche il `deterministic_baseline` completo. Questo rende la richiesta pesante e aumenta rischio di timeout, rate limit, costi alti o risposta fragile.

Perche' e' un problema:

Durante i test reali si sono gia' visti timeout e validation failure. Anche quando il modello funziona, il prompt potrebbe essere troppo lungo rispetto al valore aggiunto richiesto: l'AI dovrebbe migliorare ragionamento e copy, non rileggere ogni volta l'intero database target account se il fallback ha gia' una shortlist coerente.

Suggerimento di fix:

Ridurre il payload. Mandare a OpenRouter il request body, il deterministic baseline, le regole di guardrail e solo record seed rilevanti: top segment candidates, selected process candidate, trust gaps candidati, proof checklist sintetica e top 10-15 account prefiltrati dal fallback. Evitare di mandare `allowed_target_accounts` duplicato.

### Problema 5 - Secondary OpenRouter non viene provato dopo validation/consistency failure

- Gravita': media
- File coinvolti: `src/app/api/analyze/route.ts`
- Punti rilevanti: blocco `primaryAttempt.ok`, `normalizePilotAnalysisCandidate`, `getLiveAnalysisConsistencyIssues`, `shouldTrySecondary`

Descrizione:

Il codice prova la secondary key solo quando `primaryAttempt.ok === false`. Se la chiamata primaria risponde HTTP 200 ma genera JSON invalido, schema non valido o output incoerente, `primaryAttempt.ok` resta true e la secondary non viene tentata.

Perche' e' un problema:

Se avete una fallback API key o un provider alternativo, non viene usato proprio nel caso in cui sarebbe piu' utile: risposta AI viva ma inutilizzabile.

Suggerimento di fix:

Distinguere `transport_ok` da `usable_analysis_ok`. Se il primary e' HTTP OK ma fallisce validation o consistency, permettere un secondo tentativo con secondary key o modello alternativo, con log reason `primary_validation_failed` o `primary_consistency_failed`.

### Problema 6 - Validator forte sulla forma, debole sulla semantica

- Gravita': media
- File coinvolti: `src/lib/pilot-analysis-validation.ts`, `src/app/api/analyze/route.ts`
- Punti rilevanti: `hasUsableAnalysisShape`, `hasProductEvidenceProfile`, `hasWarehouseProcess`, `hasTargetAccountShortlist`, `getLiveAnalysisConsistencyIssues`

Descrizione:

Il validator controlla bene che i campi esistano e che gli account siano nel dataset curato. Pero' controlla poco la coerenza tra categoria, processo, KPI, segmento e shortlist. Per esempio, un output AI con categoria `sorting automation` e KPI da inventory scanning potrebbe passare se la shape e' valida e la categoria coincide con il fallback.

Perche' e' un problema:

Il rischio maggiore non e' solo JSON invalido. Il rischio e' JSON valido ma semanticamente sbagliato, quindi dashboard apparentemente professionale ma logicamente incoerente.

Suggerimento di fix:

Aggiungere semantic validation leggera: categoria -> processi ammessi, processo -> KPI attesi, segmento -> logistics_category attesa, shortlist -> almeno una corrispondenza `likely_process_fit`, trust gaps -> proof checklist status coerenti. Se fallisce, usare fallback o normalizzare sezioni specifiche.

### Problema 7 - Target account ranking ancora poco spiegabile

- Gravita': media
- File coinvolti: `src/lib/market-entry-engine.ts`, `data/italian_target_accounts.json`
- Punti rilevanti: `findTargetAccounts`

Descrizione:

Il ranking filtra principalmente per `logistics_category`, poi aggiunge boost se `likely_process_fit` include il processo e se `hq_region` corrisponde. I `warehouse_signals` vengono valutati solo come numero di segnali, non come match semantico con il processo. Inoltre l'output non contiene un fit score account-level o una reason generata dal ranking, ma solo `outreach_angle` gia' presente nel dataset.

Perche' e' un problema:

La shortlist puo' essere corretta, ma non sempre spiega perche' quell'account e' sopra un altro. In categorie dove tutti gli account hanno gli stessi `likely_process_fit`, il ranking diventa quasi statico.

Suggerimento di fix:

Aggiungere un ranking interno piu' trasparente: `category_match`, `process_match`, `region_match`, `signal_match`, `fit_reason`. Non serve cambiare UI subito; si puo' usare metadata/assumptions o arricchire il backend per preparare il prossimo schema.

### Problema 8 - WMS/orchestration e software-only use case sono meno coperti

- Gravita': bassa/media
- File coinvolti: `src/lib/market-entry-engine.ts`, `data/trust_gaps.json`, `data/warehouse_processes.json`

Descrizione:

Il sistema supporta `WMS/orchestration`, ma molti trust gaps e processi sono ancora pensati per hardware fisico. Il WMS ha integrazione e dati, ma rischi come data security, change management, master data quality, IT ownership e implementation scope sono meno centrali rispetto a safety/maintenance.

Perche' e' un problema:

Se un vendor inserisce un prodotto software, il sistema puo' ancora produrre output utile, ma meno profondo e piu' hardware-oriented.

Suggerimento di fix:

Creare trust gaps specifici per software/orchestration: data access, cybersecurity review, WMS ownership, API readiness, master data quality, rollout governance. Aggiungere process recommendations piu' software-friendly.

## 4. Rischi nascosti

- Demo con input incompleto: il fallback potrebbe sembrare piu' intelligente di quanto sia perche' riempie campi mancanti con il profilo demo.
- Demo con proof negative: frasi come "no CE/safety summary" o "no support plan" possono essere lette come keyword positive.
- Demo con OpenRouter attivo: il modello puo' rispondere in modo valido ma lento; se supera il timeout, la UI riceve fallback dopo una lunga attesa.
- Demo con OpenRouter quasi valido: se l'AI restituisce shape quasi corretta ma non accettata, il sistema torna al fallback senza tentare la secondary key.
- Produzione futura: il validator blocca qualunque email, anche generica e pubblica; oggi va bene per sicurezza, ma potrebbe essere troppo restrittivo se in futuro si vuole mostrare `info@company.com`.
- Produzione futura: target account dataset con aziende reali richiede manutenzione; la shortlist e' credibile solo finche' `source_note`, categoria e warehouse signals restano aggiornati.
- Prompt drift: OpenRouter riceve baseline + dataset completo + istruzioni lunghe; modelli diversi potrebbero ottimizzare parti diverse e produrre JSON formalmente valido ma con copy meno coerente.

## 5. Casi limite da testare

### Caso 1 - CE/safety esplicitamente mancante

- Input: "CE/safety summary not available; buyer-ready safety file missing."
- Output atteso: CE/safety in proof checklist `missing`; trust gap `Incomplete CE/safety evidence` `critical`; sales pack non parla di compliance.
- Possibile failure mode: keyword `CE/safety summary` viene trattata come proof disponibile.
- File/logica da osservare: `detectAvailableProof`, `detectMissingProof`, `proofStatus`, `analyzeTrustGaps`.

### Caso 2 - Local maintenance negata

- Input: "No local maintenance partner identified; spare parts plan not prepared."
- Output atteso: local maintenance/spare parts gap `high`; support SLA o maintenance plan `missing`.
- Possibile failure mode: keyword `local maintenance` o `spare parts` viene letta come support proof disponibile.
- File/logica da osservare: `detectAvailableProof`, `detectSupportModel`, `proofStatus`.

### Caso 3 - Parcel sorting con prova tecnica forte ma safety parziale

- Input: sorting automation per courier depot, throughput test disponibile, CE/safety partial, weekend installation required.
- Output atteso: segmento parcel/sorting, processo parcel sorting, KPI parcels/hour/mis-sort/lane uptime, gap su safety e installation disruption.
- Possibile failure mode: score molto alto anche se safety e installazione sono ancora bloccanti.
- File/logica da osservare: `scoreItalianSegments`, `scoreProcess`, `estimateConfidenceScore`, `analyzeTrustGaps`.

### Caso 4 - Inventory scanning robot con data security mancante

- Input: inventory scanning robot, barcode/RFID scanning, no data security summary, no Italian reference.
- Output atteso: segmento retail/pharma/manufacturing, processo inventory scanning, KPI scan coverage/inventory accuracy/cycle-count time, gap data/security o IT review.
- Possibile failure mode: data security resta solo checklist, non emerge abbastanza nei top trust gaps.
- File/logica da osservare: `data/proof_checklist.json`, `data/trust_gaps.json`, `analyzeTrustGaps`.

### Caso 5 - Palletizing automation con spazio e safety vincolanti

- Input: robotic palletizing cell for food dispatch, needs guarding, limited end-of-line space, CE partial.
- Output atteso: food/manufacturing, pallet movement/end-of-line palletizing, safety and installation risk high, pilot scoped to one line/SKU family.
- Possibile failure mode: process recommendation diventa generic pallet movement senza spiegare abbastanza end-of-line constraints.
- File/logica da osservare: `inferUseCase`, `selectWarehouseProcess`, `generatePilotPackage`.

### Caso 6 - AGV per pallet movement con keyword AMR presenti

- Input: "AGV/AMR hybrid vehicle for pallet movement and line-side replenishment."
- Output atteso: categoria scelta in modo spiegabile, probabilmente AGV se il pallet/line-side use case domina.
- Possibile failure mode: classificazione dipende troppo dall'ordine delle keyword o default AMR.
- File/logica da osservare: `classifyCategory`, `CATEGORY_PROCESS_WEIGHTS`, `CATEGORY_SEGMENT_WEIGHTS`.

### Caso 7 - WMS/orchestration software-only

- Input: software for warehouse task orchestration, no robots, API integration, dashboard, no hardware.
- Output atteso: categoria WMS/orchestration, processo workflow optimization/integration-heavy, trust gaps su data access, API, data security, ownership, rollout governance.
- Possibile failure mode: output troppo hardware-oriented con safety/maintenance non pertinenti.
- File/logica da osservare: `data/trust_gaps.json`, `detectInfrastructureNeeds`, `detectIntegrationNeeds`.

### Caso 8 - Long evidence input

- Input: documentazione lunga incollata in tutti i campi `evidence_inputs`.
- Output atteso: fallback veloce; OpenRouter non deve bloccare indefinitamente; timeout loggato e fallback sicuro.
- Possibile failure mode: prompt troppo grande, timeout, risposta AI validata male, esperienza lenta.
- File/logica da osservare: `OPENROUTER_TIMEOUT_MS`, `buildOpenRouterPayload`, route logs.

### Caso 9 - AI live restituisce account curato ma processo incoerente

- Input: parcel sorting automation.
- Output atteso: account parcel/courier, processo parcel sorting, KPI parcel-specific.
- Possibile failure mode: validator accetta account curati ma processo o KPI non coerenti con categoria.
- File/logica da osservare: `hasWarehouseProcess`, `hasTargetAccountShortlist`, `getLiveAnalysisConsistencyIssues`.

### Caso 10 - Region preference esplicita

- Input: "Prefer first pilot in Lombardy or Emilia-Romagna."
- Output atteso: shortlist boosta account in quelle regioni, ma non forza aziende incoerenti.
- Possibile failure mode: region boost domina troppo o non viene spiegato.
- File/logica da osservare: `normalizeRegionPreference`, `findTargetAccounts`.

## 6. Raccomandazioni tecniche

1. Rendere proof extraction negation-aware. Prima riconoscere "missing/partial/not available/no local/not buyer-ready", poi riconoscere proof disponibili.
2. Separare demo default da real fallback. Il profilo AMR demo deve essere usato solo quando l'utente parte dal caso demo, non come riempitivo silenzioso per input incompleti.
3. Aggiungere score componentizzati. Non basta `fit_score`: servono almeno process fit, proof readiness, support readiness e confidence separati internamente.
4. Applicare cap di confidence. Missing CE/safety e missing local support dovrebbero limitare confidence anche con descrizione lunga.
5. Alleggerire OpenRouter. Passare solo dati prefiltrati dal fallback e togliere duplicazione target accounts.
6. Ritentare secondary su validation/consistency failure, non solo su HTTP/network failure.
7. Aggiungere semantic validation. Controllare mapping category -> process -> KPI -> segment -> shortlist.
8. Rafforzare WMS/orchestration. Aggiungere trust gaps software-specific su data access, cybersecurity, ownership e rollout governance.
9. Rendere target ranking spiegabile. Calcolare internamente breakdown o reason account-level, anche se la UI non lo mostra subito.
10. Aggiungere fixture backend automatizzabili. Le quattro fixture in `docs/testing-and-evals.md` sono buone; il prossimo passo e' trasformarle in uno script che chiama il deterministic engine e controlla categoria/processo/segmento/trust gaps.

## 7. Priorita'

### P0 - Da correggere subito

- Fixare estrazione proof negativa/parziale per CE/safety, support SLA, local maintenance, spare parts, ROI e Italian reference.
- Evitare che input parziali reali vengano riempiti con dettagli demo AMR non forniti dall'utente.
- Collegare confidence e readiness ai gap critici: missing CE/safety e missing local maintenance devono abbassare confidence o almeno limitare l'overall fit.
- Aggiungere semantic checks minimi per live AI: categoria/processo/KPI/shortlist devono essere coerenti prima di accettare `live_ai_returned`.

### P1 - Importante ma non bloccante

- Ridurre payload OpenRouter e mandare solo seed records rilevanti.
- Ritentare secondary provider/key quando il primary risponde ma fallisce validation o consistency.
- Aggiungere ranking breakdown per target accounts.
- Espandere WMS/orchestration con trust gaps e processi software-specific.
- Rendere i log di validation failure piu' azionabili, per esempio includendo quale sezione ha fallito e se era shape o semantic issue.

### P2 - Miglioramenti futuri

- Creare eval script automatico per le fixture di AMR, parcel sorting, inventory scanning e palletizing.
- Versionare i dataset in modo piu' granulare, inclusa versione per `italian_target_accounts`.
- Aggiungere supporto opzionale a cited research solo come evidenza separata, senza cambiare la base curated/no-scraping della demo.
- Valutare un JSON Schema strict o structured-output provider-specific per ridurre validation failures da OpenRouter.

## 8. Checklist finale

- [ ] Il backend usa `profile` e `evidence_inputs` del payload corrente.
- [ ] Il fallback deterministico cambia categoria, segmento, processo e KPI quando cambia il prodotto.
- [ ] Un input senza API key ritorna `analysis_mode: deterministic_fallback`.
- [ ] Un output OpenRouter valido ritorna `analysis_mode: live_ai`.
- [ ] Timeout, 403, 429, invalid JSON e validation failure sono loggati con reason chiara.
- [ ] Missing CE/safety genera trust gap `critical` o almeno `high`.
- [ ] Missing local maintenance/spare parts genera trust gap `high`.
- [ ] Missing Italian reference resta visibile nei trust gaps o nella proof checklist.
- [ ] Missing ROI localizzato abbassa readiness o resta nel proof checklist.
- [ ] Score alto di process fit non nasconde proof readiness bassa.
- [ ] Categoria sorting automation genera processo parcel sorting e KPI parcel-specific.
- [ ] Categoria inventory scanning robot genera processo inventory scanning e KPI scan/accuracy/cycle-count.
- [ ] Categoria palletizing automation genera food/manufacturing o pallet movement/end-of-line flow.
- [ ] Categoria WMS/orchestration non produce output hardware-only.
- [ ] Target accounts vengono solo da `data/italian_target_accounts.json`.
- [ ] Shortlist non include contatti personali, LinkedIn personali, telefoni privati o buyer garantiti.
- [ ] Validator blocca aziende inventate.
- [ ] Validator controlla anche coerenza semantica minima, non solo shape.
- [ ] Sales pack cita i trust gaps principali e non promette certificazioni o ROI non provati.
- [ ] L'output finale resta una first-pilot package, non un market report generico.

## Criteri di accettazione

- Il backend usa davvero l'input corrente? Si', il fallback legge `profile` ed `evidence_inputs`, ma va ridotto il rischio di default demo su input parziali.
- Il fallback e' dinamico o statico? Dinamico, con classificazione e scoring reali, ma ancora keyword-based e da rafforzare sui proof gap.
- OpenRouter fallisce in modo sicuro? Si', il fallback e' sicuro; pero' secondary non viene provata dopo validation/consistency failure e il payload e' pesante.
- Il validator scarta output giusti o lascia passare output sbagliati? Entrambi sono possibili: puo' scartare output quasi validi per shape rigida e puo' lasciare passare output semanticamente incoerenti.
- Lo scoring e' spiegabile? Parzialmente. Esistono scorecard e ragioni, ma manca un breakdown di proof readiness/support readiness e cap di confidence.
- Le categorie non-AMR funzionano? Si' per i casi principali previsti, ma WMS/orchestration e input ibridi sono meno robusti.
- Target accounts sono coerenti e curati? Si', sono curati e company-level; il ranking pero' puo' diventare statico dentro categorie con process fit uguale.
- Trust gaps influenzano davvero output e score? Influenzano proof checklist, pilot proof e in parte segment score; non influenzano abbastanza confidence e process fit.
- L'output finale e' internamente coerente? Nel fallback in genere si', ma manca semantic validation forte per garantire coerenza quando entra OpenRouter.
- Si puo' migliorare senza cambiare UI? Si'. Tutti i fix prioritari sono backend-only: parser proof, scoring, semantic validator, OpenRouter payload/retry e target ranking.
