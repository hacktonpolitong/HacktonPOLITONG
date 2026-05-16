import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  intensity?: "standard" | "strong";
};

export function GlassCard({ className, intensity = "standard", children, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border backdrop-blur-xl",
        "border-[rgba(96,165,250,0.22)] bg-[rgba(15,23,42,0.62)] text-slate-50",
        "shadow-[0_24px_80px_rgba(2,6,23,0.38)]",
        intensity === "strong" && "border-[rgba(34,211,238,0.34)] bg-[rgba(15,23,42,0.74)] shadow-[0_28px_90px_rgba(37,99,235,0.18)]",
        className
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
      {children}
    </div>
  );
}
