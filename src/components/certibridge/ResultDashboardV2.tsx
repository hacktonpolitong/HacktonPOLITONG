"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ExternalLink, FileStack, PackageCheck, RefreshCw } from "lucide-react";
import { BestBuyerSegmentCard } from "@/components/certibridge/BestBuyerSegmentCard";
import { BrandLogo } from "@/components/certibridge/BrandLogo";
import { FullPackPdfButton } from "@/components/certibridge/FullPackPdfButton";
import { GlassCard } from "@/components/certibridge/GlassCard";
import { ObjectionBattlecards } from "@/components/certibridge/ObjectionBattlecards";
import { PilotFitScoreCard } from "@/components/certibridge/PilotFitScoreCard";
import { ReadinessChecklistCard } from "@/components/certibridge/ReadinessChecklistCard";
import { SecondaryGlassButton } from "@/components/certibridge/ElectricButton";
import { TargetBuyerStrip } from "@/components/certibridge/TargetBuyerStrip";
import { TrustGapAnalysisCard } from "@/components/certibridge/TrustGapAnalysisCard";
import { BlurFade } from "@/components/ui/blur-fade";
import { mapPilotAnalysisToDashboardViewModel } from "@/lib/certibridge/dashboard-mappers";
import type { PilotAnalysis, ProductProfile } from "@/lib/pilot-analysis-types";

type ResultDashboardV2Props = {
  profile: ProductProfile;
  analysis: PilotAnalysis;
  onRestart: () => void;
};

export function ResultDashboardV2({ profile, analysis, onRestart }: ResultDashboardV2Props) {
  const dashboard = useMemo(() => mapPilotAnalysisToDashboardViewModel(analysis, profile), [analysis, profile]);
  const [selectedBuyerId, setSelectedBuyerId] = useState(dashboard.buyers[0]?.id ?? "");
  const selectedBuyer = dashboard.buyers.find((buyer) => buyer.id === selectedBuyerId) ?? dashboard.buyers[0];
  const availableEvidence = analysis.proof_checklist.filter((item) => item.status === "available").map((item) => item.name);
  const missingEvidence = analysis.proof_checklist.filter((item) => item.status !== "available").map((item) => item.name);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(37,99,235,0.18),transparent_28%),linear-gradient(110deg,rgba(34,211,238,0.13),transparent_34%),linear-gradient(0deg,rgba(15,23,42,0.92),rgba(2,6,23,1))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.18)_1px,transparent_1px)] [background-size:56px_56px]" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <BlurFade delay={0.02}>
          <header className="flex flex-col gap-4 rounded-3xl border border-cyan-300/15 bg-white/[0.035] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <BrandLogo variant="lockup" size="sm" className="mb-3" />
              <h1 className="mt-1 text-2xl font-semibold leading-tight text-white sm:text-3xl">{dashboard.productSummary.name}</h1>
              <p className="mt-1 text-sm text-slate-400">{dashboard.productSummary.company}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {dashboard.productSummary.chips.slice(0, 4).map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-cyan-300/18 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-50"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-start">
              <FullPackPdfButton profile={profile} analysis={analysis} />
              <SecondaryGlassButton className="min-h-12 px-5" onClick={onRestart}>
                <RefreshCw size={16} aria-hidden="true" />
                New analysis
              </SecondaryGlassButton>
            </div>
          </header>
        </BlurFade>

        <BlurFade delay={0.06}>
          <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <PilotFitScoreCard value={dashboard.score.value} label={dashboard.score.label} bullets={dashboard.score.bullets} />
            <ReadinessChecklistCard
              checklist={dashboard.checklist}
              availableEvidence={availableEvidence.length > 0 ? availableEvidence : analysis.product_summary.available_proof}
              missingEvidence={missingEvidence.length > 0 ? missingEvidence : analysis.product_summary.missing_proof}
            />
          </section>
        </BlurFade>

        <BlurFade delay={0.1}>
          <TargetBuyerStrip buyers={dashboard.buyers} selectedBuyerId={selectedBuyer.id} onSelectBuyer={setSelectedBuyerId} />
        </BlurFade>

        <BlurFade delay={0.14}>
          <BestBuyerSegmentCard buyer={selectedBuyer} />
        </BlurFade>

        <BlurFade delay={0.18}>
          <TrustGapAnalysisCard gaps={dashboard.trustGaps} fullGaps={analysis.trust_gaps} />
        </BlurFade>

        <BlurFade delay={0.22}>
          <ObjectionBattlecards battlecards={dashboard.battlecards} />
        </BlurFade>

        <BlurFade delay={0.26}>
          <FullTechnicalDetails analysis={analysis} />
        </BlurFade>
      </div>
    </main>
  );
}

