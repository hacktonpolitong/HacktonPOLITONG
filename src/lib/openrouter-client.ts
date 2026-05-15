import targetAccounts from "../../data/italian_target_accounts.json";
import { buildDeterministicPilotAnalysis } from "./pilot-analysis-fallback";
import type { AnalysisKeySource } from "./pilot-analysis-types";

export const DEFAULT_OPENROUTER_MODEL = "deepseek/deepseek-v4-flash:free";

const OPENROUTER_CHAT_COMPLETIONS_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_TIMEOUT_MS = 14_000;

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
      shouldTrySecondary: true
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
  const fallbackTemplate = buildDeterministicPilotAnalysis();
  const allowedTargetAccounts = targetAccounts.filter(
    (account) =>
      account.logistics_category === "3PL and e-commerce fulfilment" &&
      account.likely_process_fit.includes("internal transport")
  );

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
          "You are the PilotOps AI analysis engine. Return strict JSON only. The output must be a complete PilotAnalysis object for a Chinese warehouse automation vendor entering Italy with a low-risk first pilot package. Do not include Markdown. Do not claim live scraping, guaranteed buyers, personal contacts, legal compliance certification, or verified outreach permission."
      },
      {
        role: "user",
        content: JSON.stringify({
          task:
            "Generate a complete PilotAnalysis JSON object. Keep the analysis English, Italy-specific, warehouse-automation-specific, and focused on the first pilot package.",
          app_request: requestBody,
          required_metadata_note:
            "Include metadata if useful, but the server will replace metadata with provider metadata after validation.",
          required_seed_ids: {
            recommended_segment_id: "it_3pl_ecommerce",
            process_id: "internal_transport"
          },
          allowed_target_accounts: allowedTargetAccounts,
          fallback_template_shape: fallbackTemplate,
          safety_rules: [
            "Use only company-level target account data from allowed_target_accounts.",
            "Return at least five target_account_shortlist entries.",
            "Do not invent personal emails, phone numbers, LinkedIn profiles, or private contact data.",
            "Do not describe the shortlist as scraped, exhaustive, verified outreach permission, or guaranteed buyers.",
            "Do not claim CE/legal compliance is certified; frame safety items as readiness proof for buyer review."
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
