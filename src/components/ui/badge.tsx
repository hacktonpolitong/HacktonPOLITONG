import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  tone?: "green" | "amber" | "blue" | "red" | "neutral";
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        tone === "green" && "border-[#b7d5c8] bg-[#e7f3ed] text-accent",
        tone === "amber" && "border-[#efd0a4] bg-[#fff2de] text-amber",
        tone === "blue" && "border-[#c4d6e5] bg-[#eaf3fb] text-blue",
        tone === "red" && "border-[#e6b8b1] bg-[#fdecea] text-danger",
        tone === "neutral" && "border-border bg-[#f4f6f3] text-muted"
      )}
    >
      {children}
    </span>
  );
}
