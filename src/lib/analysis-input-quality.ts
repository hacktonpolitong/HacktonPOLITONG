import type { AnalyzeRequestBody, EvidenceInputs, ProductProfile } from "@/lib/pilot-analysis-types";

export type InputQualityIssue = {
  field: string;
  code: "missing_profile" | "missing_required_field" | "too_short" | "profane_or_junk" | "not_domain_relevant";
  message: string;
};

export type InputQualityResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      summary: string;
      issues: InputQualityIssue[];
    };

const requiredProfileFields: Array<keyof Pick<ProductProfile, "companyName" | "productName">> = [
  "companyName",
  "productName"
];

const junkTerms = [
  "bullshit",
  "cazzo",
  "palle",
  "merda",
  "stronzo",
  "fuck",
  "shit",
  "asdf",
  "qwerty",
  "lorem ipsum"
];

const domainSignals = [
  "warehouse",
  "warehousing",
  "logistics",
  "logistica",
  "magazzino",
  "intralogistics",
  "automation",
  "automazione",
  "robot",
  "robotic",
  "robotics",
  "autonomous",
  "mobile",
  "amr",
  "agv",
  "picking",
  "packing",
  "sorting",
  "sortation",
  "pallet",
  "palletizing",
  "forklift",
  "conveyor",
  "wms",
  "orchestration",
  "fulfillment",
  "fulfilment",
  "inventory",
  "storage",
  "material handling",
  "dispatch",
  "tote",
  "cart",
  "fleet"
];

const unrelatedSignals = [
  "restaurant",
  "menu",
  "pizza",
  "fashion",
  "cosmetic",
  "skincare",
  "hotel",
  "tourism",
  "real estate",
  "wedding",
  "school",
  "dentist",
  "blockchain",
  "crypto casino",
  "music festival",
  "pet grooming"
];

export function validateAnalyzeRequestInput(value: unknown): InputQualityResult {
  const issues: InputQualityIssue[] = [];

  if (!isRecord(value) || !isRecord(value.profile)) {
    return {
      ok: false,
      summary: "Add real company and product information before running the analysis.",
      issues: [
        {
          field: "profile",
          code: "missing_profile",
          message: "The analysis needs a product profile, not an empty request."
        }
      ]
    };
  }

  const request = value as AnalyzeRequestBody;
  const profile = request.profile ?? {};
  const evidenceInputs = isRecord(request.evidence_inputs) ? (request.evidence_inputs as EvidenceInputs) : {};

  for (const field of requiredProfileFields) {
    const content = stringValue(profile[field]);

    if (!hasUsefulLetters(content, 2)) {
      issues.push({
        field,
        code: "missing_required_field",
        message: `${readableFieldName(field)} must contain real product information.`
      });
    }
  }

  const fieldTexts = buildFieldTexts(profile, evidenceInputs);
  const profaneFields = fieldTexts.filter((item) => containsJunkTerm(item.value) || looksLikeKeyboardTrash(item.value));

  for (const item of profaneFields.slice(0, 4)) {
    issues.push({
      field: item.field,
      code: "profane_or_junk",
      message: `${readableFieldName(item.field)} contains profanity, placeholder text, or non-business input.`
    });
  }

  const evidenceText = fieldTexts
    .filter((item) => item.field !== "companyName" && item.field !== "productName")
    .map((item) => item.value)
    .join(" ");
  const normalizedEvidence = normalizeText(evidenceText);
  const usefulTokenCount = countUsefulTokens(normalizedEvidence);
  const domainSignalCount = countDomainSignals(normalizedEvidence);
  const unrelatedSignalCount = countSignals(normalizedEvidence, unrelatedSignals);
  const hasSubstantialBusinessContext = usefulTokenCount >= 6 || normalizedEvidence.length >= 40;

  if (!hasSubstantialBusinessContext) {
    issues.push({
      field: "profile",
      code: "too_short",
      message: "Add at least a short real description or some product documentation before running the analysis."
    });
  }

  if (hasSubstantialBusinessContext && domainSignalCount === 0 && unrelatedSignalCount > 0) {
    issues.push({
      field: "productCategory",
      code: "not_domain_relevant",
      message: "The uploaded material looks unrelated to warehouse automation, logistics, robotics, or WMS."
    });
  }

  if (issues.length > 0) {
    return {
      ok: false,
      summary:
        "I can only block clearly unusable input here: empty requests, placeholder text, or material that looks unrelated to the product domain.",
      issues: dedupeIssues(issues)
    };
  }

  return { ok: true };
}

