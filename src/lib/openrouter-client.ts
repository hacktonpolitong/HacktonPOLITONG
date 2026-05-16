import targetAccounts from "../../data/italian_target_accounts.json";
import { buildDeterministicPilotAnalysis } from "./pilot-analysis-fallback";
import type { AnalysisKeySource } from "./pilot-analysis-types";

export const DEFAULT_OPENROUTER_MODEL = "deepseek/deepseek-v4-flash:free";

const OPENROUTER_CHAT_COMPLETIONS_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_TIMEOUT_MS = 6_000;

type OpenRouterAttemptInput = {
  apiKey: string;
  keySource: Exclude<AnalysisKeySource, "none">;
  model: string;
  requestBody: unknown;
};

type OpenRouterFailureKind = "rate_limit" | "provider_error" | "network" | "timeout" | "invalid_response" | "auth" | "other_http";

export type OpenRouterAttemptResult =
  | {
      ok: true;
      content: unknown;
      keySource: Exclude<AnalysisKeySource, "none">;
      model: string;
    }
  | {
      ok: false;
      keySource: Exclude<AnalysisKeySource, "none">;
      model: string;
      failureKind: OpenRouterFailureKind;
      status?: number;
      shouldTrySecondary: boolean;
    };

export async function callOpenRouterAnalysis(input: OpenRouterAttemptInput): Promise<OpenRouterAttemptResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OPENROUTER_TIMEOUT_MS);

  try {
    const response = await fetch(OPENROUTER_CHAT_COMPLETIONS_URL, {
      method: "POST",
      headers: buildOpenRouterHeaders(input.apiKey),
      body: JSON.stringify(buildOpenRouterPayload(input.model, input.requestBody)),
      signal: controller.signal
    });

    if (!response.ok) {
      return {
        ok: false,
        keySource: input.keySource,
        model: input.model,
        failureKind: classifyHttpFailure(response.status),
        status: response.status,
        shouldTrySecondary: shouldTrySecondaryForStatus(response.status)
      };
    }

    const responseJson: unknown = await response.json();
    const content = extractAssistantContent(responseJson);

    if (content === null) {
      return invalidResponse(input);
    }

    const parsedContent = parseJsonContent(content);

    if (parsedContent === null) {
      return invalidResponse(input);
    }

    return {
      ok: true,
      content: parsedContent,
      keySource: input.keySource,
      model: input.model
    };
  } catch (error) {
    const isTimeout = error instanceof DOMException && error.name === "AbortError";

    return {
      ok: false,
      keySource: input.keySource,
      model: input.model,
      failureKind: isTimeout ? "timeout" : "network",
      shouldTrySecondary: !isTimeout
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

function buildOpenRouterHeaders(apiKey: string): HeadersInit {
  const headers: HeadersInit = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  };

  if (process.env.OPENROUTER_SITE_URL) {
    headers["HTTP-Referer"] = process.env.OPENROUTER_SITE_URL;
  }

  headers["X-Title"] = process.env.OPENROUTER_APP_NAME || "PilotOps AI";

  return headers;
}

function buildOpenRouterPayload(model: string, requestBody: unknown) {
  const deterministicBaseline = buildDeterministicPilotAnalysis({}, requestBody);
  const allowedTargetAccounts = targetAccounts;

  return {
    model,
    temperature: 0.2,
    response_format: {
      type: "json_object"
    },
    messages: [
      {
        role: "system",
        content:
          "You are the PilotOps AI market-entry decision engine for Chinese warehouse automation vendors entering Italy. Return strict JSON only. The output must be a complete PilotAnalysis object with the same top-level fields and nested shape as deterministic_baseline, including product_evidence_profile, segment_scorecards, target_account_shortlist, and sales_pack. Do not include Markdown. Use the deterministic baseline as the grounded minimum answer, then improve wording and reasoning only when the provided product profile, evidence inputs, and curated account data support it. Do not claim live scraping, guaranteed buyers, personal contacts, legal compliance certification, or verified outreach permission."
      },
      {
        role: "user",
        content: JSON.stringify({
          task:
            "Generate a complete PilotAnalysis JSON object. Keep the analysis English, Italy-specific, warehouse-automation-specific, and focused on choosing the first realistic Italian pilot wedge, not a generic market report.",
          app_request: requestBody,
          decision_engine_requirements: [
            "Read the profile and evidence_inputs before choosing the product category, buyer segment, warehouse process, trust gaps, pilot package, shortlist, and sales pack.",
            "Support AMR, AGV, sorting automation, palletizing automation, picking robot, inventory scanning robot, and WMS/orchestration inputs without drifting back to a fixed AMR/3PL answer.",
            "Changing product category must change the recommended segment, warehouse process, KPIs, pilot offer, and shortlist when the evidence supports a different wedge.",
            "Missing or partial CE/safety evidence must remain a high or critical trust gap; do not state compliance is complete unless the input explicitly proves buyer-ready evidence.",
            "Missing local maintenance, support SLA, or spare-parts readiness must remain a high support risk with practical mitigation steps.",
            "The first pilot must be bounded, measurable, reversible, and realistic; never propose a full warehouse transformation as the first step."
          ],
          category_guidance: {
            AMR: "Prefer bounded internal transport, picking support, or line-side movement depending on the evidence.",
            AGV: "Prefer pallet movement, line-side replenishment, or controlled internal transport.",
            "sorting automation": "Prefer parcel/courier/sorting operations and parcel sorting KPIs such as parcels per hour, mis-sort rate, and dispatch cutoff adherence.",
            "palletizing automation": "Prefer food and beverage or manufacturing-style segments, with safety, footprint, manual-lift, and dispatch-line constraints visible.",
            "picking robot": "Prefer e-commerce, retail, pharma, or high-SKU picking-support scenarios with operator adoption and WMS constraints.",
            "inventory scanning robot": "Prefer retail, pharma, or manufacturing inventory accuracy use cases with scan coverage, cycle-count time, and data-review constraints.",
            "WMS/orchestration": "Prefer workflow optimization where data handoff, task orchestration, and measurable process control are credible."
          },
          required_metadata_note:
            "Include metadata if useful, but the server will replace metadata with provider metadata after validation.",
          allowed_target_accounts: allowedTargetAccounts,
          deterministic_baseline: deterministicBaseline,
          output_contract: [
            "Return only the JSON object, not an explanation wrapper.",
            "Keep every field required by deterministic_baseline.",
            "Use only target accounts that appear in allowed_target_accounts, preserving company_name and website exactly.",
            "Return at least five target_account_shortlist entries.",
            "Keep target accounts coherent with the selected segment and process; if the dataset is imperfect, prefer the closest curated match and explain caveats in source_note or assumptions.",
            "Keep sales copy specific to the selected pilot process and trust gaps."
          ],
          safety_rules: [
            "Use only company-level target account data from allowed_target_accounts.",
            "Target accounts must match the selected segment and warehouse process as much as the curated dataset allows.",
            "Do not invent personal emails, phone numbers, LinkedIn profiles, or private contact data.",
            "Do not describe the shortlist as scraped, exhaustive, verified outreach permission, or guaranteed buyers.",
            "Do not claim CE/legal compliance is certified; frame safety items as readiness proof for buyer review.",
            "Do not invent companies or account evidence outside the curated target account dataset.",
            "Do not remove missing-proof caveats just to make the answer sound more confident."
          ]
        })
      }
    ]
  };
}

function extractAssistantContent(responseJson: unknown): unknown {
  if (!isRecord(responseJson) || !Array.isArray(responseJson.choices)) {
    return null;
  }

  const [firstChoice] = responseJson.choices;

  if (!isRecord(firstChoice) || !isRecord(firstChoice.message)) {
    return null;
  }

  return firstChoice.message.content ?? null;
}

function parseJsonContent(content: unknown): unknown | null {
  if (typeof content === "string") {
    try {
      return JSON.parse(content);
    } catch {
      return null;
    }
  }

  if (Array.isArray(content)) {
    const textContent = content
      .map((part) => (isRecord(part) && typeof part.text === "string" ? part.text : ""))
      .join("");

    if (!textContent) {
      return null;
    }

    try {
      return JSON.parse(textContent);
    } catch {
      return null;
    }
  }

  return isRecord(content) ? content : null;
}

function invalidResponse(input: OpenRouterAttemptInput): OpenRouterAttemptResult {
  return {
    ok: false,
    keySource: input.keySource,
    model: input.model,
    failureKind: "invalid_response",
    shouldTrySecondary: true
  };
}

function classifyHttpFailure(status: number): OpenRouterFailureKind {
  if (status === 429) {
    return "rate_limit";
  }

  if (status === 401 || status === 403) {
    return "auth";
  }

  if (status >= 500) {
    return "provider_error";
  }

  return "other_http";
}

function shouldTrySecondaryForStatus(status: number): boolean {
  return status === 401 || status === 403 || status === 429 || status >= 500;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
