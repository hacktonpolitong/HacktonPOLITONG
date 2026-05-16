import { cn } from "@/lib/utils";
import type { DashboardRisk } from "@/lib/certibridge/dashboard-mappers";

const riskClassName = {
  critical: "border-red-300/35 bg-red-500/15 text-red-100 shadow-[0_0_18px_rgba(239,68,68,0.18)]",
  high: "border-orange-300/35 bg-orange-500/15 text-orange-100 shadow-[0_0_18px_rgba(249,115,22,0.16)]",
  medium: "border-amber-300/35 bg-amber-400/14 text-amber-100 shadow-[0_0_16px_rgba(251,191,36,0.14)]",
  low: "border-emerald-300/35 bg-emerald-400/14 text-emerald-100 shadow-[0_0_16px_rgba(52,211,153,0.14)]"
} satisfies Record<DashboardRisk, string>;

type RiskBadgeProps = {
  risk: DashboardRisk;
  className?: string;
};

export function RiskBadge({ risk, className }: RiskBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center justify-center rounded-full border px-2.5 text-[11px] font-semibold uppercase tracking-wide",
        riskClassName[risk],
        className
      )}
    >
      {risk}
    </span>
  );
}
