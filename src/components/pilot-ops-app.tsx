"use client";

import { useEffect, useState } from "react";
import { AnalysisLoadingScreen } from "@/components/screens/analysis-loading-screen";
import { ControlRoomScreen } from "@/components/screens/control-room-screen";
import { IntakeScreen } from "@/components/screens/intake-screen";
import { StartScreen } from "@/components/screens/start-screen";
import { isPilotAnalysisUsable } from "@/lib/pilot-analysis-validation";
import { demoProductProfile, mockPilotAnalysis } from "@/lib/mock-pilot-analysis";
import type { PilotAnalysis } from "@/lib/pilot-analysis-types";

type FlowStep = "start" | "intake" | "analysis" | "control-room";

export function PilotOpsApp() {
  const [step, setStep] = useState<FlowStep>("start");
  const [analysis, setAnalysis] = useState<PilotAnalysis>(mockPilotAnalysis);

  useEffect(() => {
    if (step !== "analysis") {
      return;
    }

    let isCancelled = false;
    const controller = new AbortController();

    async function runAnalysis() {
      let nextAnalysis = mockPilotAnalysis;
      const minimumLoadingTime = new Promise((resolve) => window.setTimeout(resolve, 1500));

      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ profile: demoProductProfile }),
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
      controller.abort();
    };
  }, [step]);

  if (step === "intake") {
    return <IntakeScreen profile={demoProductProfile} onAnalyze={() => setStep("analysis")} onBack={() => setStep("start")} />;
  }

  if (step === "analysis") {
    return <AnalysisLoadingScreen />;
  }

  if (step === "control-room") {
    return <ControlRoomScreen profile={demoProductProfile} analysis={analysis} onRestart={() => setStep("start")} />;
  }

  return <StartScreen onStart={() => setStep("intake")} />;
}
