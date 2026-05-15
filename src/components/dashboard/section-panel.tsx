import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type SectionPanelProps = {
  title: string;
  eyebrow?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
};

export function SectionPanel({ title, eyebrow, icon: Icon, children, className }: SectionPanelProps) {
  return (
    <section className={cn("rounded-lg border border-border bg-panel p-5 shadow-panel", className)}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          {eyebrow ? <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">{eyebrow}</p> : null}
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        </div>
        {Icon ? (
          <div className="rounded-md border border-border bg-[#f4f6f3] p-2 text-accent">
            <Icon size={18} aria-hidden="true" />
          </div>
        ) : null}
      </div>
      {children}
    </section>
  );
}
