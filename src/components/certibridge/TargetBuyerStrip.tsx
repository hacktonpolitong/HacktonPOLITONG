import { Target } from "lucide-react";
import type { DashboardViewModel } from "@/lib/certibridge/dashboard-mappers";
import { cn } from "@/lib/utils";

type TargetBuyerStripProps = {
  buyers: DashboardViewModel["buyers"];
  selectedBuyerId: string;
  onSelectBuyer: (buyerId: string) => void;
};

export function TargetBuyerStrip({ buyers, selectedBuyerId, onSelectBuyer }: TargetBuyerStripProps) {
  return (
    <section className="rounded-3xl border border-cyan-300/15 bg-white/[0.035] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-xl bg-cyan-300/10 text-cyan-100">
          <Target size={16} aria-hidden="true" />
        </span>
        <h2 className="text-lg font-semibold text-white">Target Best Buyer</h2>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {buyers.slice(0, 6).map((buyer) => {
          const isSelected = buyer.id === selectedBuyerId;

          return (
            <button
              key={buyer.id}
              type="button"
              className={cn(
                "min-h-[104px] w-[172px] shrink-0 rounded-2xl border p-3 text-left transition",
                "bg-[rgba(15,23,42,0.58)] hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-cyan-300/10",
                isSelected
                  ? "border-cyan-300/60 shadow-[0_0_28px_rgba(34,211,238,0.2)]"
                  : "border-white/10 shadow-[0_12px_30px_rgba(2,6,23,0.22)]"
              )}
              onClick={() => onSelectBuyer(buyer.id)}
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-200/70">{buyer.label}</span>
              <span className="mt-2 block min-h-10 text-sm font-semibold leading-5 text-white">{buyer.name}</span>
              <span className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                  <span
                    className="block h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-300"
                    style={{ width: `${Math.max(8, Math.min(100, buyer.fit))}%` }}
                  />
                </span>
                {buyer.fit}%
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
