import { Check, Minus, Send } from "lucide-react";
import { GlassCard } from "@/components/certibridge/GlassCard";
import type { DashboardViewModel } from "@/lib/certibridge/dashboard-mappers";

type BestBuyerSegmentCardProps = {
  buyer: DashboardViewModel["buyers"][number];
};

export function BestBuyerSegmentCard({ buyer }: BestBuyerSegmentCardProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-[1.35fr_0.8fr_0.8fr]">
      <GlassCard className="p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/70">Best first wedge</p>
        <h2 className="mt-2 text-2xl font-semibold leading-tight text-white">Best First Buyer Segment</h2>
        <h3 className="mt-4 text-xl font-semibold text-cyan-100">{buyer.name}</h3>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{buyer.reason}</p>
        <div className="mt-5 rounded-2xl border border-cyan-300/16 bg-cyan-300/[0.06] p-4">
          <div className="flex gap-3">
            <Send className="mt-0.5 shrink-0 text-cyan-200" size={17} aria-hidden="true" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-100/70">First pitch angle</p>
              <p className="mt-1 text-sm leading-6 text-slate-200">{buyer.pitchAngle}</p>
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <h3 className="text-xl font-semibold text-white">Pro</h3>
        <ul className="mt-4 grid gap-3">
          {buyer.pros.slice(0, 3).map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-6 text-slate-200">
              <Check className="mt-1 shrink-0 text-emerald-300" size={16} aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </GlassCard>

      <GlassCard className="p-5">
        <h3 className="text-xl font-semibold text-white">Cons</h3>
        <ul className="mt-4 grid gap-3">
          {buyer.cons.slice(0, 3).map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-6 text-slate-200">
              <Minus className="mt-1 shrink-0 text-amber-300" size={16} aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </GlassCard>
    </section>
  );
}
