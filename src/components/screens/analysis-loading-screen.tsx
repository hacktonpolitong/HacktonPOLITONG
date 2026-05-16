"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, PackageCheck, Radar, ScanSearch, ShieldCheck, Sparkles, Target, UploadCloud } from "lucide-react";
import { motion } from "motion/react";
import { GlassCard } from "@/components/certibridge/GlassCard";

const loadingSteps = [
  {
    title: "Reading uploaded evidence",
    detail: "Parsing filenames, text documents, PDF placeholders, and founder notes.",
    icon: UploadCloud
  },
  {
    title: "Extracting product signals",
    detail: "Finding product claims, technical risk triggers, and buyer-relevant proof.",
    icon: ScanSearch
  },
  {
    title: "Classifying warehouse automation type",
    detail: "Mapping the product to AMR, AGV, picking, sorting, scanning, or orchestration categories.",
    icon: Radar
  },
  {
    title: "Mapping EU readiness gaps",
    detail: "Comparing the evidence against likely EU buyer expectations and missing proof.",
    icon: ShieldCheck
  },
  {
    title: "Building buyer fit model",
    detail: "Scoring Italian buyer segments, pilot workflow, and account fit.",
    icon: Target
  },
  {
    title: "Generating trust-gap analysis",
    detail: "Preparing objections, mitigations, proof checklist, and next actions.",
    icon: Sparkles
  },
  {
    title: "Preparing full export pack",
    detail: "Compressing results into the dashboard and professional PDF-ready report.",
    icon: PackageCheck
  }
];

const livePhrases = [
  "Checking product signals...",
  "Looking for missing proof...",
  "Mapping buyer risk...",
  "Compressing details into an executive dashboard..."
];

export function AnalysisLoadingScreen() {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const stepTimeout = window.setTimeout(() => {
      setCompletedSteps((current) => (current.includes(activeStep) ? current : [...current, activeStep]));
      setActiveStep((current) => Math.min(current + 1, loadingSteps.length - 1));
    }, activeStep < loadingSteps.length - 1 ? 760 : 1400);

    return () => window.clearTimeout(stepTimeout);
  }, [activeStep]);

  useEffect(() => {
    const phraseInterval = window.setInterval(() => {
      setPhraseIndex((current) => (current + 1) % livePhrases.length);
    }, 1200);

    return () => window.clearInterval(phraseInterval);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] px-4 py-8 text-slate-50 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(37,99,235,0.24),transparent_32%),radial-gradient(circle_at_50%_18%,rgba(34,211,238,0.2),transparent_26%),linear-gradient(0deg,rgba(2,6,23,1),rgba(7,17,31,0.95))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(148,163,184,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.2)_1px,transparent_1px)] [background-size:56px_56px]" />

      <section className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-5xl place-items-center">
        <GlassCard intensity="strong" className="w-full p-5 sm:p-7">
          <div className="grid gap-7 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <div className="relative mb-6 grid size-32 place-items-center rounded-full border border-cyan-300/20 bg-cyan-300/10 shadow-[0_0_70px_rgba(37,99,235,0.28)]">
                <motion.div
                  className="absolute inset-3 rounded-full border border-cyan-300/30"
                  animate={{ scale: [1, 1.08, 1], opacity: [0.45, 0.95, 0.45] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute inset-7 rounded-full border border-blue-400/35"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                />
                <Loader2 className="relative animate-spin text-cyan-100" size={36} aria-hidden="true" />
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/75">CertiBridge AI</p>
              <h1 className="mt-2 text-3xl font-semibold leading-tight text-white sm:text-4xl">Building your EU market-entry pack</h1>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                CertiBridge is reading your evidence, compressing the details, and preparing an executive dashboard.
              </p>
              <p className="mt-5 rounded-full border border-cyan-300/18 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-50">
                {livePhrases[phraseIndex]}
              </p>
            </div>

            <div className="grid gap-3">
              {loadingSteps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = completedSteps.includes(index);
                const isActive = activeStep === index && !isCompleted;

                return (
                  <div
                    key={step.title}
                    className={`grid gap-3 rounded-3xl border px-4 py-3 transition sm:grid-cols-[44px_1fr_auto] sm:items-center ${
                      isActive
                        ? "border-cyan-300/48 bg-cyan-300/10 shadow-[0_0_30px_rgba(34,211,238,0.16)]"
                        : isCompleted
                          ? "border-blue-400/24 bg-blue-400/[0.08]"
                          : "border-white/10 bg-white/[0.035]"
                    }`}
                  >
                    <div
                      className={`grid size-11 place-items-center rounded-2xl border ${
                        isCompleted
                          ? "border-cyan-300/28 bg-cyan-300/12 text-cyan-100"
                          : isActive
                            ? "border-cyan-300/45 bg-cyan-300/14 text-cyan-50"
                            : "border-white/10 bg-white/[0.04] text-slate-500"
                      }`}
                    >
                      <Icon size={19} aria-hidden="true" />
                    </div>
                    <div>
                      <p className={isCompleted || isActive ? "font-semibold text-white" : "font-semibold text-slate-400"}>{step.title}</p>
                      <p className="text-sm leading-6 text-slate-500">{step.detail}</p>
                    </div>
                    <div className="justify-self-start sm:justify-self-end">
                      {isCompleted ? (
                        <CheckCircle2 className="text-cyan-100" size={21} aria-hidden="true" />
                      ) : isActive ? (
                        <Loader2 className="animate-spin text-cyan-100" size={21} aria-hidden="true" />
                      ) : (
                        <span className="block size-3 rounded-full border border-white/15 bg-white/[0.04]" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </GlassCard>
      </section>
    </main>
  );
}
