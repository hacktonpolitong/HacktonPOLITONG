import { buildMarketEntryPilotAnalysis, type DynamicAnalysisMetadataInput } from "./market-entry-engine";
import type { AnalysisKeySource, AnalysisMode, AnalysisProvider, PilotAnalysis } from "./pilot-analysis-types";

export type AnalysisMetadataInput = {
  analysisMode?: AnalysisMode;
  provider?: AnalysisProvider;
  model?: string;
  keySource?: AnalysisKeySource;
};

export function buildDeterministicPilotAnalysis(
  metadata: AnalysisMetadataInput = {},
  requestBody: unknown = {}
): PilotAnalysis {
  return buildMarketEntryPilotAnalysis(requestBody, metadata as DynamicAnalysisMetadataInput);
}

export const deterministicPilotAnalysis = buildDeterministicPilotAnalysis();
