"use client";

import { ArrowRight, FileText, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProductProfile } from "@/lib/pilot-analysis-types";

type IntakeScreenProps = {
  profile: ProductProfile;
  onAnalyze: () => void;
  onBack: () => void;
};

export function IntakeScreen({ profile, onAnalyze, onBack }: IntakeScreenProps) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-5 py-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">Product Intake</p>
          <h1 className="mt-1 text-3xl font-bold text-foreground">Review demo company profile</h1>
        </div>
        <Button variant="ghost" onClick={onBack}>
          <RotateCcw size={16} aria-hidden="true" />
          Back
        </Button>
      </header>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-border bg-panel p-5 shadow-panel">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-[#e7f3ed] text-accent">
              <FileText size={20} aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{profile.companyName}</h2>
              <p className="text-sm text-muted">{profile.productCategory}</p>
            </div>
          </div>

          <div className="grid gap-4">
            <ReadonlyField label="Target market" value={profile.targetMarket} />
            <ReadonlyField label="Pilot ambition" value={profile.pilotAmbition} />
            <ReadonlyField label="Documentation status" value={profile.documentationStatus} />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-panel p-5 shadow-panel">
          <h2 className="text-lg font-semibold text-foreground">Product description</h2>
          <textarea
            className="mt-3 min-h-32 w-full resize-none rounded-md border border-border bg-[#f8faf7] p-3 text-sm leading-6 text-foreground"
            value={profile.description}
            readOnly
          />

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <ListBlock title="Benefits" items={profile.benefits} />
            <ListBlock title="Proof available" items={profile.currentProof} />
            <ListBlock title="Known constraints" items={profile.constraints} />
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={onAnalyze}>
              Run Pilot Analysis
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      <input className="mt-2 w-full rounded-md border border-border bg-[#f8faf7] px-3 py-2 text-sm text-foreground" value={value} readOnly />
    </label>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li key={item} className="rounded-md border border-border bg-[#f8faf7] px-3 py-2 text-sm leading-5 text-muted">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
