"use client";

import { MessageSquareWarning } from "lucide-react";
import { GlassCard } from "@/components/certibridge/GlassCard";
import { RiskBadge } from "@/components/certibridge/RiskBadge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { DashboardViewModel } from "@/lib/certibridge/dashboard-mappers";

type ObjectionBattlecardsProps = {
  battlecards: DashboardViewModel["battlecards"];
};

export function ObjectionBattlecards({ battlecards }: ObjectionBattlecardsProps) {
  return (
    <GlassCard className="p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/70">Sales readiness</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">Objection Battlecards</h2>
        </div>
        <div className="grid size-10 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
          <MessageSquareWarning size={18} aria-hidden="true" />
        </div>
      </div>

      <Accordion type="single" collapsible className="gap-3">
        {battlecards.slice(0, 5).map((item, index) => (
          <AccordionItem
            key={item.id}
            value={item.id}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-1"
          >
            <AccordionTrigger className="gap-4 py-3 text-left hover:no-underline">
              <span className="flex min-w-0 flex-1 items-center gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-xl bg-cyan-300/10 text-xs font-semibold text-cyan-100">
                  {index + 1}
                </span>
                <span className="text-sm font-semibold leading-6 text-white">{item.objection}</span>
              </span>
              <RiskBadge risk={item.risk} className="mr-2 hidden sm:inline-flex" />
            </AccordionTrigger>
            <AccordionContent className="pb-4 pl-10">
              <div className="grid gap-3 text-sm leading-6 text-slate-300">
                <p>{item.answer}</p>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-cyan-100/70">Evidence to attach</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(item.evidenceToAttach.length > 0 ? item.evidenceToAttach : ["Pilot proof checklist"]).map((evidence) => (
                      <span key={evidence} className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-xs text-cyan-50">
                        {evidence}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </GlassCard>
  );
}
