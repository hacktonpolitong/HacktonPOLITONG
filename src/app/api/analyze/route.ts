import { NextResponse } from "next/server";
import { buildDeterministicPilotAnalysis } from "@/lib/pilot-analysis-fallback";
import { normalizePilotAnalysisCandidate } from "@/lib/pilot-analysis-validation";
import { callOpenRouterAnalysis, DEFAULT_OPENROUTER_MODEL } from "@/lib/openrouter-client";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const requestBody = await readRecoverableJson(request);
  const fallback = buildDeterministicPilotAnalysis({}, requestBody);
  const forceLocalEngine = process.env.PILOTOPS_FORCE_LOCAL_ENGINE === "1";
  const primaryApiKey = process.env.OPENROUTER_API_KEY;
  const secondaryApiKey = process.env.OPENROUTER_FALLBACK_API_KEY;
  const model = process.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL;

  if (forceLocalEngine || !primaryApiKey) {
    return NextResponse.json(fallback);
  }

  const primaryAttempt = await callOpenRouterAnalysis({
    apiKey: primaryApiKey,
    keySource: "primary",
    model,
    requestBody
  });

  if (primaryAttempt.ok) {
    const normalized = normalizePilotAnalysisCandidate(primaryAttempt.content, {
      analysisMode: "live_ai",
      provider: "openrouter",
      model: primaryAttempt.model,
      keySource: primaryAttempt.keySource
    });

    if (normalized) {
      return NextResponse.json(normalized);
    }
  }

  const shouldTrySecondary =
    secondaryApiKey &&
    (!primaryAttempt.ok ? primaryAttempt.shouldTrySecondary : true);

  if (shouldTrySecondary) {
    const secondaryAttempt = await callOpenRouterAnalysis({
      apiKey: secondaryApiKey,
      keySource: "secondary",
      model,
      requestBody
    });

    if (secondaryAttempt.ok) {
      const normalized = normalizePilotAnalysisCandidate(secondaryAttempt.content, {
        analysisMode: "live_ai",
        provider: "openrouter",
        model: secondaryAttempt.model,
        keySource: secondaryAttempt.keySource
      });

      if (normalized) {
        return NextResponse.json(normalized);
      }
    }
  }

  return NextResponse.json(fallback);
}

async function readRecoverableJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return {};
  }
}
