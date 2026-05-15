"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, FileText, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProductProfile } from "@/lib/pilot-analysis-types";

export type EvidenceInputs = {
  chinese_documentation_text: string;
  website_product_text: string;
  technical_specs_text: string;
  proof_certification_notes: string;
  case_study_roi_notes: string;
};

type IntakeSubmitPayload = {
  profile: ProductProfile;
  evidenceInputs: EvidenceInputs;
};

type IntakeScreenProps = {
  profile: ProductProfile;
  evidenceInputs: EvidenceInputs;
  onAnalyze: (payload: IntakeSubmitPayload) => void;
  onBack: () => void;
};

type ArrayField = "benefits" | "currentProof" | "constraints";

export function IntakeScreen({ profile, evidenceInputs, onAnalyze, onBack }: IntakeScreenProps) {
  const [draft, setDraft] = useState<ProductProfile>({ ...profile, targetMarket: "Italy" });
  const [arrayDraft, setArrayDraft] = useState<Record<ArrayField, string>>({
    benefits: profile.benefits.join("\n"),
    currentProof: profile.currentProof.join("\n"),
    constraints: profile.constraints.join("\n")
  });
  const [evidenceDraft, setEvidenceDraft] = useState<EvidenceInputs>(evidenceInputs);

  function updateField(field: keyof ProductProfile, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function updateArrayField(field: ArrayField, value: string) {
    setArrayDraft((current) => ({ ...current, [field]: value }));
  }

  function updateEvidenceField(field: keyof EvidenceInputs, value: string) {
    setEvidenceDraft((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onAnalyze({
      profile: {
        ...draft,
        targetMarket: "Italy",
        benefits: parseLines(arrayDraft.benefits),
        currentProof: parseLines(arrayDraft.currentProof),
        constraints: parseLines(arrayDraft.constraints)
      },
      evidenceInputs: evidenceDraft
    });
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-5 py-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">Product Intake</p>
          <h1 className="mt-1 text-3xl font-bold text-foreground">Build a market entry analysis</h1>
        </div>
        <Button type="button" variant="ghost" onClick={onBack}>
          <RotateCcw size={16} aria-hidden="true" />
          Back
        </Button>
      </header>

      <form className="grid gap-5" onSubmit={handleSubmit}>
        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-border bg-panel p-5 shadow-panel">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-md bg-[#e7f3ed] text-accent">
                <FileText size={20} aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">{draft.companyName}</h2>
                <p className="text-sm text-muted">Chinese warehouse automation profile for Italy</p>
              </div>
            </div>

            <div className="grid gap-4">
              <EditableField label="Company name" value={draft.companyName} onChange={(value) => updateField("companyName", value)} />
              <EditableField
                label="Product category"
                value={draft.productCategory}
                onChange={(value) => updateField("productCategory", value)}
              />
              <EditableField label="Target market" value="Italy" readOnly onChange={() => undefined} />
              <EditableField label="Pilot ambition" value={draft.pilotAmbition} onChange={(value) => updateField("pilotAmbition", value)} />
              <TextAreaField
                label="Documentation status"
                value={draft.documentationStatus}
                minHeightClass="min-h-28"
                onChange={(value) => updateField("documentationStatus", value)}
              />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-panel p-5 shadow-panel">
            <h2 className="text-lg font-semibold text-foreground">Product description</h2>
            <TextAreaField
              label="Description"
              value={draft.description}
              hideLabel
              minHeightClass="min-h-40"
              onChange={(value) => updateField("description", value)}
            />

            <div className="mt-5 grid gap-5 md:grid-cols-3">
              <TextAreaField
                label="Benefits"
                value={arrayDraft.benefits}
                minHeightClass="min-h-44"
                onChange={(value) => updateArrayField("benefits", value)}
              />
              <TextAreaField
                label="Current proof"
                value={arrayDraft.currentProof}
                minHeightClass="min-h-44"
                onChange={(value) => updateArrayField("currentProof", value)}
              />
              <TextAreaField
                label="Known constraints"
                value={arrayDraft.constraints}
                minHeightClass="min-h-44"
                onChange={(value) => updateArrayField("constraints", value)}
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-panel p-5 shadow-panel">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Evidence inputs</p>
            <h2 className="mt-1 text-lg font-semibold text-foreground">Documentation and proof</h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <TextAreaField
              label="Chinese documentation text"
              value={evidenceDraft.chinese_documentation_text}
              minHeightClass="min-h-36"
              onChange={(value) => updateEvidenceField("chinese_documentation_text", value)}
            />
            <TextAreaField
              label="Website/product page text"
              value={evidenceDraft.website_product_text}
              minHeightClass="min-h-36"
              onChange={(value) => updateEvidenceField("website_product_text", value)}
            />
            <TextAreaField
              label="Technical specs text"
              value={evidenceDraft.technical_specs_text}
              minHeightClass="min-h-36"
              onChange={(value) => updateEvidenceField("technical_specs_text", value)}
            />
            <TextAreaField
              label="Proof/certification notes"
              value={evidenceDraft.proof_certification_notes}
              minHeightClass="min-h-36"
              onChange={(value) => updateEvidenceField("proof_certification_notes", value)}
            />
            <TextAreaField
              label="Case study/ROI/deployment notes"
              value={evidenceDraft.case_study_roi_notes}
              minHeightClass="min-h-36"
              className="lg:col-span-2"
              onChange={(value) => updateEvidenceField("case_study_roi_notes", value)}
            />
          </div>
        </section>

        <div className="flex justify-end">
          <Button type="submit">
            Run Pilot Analysis
            <ArrowRight size={16} aria-hidden="true" />
          </Button>
        </div>
      </form>
    </main>
  );
}

function parseLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function EditableField({
  label,
  value,
  readOnly = false,
  onChange
}: {
  label: string;
  value: string;
  readOnly?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      <input
        className="mt-2 w-full rounded-md border border-border bg-[#f8faf7] px-3 py-2 text-sm text-foreground read-only:bg-[#eef2ec] read-only:font-semibold read-only:text-accent"
        value={value}
        readOnly={readOnly}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  hideLabel = false,
  minHeightClass = "min-h-28",
  className = "",
  onChange
}: {
  label: string;
  value: string;
  hideLabel?: boolean;
  minHeightClass?: string;
  className?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className={className}>
      {hideLabel ? null : <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>}
      <textarea
        className={`mt-2 w-full resize-y rounded-md border border-border bg-[#f8faf7] p-3 text-sm leading-6 text-foreground ${minHeightClass}`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
