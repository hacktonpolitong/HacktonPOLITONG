import { NextResponse } from "next/server";
import { buildDeterministicPilotAnalysis } from "@/lib/pilot-analysis-fallback";
import { getPilotAnalysisValidationIssues, normalizePilotAnalysisCandidate } from "@/lib/pilot-analysis-validation";
import { callOpenRouterAnalysis, DEFAULT_OPENROUTER_MODEL } from "@/lib/openrouter-client";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const requestId = createAnalyzeRequestId();
  const startedAt = Date.now();
  const requestBody = await readRecoverableJson(request);
  const fallback = buildDeterministicPilotAnalysis({}, requestBody);
  const primaryApiKey = process.env.OPENROUTER_API_KEY;
  const secondaryApiKey = process.env.OPENROUTER_FALLBACK_API_KEY;
  const model = process.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL;
  const baseLogContext = {
    requestId,
    model,
    hasPrimaryApiKey: Boolean(primaryApiKey),
    hasSecondaryApiKey: Boolean(secondaryApiKey),
    requestShape: describeAnalyzeRequest(requestBody)
  };

  logAnalyzeDiagnostic("info", "request_received", baseLogContext);

  if (!primaryApiKey) {
    logAnalyzeDiagnostic("warn", "fallback_returned", {
      ...baseLogContext,
      reason: "missing_openrouter_api_key",
      durationMs: Date.now() - startedAt
    });

    return NextResponse.json(fallback);
  }

  logAnalyzeDiagnostic("info", "openrouter_attempt_started", {
    ...baseLogContext,
    keySource: "primary"
  });

  const primaryAttempt = await callOpenRouterAnalysis({
    apiKey: primaryApiKey,
    keySource: "primary",
    model,
    requestBody
  });

  if (primaryAttempt.ok) {
    logAnalyzeDiagnostic("info", "openrouter_attempt_ok", {
      ...baseLogContext,
      keySource: primaryAttempt.keySource,
      returnedModel: primaryAttempt.model
    });

    const normalized = normalizePilotAnalysisCandidate(primaryAttempt.content, {
      analysisMode: "live_ai",
      provider: "openrouter",
      model: primaryAttempt.model,
      keySource: primaryAttempt.keySource
    });

    if (normalized) {
      logAnalyzeDiagnostic("info", "live_ai_returned", {
        ...baseLogContext,
        keySource: primaryAttempt.keySource,
        returnedModel: primaryAttempt.model,
        durationMs: Date.now() - startedAt
      });

      return NextResponse.json(normalized);
    }

    logAnalyzeDiagnostic("warn", "openrouter_validation_failed", {
      ...baseLogContext,
      keySource: primaryAttempt.keySource,
      returnedModel: primaryAttempt.model,
      validationIssues: getPilotAnalysisValidationIssues(primaryAttempt.content),
      reason: "pilot_analysis_shape_or_guardrail_validation_failed"
    });
  } else {
    logAnalyzeDiagnostic("warn", "openrouter_attempt_failed", {
      ...baseLogContext,
      keySource: primaryAttempt.keySource,
      failureKind: primaryAttempt.failureKind,
      status: primaryAttempt.status ?? null,
      shouldTrySecondary: primaryAttempt.shouldTrySecondary
    });
  }

  const shouldTrySecondary =
    secondaryApiKey &&
    !primaryAttempt.ok &&
    primaryAttempt.shouldTrySecondary;

  if (shouldTrySecondary) {
    logAnalyzeDiagnostic("info", "openrouter_attempt_started", {
      ...baseLogContext,
      keySource: "secondary"
    });

    const secondaryAttempt = await callOpenRouterAnalysis({
      apiKey: secondaryApiKey,
      keySource: "secondary",
      model,
      requestBody
    });

    if (secondaryAttempt.ok) {
      logAnalyzeDiagnostic("info", "openrouter_attempt_ok", {
        ...baseLogContext,
        keySource: secondaryAttempt.keySource,
        returnedModel: secondaryAttempt.model
      });

      const normalized = normalizePilotAnalysisCandidate(secondaryAttempt.content, {
        analysisMode: "live_ai",
        provider: "openrouter",
        model: secondaryAttempt.model,
        keySource: secondaryAttempt.keySource
      });

      if (normalized) {
        logAnalyzeDiagnostic("info", "live_ai_returned", {
          ...baseLogContext,
          keySource: secondaryAttempt.keySource,
          returnedModel: secondaryAttempt.model,
          durationMs: Date.now() - startedAt
        });

        return NextResponse.json(normalized);
      }

      logAnalyzeDiagnostic("warn", "openrouter_validation_failed", {
        ...baseLogContext,
        keySource: secondaryAttempt.keySource,
        returnedModel: secondaryAttempt.model,
        validationIssues: getPilotAnalysisValidationIssues(secondaryAttempt.content),
        reason: "pilot_analysis_shape_or_guardrail_validation_failed"
      });
    } else {
      logAnalyzeDiagnostic("warn", "openrouter_attempt_failed", {
        ...baseLogContext,
        keySource: secondaryAttempt.keySource,
        failureKind: secondaryAttempt.failureKind,
        status: secondaryAttempt.status ?? null,
        shouldTrySecondary: secondaryAttempt.shouldTrySecondary
      });
    }
  } else if (secondaryApiKey) {
    logAnalyzeDiagnostic("info", "secondary_attempt_skipped", {
      ...baseLogContext,
      reason: primaryAttempt.ok ? "primary_response_failed_validation" : "primary_failure_not_retryable"
    });
  } else {
    logAnalyzeDiagnostic("info", "secondary_attempt_skipped", {
      ...baseLogContext,
      reason: "missing_openrouter_fallback_api_key"
    });
  }

  logAnalyzeDiagnostic("warn", "fallback_returned", {
    ...baseLogContext,
    reason: "live_ai_unavailable_or_invalid",
    durationMs: Date.now() - startedAt
  });

  return NextResponse.json(fallback);
}

async function readRecoverableJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function createAnalyzeRequestId(): string {
  return `analyze_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function describeAnalyzeRequest(value: unknown) {
  if (!isRecord(value)) {
    return {
      hasProfile: false,
      hasEvidenceInputs: false,
      evidenceInputKeys: []
    };
  }

  const profile = isRecord(value.profile) ? value.profile : {};
  const evidenceInputs = isRecord(value.evidence_inputs) ? value.evidence_inputs : {};

  return {
    hasProfile: Object.keys(profile).length > 0,
    hasEvidenceInputs: Object.keys(evidenceInputs).length > 0,
    profileKeys: Object.keys(profile).sort(),
    evidenceInputKeys: Object.keys(evidenceInputs).sort()
  };
}

function logAnalyzeDiagnostic(
  level: "info" | "warn",
  event: string,
  details: Record<string, unknown>
) {
  const payload = {
    scope: "api/analyze",
    event,
    ...details
  };
  const message = `[PilotOps Analyze] ${JSON.stringify(payload)}`;

  if (level === "warn") {
    console.warn(message);
    return;
  }

  console.info(message);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
