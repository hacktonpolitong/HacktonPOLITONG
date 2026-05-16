import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ElectricButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "default" | "large";
};

export function electricButtonClasses({ size = "default", className }: { size?: "default" | "large"; className?: string } = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-300/35",
    "bg-gradient-to-r from-[#2563eb] via-[#0ea5e9] to-[#22d3ee] font-semibold text-white",
    "shadow-[0_0_28px_rgba(37,99,235,0.42)] transition duration-200",
    "hover:-translate-y-0.5 hover:shadow-[0_0_42px_rgba(34,211,238,0.52)]",
    "focus:outline-none focus:ring-2 focus:ring-cyan-300/70 focus:ring-offset-2 focus:ring-offset-[#020617]",
    "disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-65",
    size === "large" ? "min-h-12 px-6 text-base" : "min-h-10 px-4 text-sm",
    className
  );
}

export function ElectricButton({ className, size = "default", ...props }: ElectricButtonProps) {
  return <button className={electricButtonClasses({ size, className })} {...props} />;
}

export function SecondaryGlassButton({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl border border-white/12 px-4 text-sm font-semibold text-slate-200",
        "bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl transition",
        "hover:border-cyan-300/30 hover:bg-white/[0.08] hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-300/50",
        className
      )}
      {...props}
    />
  );
}