function FullTechnicalDetails({ analysis }: { analysis: PilotAnalysis }) {
  return (
    <details className="group rounded-3xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-cyan-100 transition hover:text-white">
        Full technical details
        <span className="rounded-full border border-cyan-300/20 px-3 py-1 text-xs text-slate-300 group-open:bg-cyan-300/10">Expand</span>
      </summary>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <DetailPanel title="Recommended Pilot Offer" icon={PackageCheck}>
          <KeyValue label="Duration" value={`${analysis.pilot_offer.duration_days} days`} />
          <KeyValue label="Scope" value={analysis.pilot_offer.scope} />
          <KeyValue label="Setup" value={analysis.pilot_offer.required_setup.join(", ")} />
          <KeyValue label="Next step" value={analysis.pilot_offer.next_commercial_step} />
        </DetailPanel>

        <DetailPanel title="Sales Pack" icon={FileStack}>
          <KeyValue label="Outreach subject" value={analysis.sales_pack.outreach_email.subject} />
          <KeyValue label="Meeting pitch" value={analysis.sales_pack.meeting_pitch} />
          <KeyValue label="ROI argument" value={analysis.sales_pack.roi_argument} />
        </DetailPanel>

        <DetailPanel title="Target Account Shortlist" icon={ExternalLink} className="lg:col-span-2">
          <div className="grid gap-3 md:grid-cols-2">
            {analysis.target_account_shortlist.slice(0, 6).map((account, index) => (
              <article key={account.company_name} className="rounded-2xl border border-white/10 bg-[#020617]/35 p-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-cyan-100/70">
                  <span>Rank {index + 1}</span>
                  <span>{account.hq_region ?? "Region to verify"}</span>
                  <span>{account.logistics_category}</span>
                </div>
                <h4 className="mt-2 font-semibold text-white">{account.company_name}</h4>
                <a className="mt-1 inline-flex items-center gap-1 text-sm text-cyan-100 hover:text-white" href={account.website} target="_blank" rel="noreferrer">
                  Official website
                  <ExternalLink size={13} aria-hidden="true" />
                </a>
                <p className="mt-2 text-sm leading-6 text-slate-300">{account.outreach_angle}</p>
              </article>
            ))}
          </div>
        </DetailPanel>

        <DetailPanel title="Next 7 Days Action Plan" icon={CalendarDays} className="lg:col-span-2">
          <div className="grid gap-2">
            {analysis.next_7_days_plan.map((item) => (
              <div key={item.day} className="grid gap-2 rounded-2xl border border-white/10 bg-[#020617]/35 p-3 sm:grid-cols-[90px_1fr_160px]">
                <span className="text-sm font-semibold text-cyan-100">Day {item.day}</span>
                <span className="text-sm leading-6 text-slate-300">{item.action}</span>
                <span className="text-sm text-slate-400">{item.output}</span>
              </div>
            ))}
          </div>
        </DetailPanel>
      </div>
    </details>
  );
}

function DetailPanel({
  title,
  icon: Icon,
  className = "",
  children
}: {
  title: string;
  icon: typeof PackageCheck;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <GlassCard className={`p-4 ${className}`}>
      <div className="mb-4 flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-xl bg-cyan-300/10 text-cyan-100">
          <Icon size={16} aria-hidden="true" />
        </span>
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      {children}
    </GlassCard>
  );
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-2 rounded-2xl border border-white/10 bg-[#020617]/35 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm leading-6 text-slate-200">{value}</p>
    </div>
  );
}
