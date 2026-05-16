"use client";

import { useEffect, useState } from "react";
import { AnalysisLoadingScreen } from "@/components/screens/analysis-loading-screen";
import { ControlRoomScreen } from "@/components/screens/control-room-screen";
import { IntakeScreen, type EvidenceInputs } from "@/components/screens/intake-screen";
import { isPilotAnalysisUsable } from "@/lib/pilot-analysis-validation";
import { buildClientFallbackPilotAnalysis, mockPilotAnalysis } from "@/lib/mock-pilot-analysis";
import type { PilotAnalysis, ProductProfile } from "@/lib/pilot-analysis-types";

type FlowStep = "intake" | "analysis" | "control-room";
const ANALYSIS_REQUEST_TIMEOUT_MS = 20000;
const MINIMUM_LOADING_TIME_MS = 5600;

const emptyProductProfile: ProductProfile = {
  companyName: "",
  productName: "",
  productCategory: "",
  targetMarket: "Italy / European Union",
  description: "",
  benefits: [],
  currentProof: [],
  documentationStatus: "",
  pilotAmbition: "",
  constraints: []
};

const emptyEvidenceInputs: EvidenceInputs = {
  chinese_documentation_text: "",
  website_product_text: "",
  technical_specs_text: "",
  proof_certification_notes: "",
  case_study_roi_notes: ""
};

export function PilotOpsApp() {
  const [step, setStep] = useState<FlowStep>("intake");
  const [productProfile, setProductProfile] = useState<ProductProfile>(emptyProductProfile);
  const [evidenceInputs, setEvidenceInputs] = useState<EvidenceInputs>(emptyEvidenceInputs);
  const [analysis, setAnalysis] = useState<PilotAnalysis>(mockPilotAnalysis);

  useEffect(() => {
    if (step !== "analysis") {
      return;
    }

    let isCancelled = false;
    const controller = new AbortController();
    const requestTimeoutId = window.setTimeout(() => {
      controller.abort();
    }, ANALYSIS_REQUEST_TIMEOUT_MS);

    async function runAnalysis() {
      const requestBody = {
        profile: productProfile,
        evidence_inputs: evidenceInputs
      };
      let nextAnalysis = buildClientFallbackPilotAnalysis(requestBody);
      const minimumLoadingTime = new Promise((resolve) => window.setTimeout(resolve, MINIMUM_LOADING_TIME_MS));

      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });

        if (response.ok) {
          const candidate: unknown = await response.json();

          if (isPilotAnalysisUsable(candidate)) {
            nextAnalysis = candidate;
          }
        }
      } catch {
        nextAnalysis = buildClientFallbackPilotAnalysis(requestBody);
      } finally {
        window.clearTimeout(requestTimeoutId);
      }

      await minimumLoadingTime;

      if (isCancelled) {
        return;
      }

      setAnalysis(nextAnalysis);
      setStep("control-room");
    }

    void runAnalysis();

    return () => {
      isCancelled = true;
      window.clearTimeout(requestTimeoutId);
      controller.abort();
    };
  }, [evidenceInputs, productProfile, step]);

  if (step === "intake") {
    return (
      <IntakeScreen
        profile={productProfile}
        evidenceInputs={evidenceInputs}
        onAnalyze={({ profile: updatedProfile, evidenceInputs: updatedEvidenceInputs }) => {
          setProductProfile(updatedProfile);
          setEvidenceInputs(updatedEvidenceInputs);
          setStep("analysis");
        }}
      />
    );
  }

  if (step === "analysis") {
    return <AnalysisLoadingScreen />;
  }

  if (step === "control-room") {
    return (
      <ControlRoomScreen
        profile={productProfile}
        analysis={analysis}
        onRestart={() => {
          setProductProfile(emptyProductProfile);
          setEvidenceInputs(emptyEvidenceInputs);
          setStep("intake");
        }}
      />
    );
  }

  return null;
}
