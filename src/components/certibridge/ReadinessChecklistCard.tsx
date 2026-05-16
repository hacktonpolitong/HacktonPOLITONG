import { AlertTriangle, CheckCircle2, Circle, ClipboardList } from "lucide-react";
import { GlassCard } from "@/components/certibridge/GlassCard";
import type { DashboardViewModel } from "@/lib/certibridge/dashboard-mappers";

type ReadinessChecklistCardProps = {
  checklist: DashboardViewModel["checklist"];
  availableEvidence: string[];
  missingEvidence: string[];
};

const statusIcon = {
  checked: CheckCircle2,
  partial: AlertTriangle,
  missing: Circle
};

const statusClassName = {
  checked: "text-emerald-300",
  partial: "text-amber-300",
  missing: "text-slate-500"
};

export function ReadinessChecklistCard({ checklist, availableEvidence, missingEvidence }: ReadinessChecklistCardProps) {
  return (
    <GlassCard className="p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/70">Proof readiness</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">Checklist</h2>
        </div>
        <div className="grid size-10 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
          <ClipboardList size={18} aria-hidden="true" />
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {checklist.slice(0, 8).map((item) => {
          const Icon = statusIcon[item.status];

          return (
            <div key={item.id} className="flex min-h-12 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2">
              <Icon className={statusClassName[item.status]} size={17} aria-hidden="true" />
              <span className="text-sm leading-5 text-slate-200">{item.label}</span>
            </div>
          );
        })}
      </div>

      <details className="group mt-4 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3">
        <summary className="cursor-pointer list-none text-sm font-semibold text-cyan-100 transition hover:text-white">
          View evidence details
        </summary>
        <div className="mt-3 grid gap-3 text-sm leading-6 text-slate-300 md:grid-cols-2">
          <EvidenceColumn title="Available" items={availableEvidence} />
          <EvidenceColumn title="Missing or partial" items={missingEvidence} />
        </div>
      </details>
    </GlassCard>
  );
}

function EvidenceColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <ul className="mt-2 grid gap-1">
        {(items.length > 0 ? items.slice(0, 6) : ["No items mapped"]).map((item) => (
          <li key={item} className="text-slate-300">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
