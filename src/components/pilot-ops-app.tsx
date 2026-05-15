"use client";

import { useEffect, useState } from "react";
import { AnalysisLoadingScreen } from "@/components/screens/analysis-loading-screen";
import { ControlRoomScreen } from "@/components/screens/control-room-screen";
import { IntakeScreen, type EvidenceInputs } from "@/components/screens/intake-screen";
import { StartScreen } from "@/components/screens/start-screen";
import { isPilotAnalysisUsable } from "@/lib/pilot-analysis-validation";
import { demoProductProfile, mockPilotAnalysis } from "@/lib/mock-pilot-analysis";
import type { PilotAnalysis } from "@/lib/pilot-analysis-types";

type FlowStep = "start" | "intake" | "analysis" | "control-room";
const ANALYSIS_REQUEST_TIMEOUT_MS = 8000;

const emptyEvidenceInputs: EvidenceInputs = {
  chinese_documentation_text: "",
  website_product_text: "",
  technical_specs_text: "",
  proof_certification_notes: "",
  case_study_roi_notes: ""
};

export function PilotOpsApp() {
  const [step, setStep] = useState<FlowStep>("start");
  const [productProfile, setProductProfile] = useState(demoProductProfile);
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
      let nextAnalysis = mockPilotAnalysis;
      const minimumLoadingTime = new Promise((resolve) => window.setTimeout(resolve, 1500));

      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            profile: productProfile,
            evidence_inputs: evidenceInputs
          }),
          signal: controller.signal
        });

        if (response.ok) {
          const candidate: unknown = await response.json();

          if (isPilotAnalysisUsable(candidate)) {
            nextAnalysis = candidate;
          }
        }
      } catch {
        nextAnalysis = mockPilotAnalysis;
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
        onBack={() => setStep("start")}
      />
    );
  }

  if (step === "analysis") {
    return <AnalysisLoadingScreen />;
  }

  if (step === "control-room") {
    return <ControlRoomScreen profile={productProfile} analysis={analysis} onRestart={() => setStep("start")} />;
  }

  return <StartScreen onStart={() => setStep("intake")} />;
}
