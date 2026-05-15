"use client";

import { useEffect, useState } from "react";
import { AnalysisLoadingScreen } from "@/components/screens/analysis-loading-screen";
import { ControlRoomScreen } from "@/components/screens/control-room-screen";
import { IntakeScreen } from "@/components/screens/intake-screen";
import { StartScreen } from "@/components/screens/start-screen";
import { demoProductProfile, mockPilotAnalysis } from "@/lib/mock-pilot-analysis";

type FlowStep = "start" | "intake" | "analysis" | "control-room";

export function PilotOpsApp() {
  const [step, setStep] = useState<FlowStep>("start");
  const [productProfile, setProductProfile] = useState(demoProductProfile);

  useEffect(() => {
    if (step !== "analysis") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setStep("control-room");
    }, 1500);

    return () => window.clearTimeout(timeoutId);
  }, [step]);

  if (step === "intake") {
    return (
      <IntakeScreen
        profile={productProfile}
        onAnalyze={(updatedProfile) => {
          setProductProfile(updatedProfile);
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
    return <ControlRoomScreen profile={productProfile} analysis={mockPilotAnalysis} onRestart={() => setStep("start")} />;
  }

  return <StartScreen onStart={() => setStep("intake")} />;
}
