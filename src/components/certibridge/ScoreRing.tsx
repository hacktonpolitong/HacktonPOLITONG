import { AnimatedCircularProgressBar } from "@/components/ui/animated-circular-progress-bar";
import { cn } from "@/lib/utils";

type ScoreRingProps = {
  value: number;
  className?: string;
};

export function ScoreRing({ value, className }: ScoreRingProps) {
  const normalized = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div className={cn("relative grid place-items-center", className)} aria-label={`Pilot Fit Score ${normalized} out of 100`}>
      <div className="absolute inset-3 rounded-full bg-cyan-300/10 blur-2xl" />
      <AnimatedCircularProgressBar
        value={normalized}
        gaugePrimaryColor="#22d3ee"
        gaugeSecondaryColor="rgba(148, 163, 184, 0.18)"
        className="size-44 text-5xl font-bold text-white"
      />
      <span className="pointer-events-none absolute mt-16 text-xs font-semibold uppercase tracking-wide text-cyan-100/70">/100</span>
    </div>
  );
}
