"use client";

import { useState } from "react";
import { ArrowRight, FileText, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProductProfile } from "@/lib/pilot-analysis-types";

type IntakeScreenProps = {
  profile: ProductProfile;
  onAnalyze: (profile: ProductProfile) => void;
  onBack: () => void;
};

export function IntakeScreen({ profile, onAnalyze, onBack }: IntakeScreenProps) {
  const [draft, setDraft] = useState(profile);

  function updateField(field: keyof ProductProfile, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function updateList(field: "benefits" | "currentProof" | "constraints", value: string) {
    setDraft((current) => ({
      ...current,
      [field]: value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
    }));
  }

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
              <h2 className="text-lg font-semibold text-foreground">{draft.companyName}</h2>
              <p className="text-sm text-muted">{draft.productCategory}</p>
            </div>
          </div>

          <div className="grid gap-4">
            <EditableField label="Company name" value={draft.companyName} onChange={(value) => updateField("companyName", value)} />
            <EditableField label="Product category" value={draft.productCategory} onChange={(value) => updateField("productCategory", value)} />
            <LockedField label="Target market" value={draft.targetMarket} />
            <EditableField label="Pilot ambition" value={draft.pilotAmbition} onChange={(value) => updateField("pilotAmbition", value)} />
            <EditableField
              label="Documentation status"
              value={draft.documentationStatus}
              onChange={(value) => updateField("documentationStatus", value)}
            />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-panel p-5 shadow-panel">
          <h2 className="text-lg font-semibold text-foreground">Product description</h2>
          <textarea
            className="mt-3 min-h-32 w-full resize-none rounded-md border border-border bg-[#f8faf7] p-3 text-sm leading-6 text-foreground"
            value={draft.description}
            onChange={(event) => updateField("description", event.target.value)}
          />

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <ListEditor title="Benefits" items={draft.benefits} onChange={(value) => updateList("benefits", value)} />
            <ListEditor title="Proof available" items={draft.currentProof} onChange={(value) => updateList("currentProof", value)} />
            <ListEditor title="Known constraints" items={draft.constraints} onChange={(value) => updateList("constraints", value)} />
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={() => onAnalyze(draft)}>
              Run Pilot Analysis
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

function EditableField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      <input
        className="mt-2 w-full rounded-md border border-border bg-[#f8faf7] px-3 py-2 text-sm text-foreground"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function LockedField({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      <input
        className="mt-2 w-full rounded-md border border-border bg-[#eef2ec] px-3 py-2 text-sm font-semibold text-accent"
        value={value}
        readOnly
      />
    </label>
  );
}

function ListEditor({ title, items, onChange }: { title: string; items: string[]; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <textarea
        className="mt-2 min-h-40 w-full resize-none rounded-md border border-border bg-[#f8faf7] px-3 py-2 text-sm leading-6 text-muted"
        value={items.join("\n")}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
