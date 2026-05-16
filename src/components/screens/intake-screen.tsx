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
type EvidenceField = keyof EvidenceInputs;
type EvidenceFileState = {
  name: string;
  sizeLabel: string;
  characterCount: number;
  status: "reading" | "ready" | "error";
  error?: string;
};

const evidenceFileFields: Array<{
  field: EvidenceField;
  label: string;
  helper: string;
}> = [
  {
    field: "chinese_documentation_text",
    label: "Chinese documentation file",
    helper: "Upload translated notes, Chinese docs exported as text, or product documentation snippets."
  },
  {
    field: "website_product_text",
    label: "Website/product page file",
    helper: "Upload copied product-page text, HTML export, markdown, or public website copy."
  },
  {
    field: "technical_specs_text",
    label: "Technical specs file",
    helper: "Upload payload, speed, navigation, safety, connectivity, installation, or integration specs."
  },
  {
    field: "proof_certification_notes",
    label: "Proof/certification notes file",
    helper: "Upload CE/safety readiness notes, support proof, warranty notes, or documentation-status summaries."
  },
  {
    field: "case_study_roi_notes",
    label: "Case study/ROI/deployment file",
    helper: "Upload case study notes, ROI assumptions, deployment constraints, or pilot lessons learned."
  }
];

const readableEvidenceFileTypes = ".txt,.md,.csv,.json,.html,.htm,text/*,application/json,text/markdown,text/csv,text/html";

export function IntakeScreen({ profile, evidenceInputs, onAnalyze, onBack }: IntakeScreenProps) {
  const [draft, setDraft] = useState<ProductProfile>({ ...profile, targetMarket: "Italy" });
  const [arrayDraft, setArrayDraft] = useState<Record<ArrayField, string>>({
    benefits: profile.benefits.join("\n"),
    currentProof: profile.currentProof.join("\n"),
    constraints: profile.constraints.join("\n")
  });
  const [evidenceDraft, setEvidenceDraft] = useState<EvidenceInputs>(evidenceInputs);
  const [evidenceFiles, setEvidenceFiles] = useState<Record<EvidenceField, EvidenceFileState | null>>({
    chinese_documentation_text: null,
    website_product_text: null,
    technical_specs_text: null,
    proof_certification_notes: null,
    case_study_roi_notes: null
  });
  const isReadingEvidence = Object.values(evidenceFiles).some((file) => file?.status === "reading");

  function updateField(field: keyof ProductProfile, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function updateArrayField(field: ArrayField, value: string) {
    setArrayDraft((current) => ({ ...current, [field]: value }));
  }

  async function handleEvidenceFileChange(field: EvidenceField, file: File | null) {
    if (!file) {
      return;
    }

    setEvidenceFiles((current) => ({
      ...current,
      [field]: {
        name: file.name,
        sizeLabel: formatFileSize(file.size),
        characterCount: 0,
        status: "reading"
      }
    }));

    try {
      const text = await file.text();
      const readableText = text.trim();

      setEvidenceDraft((current) => ({
        ...current,
        [field]: formatEvidenceText(file.name, readableText)
      }));
      setEvidenceFiles((current) => ({
        ...current,
        [field]: {
          name: file.name,
          sizeLabel: formatFileSize(file.size),
          characterCount: readableText.length,
          status: "ready"
        }
      }));
    } catch {
      setEvidenceDraft((current) => ({ ...current, [field]: "" }));
      setEvidenceFiles((current) => ({
        ...current,
        [field]: {
          name: file.name,
          sizeLabel: formatFileSize(file.size),
          characterCount: 0,
          status: "error",
          error: "The browser could not read this file as text. Use a text export for this MVP."
        }
      }));
    }
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
              <EditableField label="Product name" value={draft.productName} onChange={(value) => updateField("productName", value)} />
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
            <p className="mt-2 text-sm leading-6 text-muted">
              Upload text-readable files. Files are read in the browser for this session and sent as text to the analysis API;
              nothing is stored in a database.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {evidenceFileFields.map((item) => (
              <EvidenceFileField
                key={item.field}
                label={item.label}
                helper={item.helper}
                fileState={evidenceFiles[item.field]}
                className={item.field === "case_study_roi_notes" ? "lg:col-span-2" : ""}
                onChange={(file) => void handleEvidenceFileChange(item.field, file)}
              />
            ))}
          </div>
        </section>

        <div className="flex justify-end">
          <Button type="submit" disabled={isReadingEvidence}>
            {isReadingEvidence ? "Reading evidence files" : "Run Pilot Analysis"}
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

function formatEvidenceText(fileName: string, text: string) {
  if (!text) {
    return `Source file: ${fileName}\n\nThe uploaded file did not expose readable text in the browser.`;
  }

  return `Source file: ${fileName}\n\n${text}`;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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

function EvidenceFileField({
  label,
  helper,
  fileState,
  className = "",
  onChange
}: {
  label: string;
  helper: string;
  fileState: EvidenceFileState | null;
  className?: string;
  onChange: (file: File | null) => void;
}) {
  return (
    <label className={`block rounded-md border border-border bg-[#f8faf7] p-4 ${className}`}>
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      <input
        type="file"
        accept={readableEvidenceFileTypes}
        className="mt-3 block w-full text-sm text-muted file:mr-4 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#0f684f]"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
      <span className="mt-2 block text-sm leading-6 text-muted">{helper}</span>
      {fileState ? (
        <span className="mt-3 block rounded-md border border-border bg-panel px-3 py-2 text-sm leading-6 text-muted">
          {fileState.status === "reading"
            ? `Reading ${fileState.name} (${fileState.sizeLabel})...`
            : `${fileState.name} (${fileState.sizeLabel}) - ${fileState.characterCount.toLocaleString()} readable characters`}
          {fileState.error ? <span className="block text-red-700">{fileState.error}</span> : null}
        </span>
      ) : null}
    </label>
  );
}
