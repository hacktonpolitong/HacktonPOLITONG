# Fictional Test Company - Hangzhou ScanBridge Robotics

Use this folder to test whether PilotOps AI analyzes a non-AMR product correctly.

The company and product are fictional. Do not treat any customer, metric, certification, or deployment note as real.

## Product Intake Fields

Company name:

```text
Hangzhou ScanBridge Robotics
```

Product name:

```text
SB-Inspect 200 Inventory Scanning Robot
```

Product category:

```text
inventory scanning robot
```

Target market:

```text
Italy
```

Product description:

```text
SB-Inspect 200 is an autonomous inventory scanning robot for high-SKU warehouses. It drives through selected aisles during low-traffic windows, scans barcode shelf labels and bin locations, compares scan results against exported WMS inventory data, and produces an exception list for buyer review before stock records are updated.
```

Operational benefits:

```text
Improve inventory accuracy in selected aisles
Reduce manual cycle-counting hours
Increase scan coverage during night or low-traffic windows
Detect missing, misplaced, or unreadable labels before peak operations
Start with a report-only pilot before changing official inventory records
```

Proof available:

```text
Technical specifications
Barcode scanning test summary
Chinese retail warehouse demo summary
CSV export workflow outline
Fleet dashboard screenshots
```

Documentation status:

```text
Technical specifications and a barcode scanning test summary are available. CE/safety evidence is partial and not yet packaged for Italian buyer review. Data security summary is missing. Italian reference customer is missing. Local maintenance partner and localized ROI model are not prepared.
```

Pilot ambition:

```text
Win a 30-day report-only inventory scanning pilot in one Italian retail, pharma, or industrial distribution warehouse zone.
```

Known constraints:

```text
No Italian reference customer
Partial CE/safety summary only
No local maintenance partner identified
No localized ROI model
Data security summary not prepared
Requires readable barcode labels and Wi-Fi coverage
Official stock records should not be changed automatically during the first pilot
```

## Evidence Inputs

Use these files in the matching evidence input fields:

- `01_chinese_documentation.txt` -> Chinese documentation text
- `02_website_product_page.txt` -> Website/product page text
- `03_technical_specs.txt` -> Technical specs text
- `04_proof_certification_notes.txt` -> Proof/certification notes
- `05_case_study_roi_deployment_notes.txt` -> Case study/ROI/deployment notes

## Expected Output

The dashboard should not return the AMR/3PL internal transport demo.

Expected behavior:

- Product category: inventory scanning robot
- Recommended process: inventory scanning
- Likely buyer segment: retail logistics, pharma logistics, or manufacturing warehouses
- KPIs: scan coverage, inventory accuracy, cycle-count time, exception resolution time, data sync success rate
- Trust gaps: CE/safety evidence, data security summary, Italian reference, local maintenance, localized ROI model
- Pilot shape: one aisle group or SKU category, report-only output, buyer review before stock updates
- Target Account Shortlist: retail, pharma, or manufacturing accounts with inventory scanning fit
