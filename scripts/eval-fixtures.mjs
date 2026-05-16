/* global process, console, fetch, setTimeout, clearTimeout */

import { spawn, spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";

const PORT = Number(process.env.PILOTOPS_EVAL_PORT ?? 3210);
const BASE_URL = `http://127.0.0.1:${PORT}`;
const schemaOnly = process.argv.includes("--schema-only");
const serverReadyTimeoutMs = 30_000;

const fixtures = [
  {
    name: "AMR internal transport",
    body: {
      profile: {
        companyName: "Shenzhen Northstar Mobility",
        productCategory: "AMR",
        targetMarket: "Italy",
        description:
          "Autonomous mobile robot for moving totes, cartons, and small carts between picking, packing, and dispatch staging zones.",
        benefits: ["Reduce manual walking time", "Deploy in one bounded route", "Avoid fixed conveyor redesign"],
        currentProof: ["Technical specifications", "API summary", "Chinese fulfilment workflow case outline"],
        documentationStatus:
          "CE/safety summary partial; Italian reference missing; local maintenance model missing; ROI model not localized.",
        pilotAmbition: "Win a 45-day pilot with a mid-size Italian 3PL or e-commerce fulfilment warehouse.",
        constraints: [
          "No Italian reference customer",
          "No local maintenance partner identified",
          "WMS integration should start with tablet dispatch or CSV import"
        ]
      },
      evidence_inputs: {
        chinese_documentation_text:
          "AMR fleet has been used for tote movement between picking and packing in Chinese fulfilment operations.",
        website_product_text: "SLAM navigation AMR for internal warehouse transport with fleet dashboard and obstacle detection.",
        technical_specs_text: "Payload 300 kg, max speed 1.6 m/s, battery runtime 10 hours, Wi-Fi, REST API, CSV task import.",
        proof_certification_notes: "Partial CE/safety summary available; buyer-ready risk assessment not prepared.",
        case_study_roi_notes: "Chinese case outline available; Italian ROI assumptions still missing."
      }
    },
    expect: {
      category: "AMR",
      processIncludes: "internal transport",
      accountCategories: ["3PL and e-commerce fulfilment", "Retail logistics and fashion distribution"]
    }
  },
  {
    name: "Parcel sorting automation",
    body: {
      profile: {
        companyName: "Guangzhou SortLine Automation",
        productCategory: "sorting automation",
        targetMarket: "Italy",
        description: "Modular parcel sorter for courier depots handling mixed small parcels, e-commerce parcels, and returns.",
        benefits: ["Increase parcels per hour", "Reduce manual sorting errors", "Add modular sorting lanes"],
        currentProof: ["Technical specifications", "Chinese parcel hub case study", "Throughput test video"],
        documentationStatus:
          "CE/safety summary partial; barcode/WMS integration notes partial; Italian reference missing; maintenance plan missing.",
        pilotAmbition: "Pilot one parcel sorting lane in an Italian courier depot.",
        constraints: ["Requires conveyor interface", "Needs barcode scan integration", "Installation can only occur over a weekend"]
      },
      evidence_inputs: {
        chinese_documentation_text: "Sorter deployed in Chinese parcel hub for mixed parcel and returns flow.",
        website_product_text: "Modular sortation system for courier depots and e-commerce parcel operations.",
        technical_specs_text: "Lane-based sorter, barcode scan handoff, modular diverts, weekend installation option.",
        proof_certification_notes: "Partial safety file; CE/safety summary not yet buyer-ready for Italy.",
        case_study_roi_notes: "Throughput video available; Italian labor and mis-sort baseline not yet localized."
      }
    },
    expect: {
      category: "sorting automation",
      processIncludes: "parcel sorting",
      accountCategories: ["Parcel, courier, and sorting operations"]
    }
  },
  {
    name: "Inventory scanning robot",
    body: {
      profile: {
        companyName: "Hangzhou ScanFleet Robotics",
        productCategory: "inventory scanning robot",
        targetMarket: "Italy",
        description: "Autonomous inventory scanning robot for barcode and shelf-location checks in high-SKU warehouses.",
        benefits: ["Improve inventory accuracy", "Reduce manual cycle count time", "Increase scan coverage outside peak shifts"],
        currentProof: ["Technical specifications", "Scanning accuracy test report", "Chinese retail warehouse case summary"],
        documentationStatus:
          "CE/safety evidence partial; data security summary missing; Italian reference missing; local support model missing.",
        pilotAmbition: "Pilot autonomous cycle counting in one Italian retail, pharma, or manufacturing warehouse zone.",
        constraints: ["Needs barcode visibility", "Requires Wi-Fi coverage", "Must avoid interfering with picking operations"]
      },
      evidence_inputs: {
        chinese_documentation_text:
          "Robot used for night-shift cycle counting and barcode scan coverage in Chinese retail warehouses.",
        website_product_text: "Inventory scanning robot for barcode checks, location verification, and cycle-count automation.",
        technical_specs_text: "Autonomous navigation, barcode camera, scan logs, dashboard export, Wi-Fi connectivity.",
        proof_certification_notes: "Partial safety summary; data handling and IT security note not ready.",
        case_study_roi_notes: "Chinese case claims faster cycle counts; Italian accuracy and labor baseline missing."
      }
    },
    expect: {
      category: "inventory scanning robot",
      processIncludes: "inventory scanning",
      accountCategories: [
        "Retail logistics and fashion distribution",
        "Pharma logistics",
        "Manufacturing and industrial distribution"
      ]
    }
  },
  {
    name: "Palletizing automation",
    body: {
      profile: {
        companyName: "Suzhou PalletFlex Robotics",
        productCategory: "palletizing automation",
        targetMarket: "Italy",
        description: "Robotic palletizing cell for boxed beverage and packaged food warehouse dispatch lines.",
        benefits: ["Reduce manual lifting", "Improve pallet consistency", "Support repetitive end-of-line flows"],
        currentProof: ["Technical specifications", "Safety enclosure design", "Chinese food factory case study"],
        documentationStatus: "CE/safety summary partial; installation plan available; Italian reference missing; ROI model partial.",
        pilotAmbition: "Pilot one palletizing cell after packing for a food and beverage warehouse or manufacturing site.",
        constraints: ["Needs end-of-line space", "Requires safety fencing", "Must avoid disruption to dispatch"]
      },
      evidence_inputs: {
        chinese_documentation_text: "Palletizing cell used for boxed beverage end-of-line handling in Chinese food manufacturing.",
        website_product_text: "Robotic palletizing cell for repetitive cartons, cases, and boxed product flows.",
        technical_specs_text: "Safety enclosure, gripper options, pallet pattern configuration, end-of-line footprint.",
        proof_certification_notes: "Safety enclosure design available; CE/safety summary still partial for buyer review.",
        case_study_roi_notes: "Chinese case study available; Italian manual-lift reduction and dispatch baseline incomplete."
      }
    },
    expect: {
      category: "palletizing automation",
      processIncludes: "pallet",
      accountCategories: ["Food and beverage logistics", "Manufacturing and industrial distribution"]
    }
  },
  {
    name: "Strong proof inserted",
    body: {
      profile: {
        companyName: "Ningbo ProofReady Robotics",
        productCategory: "AMR",
        targetMarket: "Italy",
        description: "Autonomous mobile robot for moving totes between picking, packing, and dispatch staging zones.",
        benefits: ["Reduce walking time", "Improve dispatch staging reliability"],
        currentProof: [
          "Technical specifications",
          "CE and safety summary",
          "case study evidence",
          "ROI model with Italian assumptions",
          "support SLA",
          "maintenance plan and spare parts",
          "WMS integration workflow"
        ],
        documentationStatus:
          "Technical specs, CE and safety summary, Chinese case study, localized ROI assumptions, WMS integration workflow, support SLA, and maintenance partner plan are available.",
        pilotAmbition: "Win a bounded Italian internal transport pilot.",
        constraints: ["Pilot must start with a one-route workflow"]
      },
      evidence_inputs: {
        technical_specs_text: "Payload 300 kg, Wi-Fi, REST API, CSV task import, charging station and mapped route.",
        proof_certification_notes:
          "CE and safety summary available for buyer review. Local maintenance partner, support SLA and spare parts plan prepared.",
        case_study_roi_notes:
          "Chinese fulfilment case study and Italian ROI model with walking-time baseline and payback assumptions are available."
      }
    },
    expect: {
      category: "AMR",
      processIncludes: "internal transport",
      maxMissingProofCount: 5
    }
  },
  {
    name: "Region preference Lombardy",
    body: {
      profile: {
        companyName: "Shanghai RegionPilot Automation",
        productCategory: "inventory scanning robot",
        targetMarket: "Italy",
        description: "Autonomous inventory scanning robot for barcode and shelf-location checks in high-SKU warehouses.",
        benefits: ["Improve inventory accuracy", "Reduce manual cycle count time"],
        currentProof: ["Technical specifications", "Scanning accuracy test report"],
        documentationStatus: "CE/safety evidence partial; local support model missing.",
        pilotAmbition: "Pilot inventory scanning in Lombardy.",
        constraints: ["Region preference: Lombardy"]
      },
      evidence_inputs: {
        region_preference: "Lombardy",
        website_product_text: "Inventory scanning robot for cycle-count automation in retail and pharma warehouses.",
        technical_specs_text: "Autonomous navigation, barcode camera, scan logs, dashboard export.",
        proof_certification_notes: "Partial CE/safety summary available."
      }
    },
    expect: {
      category: "inventory scanning robot",
      processIncludes: "inventory scanning",
      preferredRegion: "Lombardy"
    }
  }
];

let serverProcess;
let exitCode = 0;

try {
  const schema = JSON.parse(await readFile("schemas/pilot_analysis.schema.json", "utf8"));
  serverProcess = startDevServer();
  await waitForServer();

  const results = [];

  for (const fixture of fixtures) {
    const analysis = await postAnalyze(fixture.body);
    const schemaErrors = validateAgainstSchema(analysis, schema, "analysis");

    if (schemaErrors.length > 0) {
      throw new Error(`${fixture.name} failed schema validation:\n${schemaErrors.slice(0, 12).join("\n")}`);
    }

    if (!schemaOnly) {
      assertFixtureExpectations(fixture, analysis);
    }

    results.push(formatResult(fixture.name, analysis));
  }

  console.log(schemaOnly ? "Schema validation passed for all fixtures." : "Fixture evals passed.");
  for (const result of results) {
    console.log(result);
  }
} catch (error) {
  exitCode = 1;
  console.error(error instanceof Error ? error.message : error);
} finally {
  await stopDevServer(serverProcess);
  process.exit(exitCode);
}

function startDevServer() {
  const command = process.platform === "win32" ? process.env.ComSpec || "cmd.exe" : "npm";
  const args =
    process.platform === "win32"
      ? ["/d", "/s", "/c", `npm.cmd run dev -- --port ${PORT}`]
      : ["run", "dev", "--", "--port", String(PORT)];
  const child = spawn(command, args, {
    env: sanitizeEnv({
      ...process.env,
      PILOTOPS_FORCE_LOCAL_ENGINE: "1",
      OPENROUTER_API_KEY: "",
      OPENROUTER_FALLBACK_API_KEY: ""
    }),
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"]
  });

  child.stdout.on("data", (chunk) => {
    if (process.env.PILOTOPS_EVAL_VERBOSE === "1") {
      process.stdout.write(chunk);
    }
  });
  child.stderr.on("data", (chunk) => {
    if (process.env.PILOTOPS_EVAL_VERBOSE === "1") {
      process.stderr.write(chunk);
    }
  });

  return child;
}

function sanitizeEnv(env) {
  return Object.fromEntries(
    Object.entries(env).filter((entry) => typeof entry[1] === "string")
  );
}

async function waitForServer() {
  const startedAt = Date.now();

  while (Date.now() - startedAt < serverReadyTimeoutMs) {
    try {
      const response = await fetch(BASE_URL);
      if (response.ok) {
        return;
      }
    } catch {
      // Keep polling until Next is ready.
    }

    await sleep(500);
  }

  throw new Error(`Timed out waiting for ${BASE_URL}`);
}

async function postAnalyze(body) {
  const response = await fetch(`${BASE_URL}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`POST /api/analyze failed with HTTP ${response.status}`);
  }

  return response.json();
}

function assertFixtureExpectations(fixture, analysis) {
  assertEqual(analysis.metadata.analysis_mode, "deterministic_fallback", fixture.name, "analysis mode");
  assertEqual(analysis.metadata.provider, "local", fixture.name, "provider");
  assertEqual(analysis.product_summary.target_market, "Italy", fixture.name, "target market");
  assertEqual(analysis.product_summary.product_category, fixture.expect.category, fixture.name, "product category");
  assertIncludes(
    analysis.warehouse_process_recommendation.process_name,
    fixture.expect.processIncludes,
    fixture.name,
    "warehouse process"
  );
  assertSafetyGuardrails(analysis, fixture.name);

  if (fixture.expect.accountCategories) {
    const accountCategories = new Set(
      analysis.target_account_shortlist.slice(0, 5).map((account) => account.logistics_category)
    );
    const hasExpectedAccountCategory = fixture.expect.accountCategories.some((category) => accountCategories.has(category));
    if (!hasExpectedAccountCategory) {
      throw new Error(
        `${fixture.name}: expected one of account categories ${fixture.expect.accountCategories.join(", ")}, got ${[
          ...accountCategories
        ].join(", ")}`
      );
    }
  }

  if (fixture.expect.maxMissingProofCount !== undefined) {
    const missingCount = analysis.product_summary.missing_proof.length;
    if (missingCount > fixture.expect.maxMissingProofCount) {
      throw new Error(`${fixture.name}: expected <= ${fixture.expect.maxMissingProofCount} missing proof items, got ${missingCount}`);
    }
  }

  if (fixture.expect.preferredRegion) {
    const [firstAccount] = analysis.target_account_shortlist;
    assertEqual(firstAccount.hq_region, fixture.expect.preferredRegion, fixture.name, "top account region");
  }
}

function assertSafetyGuardrails(analysis, fixtureName) {
  const serialized = JSON.stringify(analysis);
  const blockedPatterns = [
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
    /linkedin\.com\/in\//i,
    /live[-\s]?scrap/i,
    /scraped\s+lead/i,
    /guaranteed\s+(buyer|lead|sale|reply)/i,
    /certif(y|ied|ication)\s+(compliance|complete|confirmed|guaranteed)/i
  ];
  const matchingPattern = blockedPatterns.find((pattern) => pattern.test(serialized));

  if (matchingPattern) {
    throw new Error(`${fixtureName}: blocked safety pattern found: ${matchingPattern}`);
  }

  const hasHighSafetyGap = analysis.trust_gaps.some(
    (gap) => /safety|ce/i.test(gap.title) && ["high", "critical"].includes(gap.risk_level)
  );
  const hasHighSupportGap = analysis.trust_gaps.some(
    (gap) => /maintenance|spare parts|support/i.test(gap.title) && ["high", "critical"].includes(gap.risk_level)
  );

  if (!hasHighSafetyGap && analysis.product_summary.missing_proof.some((proof) => /ce|safety/i.test(proof))) {
    throw new Error(`${fixtureName}: missing CE/safety proof did not produce a high or critical safety gap`);
  }

  if (!hasHighSupportGap && analysis.product_summary.missing_proof.some((proof) => /support|maintenance|spare/i.test(proof))) {
    throw new Error(`${fixtureName}: missing support proof did not produce a high or critical support gap`);
  }
}

function validateAgainstSchema(value, schema, path) {
  const errors = [];
  const types = Array.isArray(schema.type) ? schema.type : schema.type ? [schema.type] : [];

  if (schema.const !== undefined && value !== schema.const) {
    errors.push(`${path}: expected const ${JSON.stringify(schema.const)}, got ${JSON.stringify(value)}`);
    return errors;
  }

  if (schema.enum && !schema.enum.includes(value)) {
    errors.push(`${path}: expected one of ${schema.enum.join(", ")}, got ${JSON.stringify(value)}`);
    return errors;
  }

  if (types.length > 0 && !types.some((type) => matchesType(value, type))) {
    errors.push(`${path}: expected type ${types.join("|")}, got ${Array.isArray(value) ? "array" : typeof value}`);
    return errors;
  }

  if (typeof value === "number") {
    if (schema.minimum !== undefined && value < schema.minimum) {
      errors.push(`${path}: expected >= ${schema.minimum}, got ${value}`);
    }
    if (schema.maximum !== undefined && value > schema.maximum) {
      errors.push(`${path}: expected <= ${schema.maximum}, got ${value}`);
    }
  }

  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      errors.push(`${path}: expected at least ${schema.minItems} items, got ${value.length}`);
    }
    if (schema.maxItems !== undefined && value.length > schema.maxItems) {
      errors.push(`${path}: expected at most ${schema.maxItems} items, got ${value.length}`);
    }
    if (schema.items) {
      value.forEach((item, index) => {
        errors.push(...validateAgainstSchema(item, schema.items, `${path}[${index}]`));
      });
    }
  }

  if (isPlainObject(value)) {
    const required = schema.required ?? [];
    for (const key of required) {
      if (!(key in value)) {
        errors.push(`${path}: missing required property ${key}`);
      }
    }

    if (schema.additionalProperties === false && schema.properties) {
      for (const key of Object.keys(value)) {
        if (!(key in schema.properties)) {
          errors.push(`${path}.${key}: unexpected additional property`);
        }
      }
    }

    for (const [key, propertySchema] of Object.entries(schema.properties ?? {})) {
      if (key in value) {
        errors.push(...validateAgainstSchema(value[key], propertySchema, `${path}.${key}`));
      }
    }
  }

  return errors;
}

function matchesType(value, type) {
  if (type === "array") {
    return Array.isArray(value);
  }
  if (type === "integer") {
    return Number.isInteger(value);
  }
  if (type === "null") {
    return value === null;
  }
  if (type === "object") {
    return isPlainObject(value);
  }

  return typeof value === type;
}

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertEqual(actual, expected, fixtureName, fieldName) {
  if (actual !== expected) {
    throw new Error(`${fixtureName}: expected ${fieldName} ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function assertIncludes(actual, expected, fixtureName, fieldName) {
  if (!String(actual).toLowerCase().includes(String(expected).toLowerCase())) {
    throw new Error(`${fixtureName}: expected ${fieldName} to include ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function formatResult(name, analysis) {
  const accountCategories = [...new Set(analysis.target_account_shortlist.slice(0, 5).map((account) => account.logistics_category))];
  const highGaps = analysis.trust_gaps
    .filter((gap) => ["high", "critical"].includes(gap.risk_level))
    .slice(0, 3)
    .map((gap) => `${gap.risk_level}:${gap.title}`);

  return [
    `- ${name}`,
    `  category: ${analysis.product_summary.product_category}`,
    `  segment: ${analysis.buyer_segment_recommendation.segment_name}`,
    `  process: ${analysis.warehouse_process_recommendation.process_name}`,
    `  accounts: ${accountCategories.join(" | ")}`,
    `  priority gaps: ${highGaps.join(" | ")}`
  ].join("\n");
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function stopDevServer(child) {
  if (!child || child.killed) {
    return;
  }

  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
  } else {
    child.kill("SIGTERM");
  }

  child.stdout?.destroy();
  child.stderr?.destroy();
  await waitForChildExit(child);
}

function waitForChildExit(child) {
  return new Promise((resolve) => {
    if (child.exitCode !== null || child.killed) {
      resolve();
      return;
    }

    const timeout = setTimeout(resolve, 2_000);
    child.once("exit", () => {
      clearTimeout(timeout);
      resolve();
    });
  });
}
