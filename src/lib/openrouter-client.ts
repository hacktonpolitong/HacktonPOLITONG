import italianSegments from "../../data/italian_segments.json";
import proofChecklist from "../../data/proof_checklist.json";
import targetAccounts from "../../data/italian_target_accounts.json";
import trustGaps from "../../data/trust_gaps.json";
import warehouseProcesses from "../../data/warehouse_processes.json";
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

const canonicalProductCategories = [
  "AMR",
  "AGV",
  "sorting automation",
  "palletizing automation",
  "picking robot",
  "inventory scanning robot",
  "WMS/orchestration"
];

const pilotAnalysisTopLevelFields = [
  "metadata",
  "product_evidence_profile",
  "segment_scorecards",
  "product_summary",
  "buyer_segment_recommendation",
  "warehouse_process_recommendation",
  "trust_gaps",
  "pilot_offer",
  "target_account_shortlist",
  "objection_battlecard",
  "proof_checklist",
  "sales_pack",
  "next_7_days_plan"
];

const systemPrompt = [
  "You are PilotOps AI, a market-entry decision engine for Chinese warehouse automation vendors entering Italy.",
  "Return strict JSON only. Do not include Markdown, comments, prose outside JSON, or wrapper text.",
  "The output must be one complete PilotAnalysis object matching the current fallback_template_shape and required_top_level_fields.",
  "Use the app_request profile and evidence_inputs as the source of product evidence. If evidence is partial, state cautious assumptions inside the allowed output fields.",
  "Classify the product into exactly one canonical category from canonical_product_categories.",
  "Evaluate Italian buyer segment fit, warehouse process fit, proof readiness, support risk, and pilotability using only the provided seed datasets.",
  "Choose the first realistic Italian pilot wedge, not a generic market report or full national rollout.",
  "Generate product_evidence_profile, segment_scorecards, buyer segment recommendation, warehouse process recommendation, trust gaps, pilot offer, proof checklist, target account shortlist, sales pack, and next 7 days plan.",
  "Target accounts must come only from allowed_target_accounts. Never invent companies.",
  "Never claim certified compliance, legal compliance, CE approval, or safety certification unless the input evidence explicitly proves it. Otherwise frame it as readiness proof for buyer review.",
  "Do not claim live scraping, personal contact harvesting, guaranteed buyers, guaranteed leads, verified buying intent, exhaustive lead lists, or unsupported ROI/compliance claims."
].join("\n");

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
  const fallbackTemplate = buildDeterministicPilotAnalysis({}, requestBody);
  const allowedTargetAccounts = targetAccounts;
  const seedDatasets = {
    italian_segments: italianSegments,
    warehouse_processes: warehouseProcesses,
    trust_gaps: trustGaps,
    proof_checklist: proofChecklist,
    curated_target_accounts: allowedTargetAccounts
  };

  return {
    model,
    temperature: 0.2,
    response_format: {
      type: "json_object"
    },
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: JSON.stringify({
          task:
            "Generate a complete PilotAnalysis JSON object for the first realistic Italian warehouse automation pilot wedge. Keep the analysis English, Italy-specific, operational, and buyer-ready.",
          app_request: requestBody,
          required_metadata_note:
            "Include metadata if useful, but the server will replace metadata with provider metadata after validation.",
          canonical_product_categories: canonicalProductCategories,
          required_top_level_fields: pilotAnalysisTopLevelFields,
          seed_datasets: seedDatasets,
          allowed_target_accounts: allowedTargetAccounts,
          fallback_template_shape: fallbackTemplate,
          decision_engine_requirements: [
            "Read profile and evidence_inputs before selecting category, segment, process, trust gaps, pilot package, and sales pack.",
            "Classify the product category using canonical_product_categories only.",
            "Evaluate all Italian segments using italian_segments and return ranked segment_scorecards with reasons and tradeoffs.",
            "Select the warehouse process using warehouse_processes and the product's operational use case.",
            "Compare available proof and missing proof against proof_checklist and trust_gaps.",
            "Prioritize trust gaps for CE/safety evidence, local maintenance and spare parts, WMS/integration, localized ROI, Italian reference, language/documentation readiness, and installation disruption when relevant.",
            "Generate a bounded pilot package with duration, scope, setup, KPIs, risk reducers, exit clause, and next commercial step.",
            "Generate a sales pack that is ready to send but does not overclaim certainty, compliance, ROI, or buyer intent.",
            "If evidence is weak or missing, lower confidence and make the missing proof explicit instead of inventing certainty."
          ],
          target_account_rules: [
            "Use only allowed_target_accounts and preserve each selected account's company_name, website, hq_region, logistics_category, warehouse_signals, likely_process_fit, recommended_buyer_roles, outreach_angle, and source_note.",
            "Return 5 to 10 target_account_shortlist entries.",
            "Rank accounts by selected segment fit, likely_process_fit, hq_region or region_preference when available, and warehouse_signals.",
            "Do not add personal names, personal emails, phone numbers, LinkedIn profiles, or private contact data.",
            "Do not describe the shortlist as scraped, exhaustive, verified outreach permission, buying intent, or guaranteed buyers."
          ],
          safety_rules: [
            "No certified compliance, legal compliance, CE approval, or safety certification claims unless explicitly proven by app_request evidence.",
            "No live scraping or claims that live web research was performed.",
            "No personal contact harvesting.",
            "No guaranteed buyers, guaranteed leads, guaranteed replies, or verified buying intent.",
            "No invented companies; target accounts must exist in allowed_target_accounts.",
            "No exhaustive lead list language; this is a curated target-account shortlist.",
            "No unsupported ROI, throughput, compliance, or safety claims.",
            "No generic market report structure; every section must support a first-pilot decision."
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
