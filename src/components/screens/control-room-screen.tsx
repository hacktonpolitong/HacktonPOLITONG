"use client";

import dynamic from "next/dynamic";
import { BrandLogo } from "@/components/certibridge/BrandLogo";
import type { PilotAnalysis, ProductProfile } from "@/lib/pilot-analysis-types";

const ResultDashboardV2 = dynamic(
  () => import("@/components/certibridge/ResultDashboardV2").then((module) => module.ResultDashboardV2),
  {
    ssr: false,
    loading: () => (
      <main className="grid min-h-screen place-items-center bg-[#020617] px-5 text-slate-100">
        <div className="grid justify-items-center gap-3 rounded-3xl border border-cyan-300/20 bg-white/[0.05] px-5 py-4 text-sm font-semibold backdrop-blur-xl">
          <BrandLogo variant="mark" size="md" />
          <span>Loading Pilot Control Room</span>
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
