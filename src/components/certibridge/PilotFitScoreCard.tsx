import { ArrowRight, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";
import { GlassCard } from "@/components/certibridge/GlassCard";
import { ScoreRing } from "@/components/certibridge/ScoreRing";

type PilotFitScoreCardProps = {
  value: number;
  label: string;
  bullets: string[];
};

const bulletIcons = [ShieldCheck, TriangleAlert, ArrowRight];

export function PilotFitScoreCard({ value, label, bullets }: PilotFitScoreCardProps) {
  return (
    <GlassCard intensity="strong" className="p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/70">Executive signal</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">{label}</h2>
        </div>
        <div className="grid size-10 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
          <Sparkles size={18} aria-hidden="true" />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-[190px_1fr] md:items-center">
        <ScoreRing value={value} />
        <ul className="grid gap-3">
          {bullets.slice(0, 3).map((bullet, index) => {
            const Icon = bulletIcons[index] ?? ShieldCheck;

            return (
              <li key={bullet} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-cyan-300/12 text-cyan-100">
                  <Icon size={16} aria-hidden="true" />
                </span>
                <span className="text-sm leading-6 text-slate-200">{bullet}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </GlassCard>
  );
}
