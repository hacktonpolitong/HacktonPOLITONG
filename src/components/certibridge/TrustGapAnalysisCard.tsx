import { ShieldAlert } from "lucide-react";
import { GlassCard } from "@/components/certibridge/GlassCard";
import { RiskBadge } from "@/components/certibridge/RiskBadge";
import type { DashboardViewModel } from "@/lib/certibridge/dashboard-mappers";
import type { PilotAnalysis } from "@/lib/pilot-analysis-types";

type TrustGapAnalysisCardProps = {
  gaps: DashboardViewModel["trustGaps"];
  fullGaps: PilotAnalysis["trust_gaps"];
};

export function TrustGapAnalysisCard({ gaps, fullGaps }: TrustGapAnalysisCardProps) {
  return (
    <GlassCard className="p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/70">Buyer confidence blockers</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">Trust Gap Analysis</h2>
        </div>
        <div className="grid size-10 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
          <ShieldAlert size={18} aria-hidden="true" />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <div className="grid grid-cols-[1.05fr_110px_1.4fr] gap-3 bg-white/[0.055] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          <span>Name</span>
          <span>Risk</span>
          <span>Fix</span>
        </div>
        {gaps.slice(0, 5).map((gap) => (
          <div key={gap.id} className="grid gap-3 border-t border-white/10 px-4 py-3 text-sm md:grid-cols-[1.05fr_110px_1.4fr] md:items-center">
            <span className="font-semibold text-white">{gap.name}</span>
            <RiskBadge risk={gap.risk} className="justify-self-start" />
            <span className="leading-6 text-slate-300">{gap.fix}</span>
          </div>
        ))}
      </div>

      <details className="group mt-4 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3">
        <summary className="cursor-pointer list-none text-sm font-semibold text-cyan-100 transition hover:text-white">
          View full evidence gaps
        </summary>
        <div className="mt-3 grid gap-3">
          {fullGaps.map((gap) => (
            <div key={gap.gap_id} className="rounded-2xl border border-white/10 bg-[#020617]/35 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-white">{gap.title}</p>
                <RiskBadge risk={gap.risk_level} />
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">{gap.buyer_concern}</p>
              <p className="mt-1 text-sm leading-6 text-cyan-100">{gap.recommended_mitigation}</p>
            </div>
          ))}
        </div>
      </details>
    </GlassCard>
  );
}
