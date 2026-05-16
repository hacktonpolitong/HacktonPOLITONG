"use client";

import { useMemo, useRef, useState } from "react";
import type { ChangeEvent, DragEvent, KeyboardEvent } from "react";
import { ArrowDown, ArrowRight, CheckCircle2, Edit3, FileText, Sparkles, UploadCloud, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { ElectricButton, SecondaryGlassButton } from "@/components/certibridge/ElectricButton";
import { GlassCard } from "@/components/certibridge/GlassCard";
import { BlurFade } from "@/components/ui/blur-fade";
import { demoProductProfile } from "@/lib/mock-pilot-analysis";
import type { EvidenceInputs as AnalysisEvidenceInputs, ProductProfile } from "@/lib/pilot-analysis-types";
import {
  buildProductProfileFromType,
  getProductTypeConfig,
  productTypeConfigs
} from "@/lib/certibridge/product-type-mapper";

export type EvidenceInputs = Required<Pick<
  AnalysisEvidenceInputs,
  "chinese_documentation_text" | "website_product_text" | "technical_specs_text" | "proof_certification_notes" | "case_study_roi_notes"
>>;

type IntakeSubmitPayload = {
  profile: ProductProfile;
  evidenceInputs: EvidenceInputs;
};

type IntakeScreenProps = {
  profile: ProductProfile;
  evidenceInputs: EvidenceInputs;
  onAnalyze: (payload: IntakeSubmitPayload) => void;
};

type UploadedEvidenceDocument = {
  id: string;
  name: string;
  extension: string;
  sizeLabel: string;
  content: string;
  note?: string;
};

const acceptedExtensions = [".pdf", ".txt", ".md", ".markdown"];

const demoEvidenceDocument: UploadedEvidenceDocument = {
  id: "demo-amr-evidence",
  name: "demo-amr-evidence.md",
  extension: ".md",
  sizeLabel: "1.4 KB",
  content:
    "AMR fleet used for tote movement between picking and packing in Chinese fulfilment operations.\nPayload 300 kg, SLAM navigation, obstacle detection, fleet dashboard, REST API and CSV task import.\nPartial CE/safety summary available; Italian support model and localized ROI assumptions still need buyer-ready packaging."
};

export function IntakeScreen({ profile, evidenceInputs, onAnalyze }: IntakeScreenProps) {
  const [companyName, setCompanyName] = useState(profile.companyName);
  const [isCompanyLocked, setIsCompanyLocked] = useState(Boolean(profile.companyName.trim()));
  const [productTypeId, setProductTypeId] = useState("");
  const [productName, setProductName] = useState(profile.productName);
  const [description, setDescription] = useState("");
  const [documents, setDocuments] = useState<UploadedEvidenceDocument[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedProductConfig = useMemo(
    () => (productTypeId ? getProductTypeConfig(productTypeId) : null),
    [productTypeId]
  );
  const canAnalyze =
    isCompanyLocked &&
    companyName.trim().length > 0 &&
    productTypeId.length > 0 &&
    productName.trim().length > 0 &&
    (documents.length > 0 || description.trim().length >= 18);
  const disabledHelper = getDisabledHelper({
    companyName,
    productTypeId,
    productName,
    documentsCount: documents.length,
    description
  });

  function scrollToWorkflow() {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function commitCompanyName() {
    const trimmed = companyName.trim();

    if (!trimmed) {
      setValidationMessage("Enter your company name to continue.");
      return;
    }

    setCompanyName(trimmed);
    setIsCompanyLocked(true);
    setValidationMessage("");
  }

  function handleCompanyKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      commitCompanyName();
    }
  }

  function handleProductNameKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !canAnalyze) {
      event.preventDefault();
      setValidationMessage(disabledHelper);
    }
  }

  async function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    await addFiles(event.target.files);
    event.target.value = "";
  }

  async function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    await addFiles(event.dataTransfer.files);
  }

  async function addFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) {
      return;
    }

    setFileError(null);
    const nextDocuments: UploadedEvidenceDocument[] = [];
    const rejected: string[] = [];

    for (const file of Array.from(fileList)) {
      const extension = getFileExtension(file.name);

      if (!acceptedExtensions.includes(extension)) {
        rejected.push(file.name);
        continue;
      }

      if (extension === ".pdf") {
        nextDocuments.push({
          id: createDocumentId(file),
          name: file.name,
          extension,
          sizeLabel: formatFileSize(file.size),
          content: `PDF uploaded: ${file.name}. Text extraction is not available in demo mode. Ask the user to paste relevant text if deeper evidence extraction is needed.`,
          note: "PDF accepted. Text extraction depends on local parser availability."
        });
        continue;
      }

      try {
        const text = (await file.text()).trim();
        nextDocuments.push({
          id: createDocumentId(file),
          name: file.name,
          extension,
          sizeLabel: formatFileSize(file.size),
          content: text || `Text file uploaded: ${file.name}. No readable text was found.`
        });
      } catch {
        rejected.push(file.name);
      }
    }

    if (nextDocuments.length > 0) {
      setDocuments((current) => [...current, ...nextDocuments]);
      setValidationMessage("");
    }

    if (rejected.length > 0) {
      setFileError(`Unsupported or unreadable file: ${rejected.join(", ")}. Use PDF, TXT, MD, or Markdown.`);
    }
  }

  function removeDocument(documentId: string) {
    setDocuments((current) => current.filter((document) => document.id !== documentId));
  }

  function loadDemoAmr() {
    setCompanyName(demoProductProfile.companyName);
    setIsCompanyLocked(true);
    setProductTypeId("amr");
    setProductName(demoProductProfile.productName);
    setDescription(demoProductProfile.description);
    setDocuments([demoEvidenceDocument]);
    setValidationMessage("");
    setFileError(null);
  }

  function handleAnalyze() {
    if (!canAnalyze) {
      setValidationMessage(disabledHelper);
      return;
    }

    const uploadedEvidenceText = documents.map(formatDocumentEvidence).join("\n\n");
    const productProfile = buildProductProfileFromType({
      companyName,
      productName,
      productTypeId,
      description,
      uploadedEvidenceText
    });
    const nextEvidenceInputs = buildEvidenceInputs(documents, description, evidenceInputs);

    onAnalyze({
      profile: productProfile,
      evidenceInputs: nextEvidenceInputs
    });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(37,99,235,0.24),transparent_30%),linear-gradient(125deg,rgba(34,211,238,0.16),transparent_36%),radial-gradient(circle_at_82%_14%,rgba(34,211,238,0.18),transparent_26%),linear-gradient(0deg,rgba(2,6,23,1),rgba(7,17,31,0.96))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.15] [background-image:linear-gradient(rgba(148,163,184,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.2)_1px,transparent_1px)] [background-size:60px_60px]" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/80">CertiBridge AI</p>
            <p className="mt-1 text-sm text-slate-500">EU readiness engine for warehouse automation suppliers</p>
          </div>
          <button
            type="button"
            className="hidden rounded-full border border-cyan-300/20 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-200 backdrop-blur-xl transition hover:border-cyan-300/40 hover:bg-white/[0.08] sm:inline-flex"
            onClick={loadDemoAmr}
          >
            Load demo AMR
          </button>
        </header>

        <section className="grid min-h-[calc(100vh-140px)] gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="order-2 lg:order-1">
            <BlurFade delay={0.05}>
              <GlassCard intensity="strong" className="p-5 sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/70">Try it now</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Start with one product signal.</h2>
                  </div>
                  <button
                    type="button"
                    className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/15 sm:hidden"
                    onClick={loadDemoAmr}
                  >
                    Load demo AMR
                  </button>
                </div>

                <div className="grid gap-4">
                  <CompanyStep
                    companyName={companyName}
                    isLocked={isCompanyLocked}
                    onChange={setCompanyName}
                    onCommit={commitCompanyName}
                    onEdit={() => setIsCompanyLocked(false)}
                    onKeyDown={handleCompanyKeyDown}
                  />

                  <AnimatePresence>
                    {isCompanyLocked ? (
                      <motion.div
                        key="product-type"
                        initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.24 }}
                      >
                        <label className="grid gap-2">
                          <span className="text-sm font-semibold text-slate-200">Product type</span>
                          <select
                            className="min-h-12 rounded-2xl border border-cyan-300/20 bg-[#020617]/60 px-4 text-sm font-semibold text-white outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/30"
                            value={productTypeId}
                            onChange={(event) => {
                              setProductTypeId(event.target.value);
                              setValidationMessage("");
                            }}
                          >
                            <option value="">Select warehouse automation product</option>
                            {productTypeConfigs.map((config) => (
                              <option key={config.id} value={config.id} className="bg-[#020617] text-white">
                                {config.label}
                              </option>
                            ))}
                          </select>
                        </label>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  <AnimatePresence>
                    {selectedProductConfig ? (
                      <motion.div
                        key="product-form"
                        initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-3xl border border-cyan-300/18 bg-[#020617]/45 p-4"
                      >
                        <div className="grid gap-4">
                          <label className="grid gap-2">
                            <span className="text-sm font-semibold text-slate-200">Product name</span>
                            <input
                              className="min-h-12 rounded-2xl border border-cyan-300/20 bg-white/[0.04] px-4 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/30"
                              placeholder="e.g. NovaPick AMR-120"
                              value={productName}
                              onChange={(event) => setProductName(event.target.value)}
                              onKeyDown={handleProductNameKeyDown}
                            />
                          </label>

                          <div>
                            <p className="mb-2 text-sm font-semibold text-slate-200">Upload documentation</p>
                            <div
                              className={`rounded-3xl border border-dashed p-4 transition ${
                                isDragging
                                  ? "border-cyan-300/70 bg-cyan-300/10"
                                  : "border-cyan-300/24 bg-white/[0.035] hover:border-cyan-300/45"
                              }`}
                              onDragOver={(event) => {
                                event.preventDefault();
                                setIsDragging(true);
                              }}
                              onDragLeave={() => setIsDragging(false)}
                              onDrop={(event) => void handleDrop(event)}
                            >
                              <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept=".pdf,.txt,.md,.markdown,text/plain,text/markdown,application/pdf"
                                className="hidden"
                                onChange={(event) => void handleFileInputChange(event)}
                              />
                              <button
                                type="button"
                                className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-[#020617]/35 px-4 py-6 text-center transition hover:border-cyan-300/30 hover:bg-white/[0.05]"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                <span className="grid size-11 place-items-center rounded-2xl bg-cyan-300/10 text-cyan-100">
                                  <UploadCloud size={22} aria-hidden="true" />
                                </span>
                                <span>
                                  <span className="block font-semibold text-white">Drop PDF, TXT, or Markdown files here</span>
                                  <span className="mt-1 block text-sm text-slate-400">Multiple documents accepted. PDF text extraction is demo-limited.</span>
                                </span>
                              </button>
                            </div>

                            {fileError ? <p className="mt-2 text-sm text-red-200">{fileError}</p> : null}

                            {documents.length > 0 ? (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {documents.map((document) => (
                                  <DocumentChip key={document.id} document={document} onRemove={() => removeDocument(document.id)} />
                                ))}
                              </div>
                            ) : null}
                          </div>

                          <label className="grid gap-2">
                            <div className="flex items-end justify-between gap-3">
                              <span className="text-sm font-semibold text-slate-200">Short description</span>
                              <span className="text-xs text-slate-500">{description.length.toLocaleString()} chars</span>
                            </div>
                            <textarea
                              className="min-h-28 resize-y rounded-2xl border border-cyan-300/16 bg-white/[0.035] p-4 text-sm leading-6 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/25"
                              placeholder="Optional: describe intended use, target buyer, current market status, or missing documentation"
                              value={description}
                              onChange={(event) => setDescription(event.target.value)}
                            />
                          </label>

                          <div className="grid gap-2">
                            <ElectricButton type="button" size="large" disabled={!canAnalyze} onClick={handleAnalyze}>
                              <Sparkles size={18} aria-hidden="true" />
                              Analyze EU readiness
                            </ElectricButton>
                            <p className={`text-sm ${canAnalyze ? "text-cyan-100/70" : "text-slate-400"}`}>
                              {validationMessage || (canAnalyze ? "Ready to build the dashboard." : disabledHelper)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </GlassCard>
            </BlurFade>
          </div>

          <div className="order-1 flex flex-col items-start pt-4 lg:order-2 lg:items-end lg:pt-16">
            <BlurFade delay={0.02} className="max-w-3xl lg:text-right">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100 backdrop-blur-xl">
                <span className="size-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.9)]" />
                EU market-entry pack
              </div>
              <h1 className="text-4xl font-semibold leading-[0.96] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Turn warehouse automation docs into an EU market-entry pack.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 lg:ml-auto">
                Upload Chinese product evidence. CertiBridge AI builds a buyer-readiness dashboard, trust-gap analysis,
                and professional full-pack export.
              </p>
              <div className="mt-7 flex flex-wrap gap-3 lg:justify-end">
                <SecondaryGlassButton type="button" className="min-h-12 px-5" onClick={scrollToWorkflow}>
                  How does it work?
                  <ArrowDown size={16} aria-hidden="true" />
                </SecondaryGlassButton>
              </div>
            </BlurFade>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-8 pb-12">
          <BlurFade inView>
            <div className="mb-5 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/75">Workflow</p>
              <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">How CertiBridge AI works</h2>
              <p className="mt-3 text-slate-400">From raw supplier documentation to a buyer-ready EU entry pack.</p>
            </div>
          </BlurFade>

          <div className="grid gap-4 md:grid-cols-4">
            {workflowSteps.map((step, index) => (
              <BlurFade key={step.title} delay={index * 0.04} inView>
                <GlassCard className="h-full p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="grid size-9 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-sm font-semibold text-cyan-100">
                      {index + 1}
                    </span>
                    <step.icon className="text-cyan-100/75" size={20} aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{step.description}</p>
                </GlassCard>
              </BlurFade>
            ))}
          </div>

          <GlassCard className="mt-5 p-4">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {["Pilot Fit Score", "Readiness Checklist", "Target Best Buyer", "Trust Gap Analysis", "Objection Battlecards", "Full PDF Pack"].map(
                (item) => (
                  <span key={item} className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold text-cyan-50">
                    {item}
                  </span>
                )
              )}
            </div>
          </GlassCard>
        </section>
      </div>
    </main>
  );
}

const workflowSteps = [
  {
    title: "Upload product evidence",
    description: "Specs, manuals, test reports, labels, certificates, or short product notes.",
    icon: UploadCloud
  },
  {
    title: "Extract product signals",
    description: "AI and rules identify product type, risk triggers, missing proof, and buyer-relevant claims.",
    icon: Sparkles
  },
  {
    title: "Map EU readiness gaps",
    description: "The system compares available evidence against likely EU market-entry expectations.",
    icon: CheckCircle2
  },
  {
    title: "Generate the full pack",
    description: "You get a focused dashboard, trust-gap analysis, buyer battlecards, and a professional PDF export.",
    icon: FileText
  }
];

function CompanyStep({
  companyName,
  isLocked,
  onChange,
  onCommit,
  onEdit,
  onKeyDown
}: {
  companyName: string;
  isLocked: boolean;
  onChange: (value: string) => void;
  onCommit: () => void;
  onEdit: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}) {
  if (isLocked) {
    return (
      <button
        type="button"
        className="flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 text-left text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/15"
        onClick={onEdit}
      >
        <span className="truncate">{companyName}</span>
        <Edit3 size={16} aria-hidden="true" />
      </button>
    );
  }

  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-200">Company name</span>
      <div className="flex gap-2">
        <input
          autoFocus
          className="min-h-12 flex-1 rounded-2xl border border-cyan-300/20 bg-[#020617]/60 px-4 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/30"
          placeholder="Enter your company name"
          value={companyName}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
        />
        <button
          type="button"
          className="grid min-h-12 w-12 shrink-0 place-items-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 text-cyan-100 transition hover:bg-cyan-300/20"
          onClick={onCommit}
          aria-label="Continue to product type"
        >
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </label>
  );
}

function DocumentChip({
  document,
  onRemove
}: {
  document: UploadedEvidenceDocument;
  onRemove: () => void;
}) {
  return (
    <div className="max-w-full rounded-2xl border border-cyan-300/16 bg-white/[0.045] px-3 py-2">
      <div className="flex items-start gap-2">
        <FileText className="mt-0.5 shrink-0 text-cyan-100" size={16} aria-hidden="true" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{document.name}</p>
          <p className="text-xs text-slate-500">
            {document.extension.toUpperCase().replace(".", "")} · {document.sizeLabel}
          </p>
          {document.note ? <p className="mt-1 text-xs text-cyan-100/70">{document.note}</p> : null}
        </div>
        <button
          type="button"
          className="ml-1 grid size-7 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-white/10 hover:text-white"
          onClick={onRemove}
          aria-label={`Remove ${document.name}`}
        >
          <X size={14} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function buildEvidenceInputs(
  documents: UploadedEvidenceDocument[],
  description: string,
  currentEvidence: EvidenceInputs
): EvidenceInputs {
  const documentEvidence = documents.map(formatDocumentEvidence).join("\n\n");
  const pdfNotes = documents
    .filter((document) => document.extension === ".pdf")
    .map((document) => `${document.name}: PDF accepted; text extraction is not available in demo mode.`)
    .join("\n");
  const founderDescription = description.trim()
    ? `Title: Founder product description\nDocument type: Other\nLanguage: Unknown\nContent:\n${description.trim()}`
    : "";

  return {
    chinese_documentation_text: documentEvidence || currentEvidence.chinese_documentation_text || "",
    website_product_text: founderDescription || currentEvidence.website_product_text || "",
    technical_specs_text: documentEvidence || currentEvidence.technical_specs_text || "",
    proof_certification_notes: [pdfNotes, currentEvidence.proof_certification_notes].filter(Boolean).join("\n\n"),
    case_study_roi_notes: founderDescription || currentEvidence.case_study_roi_notes || ""
  };
}

function formatDocumentEvidence(document: UploadedEvidenceDocument) {
  return `Title: ${document.name}
Document type: ${inferDocumentType(document.extension)}
Language: Unknown
Filename: ${document.name}
Content:
${document.content}`;
}

function inferDocumentType(extension: string) {
  if (extension === ".pdf") {
    return "PDF";
  }

  if (extension === ".md" || extension === ".markdown") {
    return "Markdown";
  }

  return "TXT";
}

function getDisabledHelper(input: {
  companyName: string;
  productTypeId: string;
  productName: string;
  documentsCount: number;
  description: string;
}) {
  if (!input.companyName.trim()) {
    return "Enter your company name to begin.";
  }

  if (!input.productTypeId) {
    return "Select a product type to continue.";
  }

  if (!input.productName.trim() || (input.documentsCount === 0 && input.description.trim().length < 18)) {
    return "Add a product name and at least one document or description.";
  }

  return "";
}

function getFileExtension(fileName: string) {
  const lastDotIndex = fileName.lastIndexOf(".");

  if (lastDotIndex === -1) {
    return "";
  }

  return fileName.slice(lastDotIndex).toLowerCase();
}

function createDocumentId(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`;
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
