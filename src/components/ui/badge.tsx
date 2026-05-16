import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "green" | "amber" | "blue" | "red" | "neutral";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
};

const toneClasses = {
  green: "border-[#b7d5c8] bg-[#e7f3ed] text-accent",
  amber: "border-[#efd0a4] bg-[#fff2de] text-amber",
  blue: "border-[#c4d6e5] bg-[#eaf3fb] text-blue",
  red: "border-[#e6b8b1] bg-[#fdecea] text-danger",
  neutral: "border-border bg-[#f4f6f3] text-muted"
} satisfies Record<BadgeTone, string>;

const variantTone = {
  default: "blue",
  secondary: "neutral",
  destructive: "red",
  outline: "neutral",
  ghost: "neutral",
  link: "blue"
} satisfies Record<NonNullable<BadgeProps["variant"]>, BadgeTone>;

export function Badge({ children, className, tone, variant = "default", ...props }: BadgeProps) {
  const resolvedTone = tone ?? variantTone[variant];

  return (
    <span
      className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold", toneClasses[resolvedTone], className)}
      {...props}
    >
      {children}
    </span>
  );
}