export function formatInputQualityIssues(result: InputQualityResult): string[] {
  if (result.ok) {
    return [];
  }

  return [result.summary, ...result.issues.map((issue) => issue.message)];
}

function buildFieldTexts(profile: Partial<ProductProfile>, evidenceInputs: EvidenceInputs) {
  return [
    { field: "companyName", value: stringValue(profile.companyName) },
    { field: "productName", value: stringValue(profile.productName) },
    { field: "productCategory", value: stringValue(profile.productCategory) },
    { field: "description", value: stringValue(profile.description) },
    { field: "benefits", value: arrayValue(profile.benefits) },
    { field: "currentProof", value: arrayValue(profile.currentProof) },
    { field: "documentationStatus", value: stringValue(profile.documentationStatus) },
    { field: "pilotAmbition", value: stringValue(profile.pilotAmbition) },
    { field: "constraints", value: arrayValue(profile.constraints) },
    { field: "chineseDocumentation", value: stringValue(evidenceInputs.chinese_documentation_text) },
    { field: "websiteProductText", value: stringValue(evidenceInputs.website_product_text) },
    { field: "technicalSpecs", value: stringValue(evidenceInputs.technical_specs_text) },
    { field: "proofCertificationNotes", value: stringValue(evidenceInputs.proof_certification_notes) },
    { field: "caseStudyRoiNotes", value: stringValue(evidenceInputs.case_study_roi_notes) }
  ];
}

function containsJunkTerm(value: string) {
  const normalized = normalizeText(value);

  return junkTerms.some((term) => normalized.split(/\s+/u).includes(term));
}

function looksLikeKeyboardTrash(value: string) {
  const normalized = normalizeText(value);
  const compact = normalized.replace(/\s+/g, "");

  if (!compact) {
    return false;
  }

  const uniqueChars = new Set(compact).size;
  const latinLetters = compact.replace(/[^a-z]/g, "");
  const vowelCount = (latinLetters.match(/[aeiou]/g) ?? []).length;
  const hasWhitespace = /\s/u.test(normalized);

  if (compact.length < 8) {
    return false;
  }

  if (uniqueChars <= 3) {
    return true;
  }

  return !hasWhitespace && latinLetters.length >= 8 && vowelCount === 0;
}

function countDomainSignals(value: string) {
  return countSignals(value, domainSignals);
}

function countSignals(value: string, signals: string[]) {
  return signals.filter((signal) => value.includes(signal)).length;
}

function countUsefulTokens(value: string) {
  return value.split(/\s+/u).filter((token) => token.length >= 2 && /[\p{L}\p{N}]/u.test(token)).length;
}

function hasUsefulLetters(value: string, minLetters: number) {
  return (value.match(/\p{L}/gu) ?? []).length >= minLetters && !containsJunkTerm(value) && !looksLikeKeyboardTrash(value);
}

function dedupeIssues(issues: InputQualityIssue[]) {
  return issues.filter(
    (issue, index, array) =>
      array.findIndex((candidate) => candidate.field === issue.field && candidate.code === issue.code) === index
  );
}

function readableFieldName(value: string) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (character) => character.toUpperCase())
    .trim();
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function arrayValue(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string").join(" ") : "";
}

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").replace(/\s+/g, " ").trim();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
