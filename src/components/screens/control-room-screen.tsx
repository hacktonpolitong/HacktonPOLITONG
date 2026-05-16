"use client";

import dynamic from "next/dynamic";
import type { PilotAnalysis, ProductProfile } from "@/lib/pilot-analysis-types";

const ResultDashboardV2 = dynamic(
  () => import("@/components/certibridge/ResultDashboardV2").then((module) => module.ResultDashboardV2),
  {
    ssr: false,
    loading: () => (
      <main className="grid min-h-screen place-items-center bg-[#020617] px-5 text-slate-100">
        <div className="rounded-3xl border border-cyan-300/20 bg-white/[0.05] px-5 py-4 text-sm font-semibold backdrop-blur-xl">
          Loading Pilot Control Room
        </div>
      </main>
    )
  }
);

type ControlRoomScreenProps = {
  profile: ProductProfile;
  analysis: PilotAnalysis;
  onRestart: () => void;
};

export function ControlRoomScreen({ profile, analysis, onRestart }: ControlRoomScreenProps) {
  return <ResultDashboardV2 profile={profile} analysis={analysis} onRestart={onRestart} />;
}
