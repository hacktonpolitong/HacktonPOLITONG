"use client";

import { CheckCircle2, Database, Gauge, Loader2, PackageCheck, ScanSearch, Target } from "lucide-react";

const modules = [
  {
    icon: ScanSearch,
    title: "Extracting product evidence",
    detail: "Category, proof assets, missing documents and deployment constraints"
  },
  {
    icon: Gauge,
    title: "Scoring Italian buyer segments",
    detail: "Process fit, proof burden, support risk and first-pilot practicality"
  },
  {
    icon: Target,
    title: "Selecting first pilot wedge",
    detail: "One bounded workflow with measurable KPIs and buyer risk reducers"
  },
  {
    icon: PackageCheck,
    title: "Assembling pilot package",
    detail: "Scope, setup, exit clause, objections, proof checklist and sales assets"
  },
  {
    icon: Database,
    title: "Preparing target account shortlist",
    detail: "Company-level matching from curated Italian logistics accounts"
  }
];

export function AnalysisLoadingScreen() {
  return (
    <main className="mx-auto grid min-h-screen w-full max-w-6xl place-items-center px-5 py-8">
      <section className="w-full overflow-hidden rounded-lg border border-border bg-panel shadow-panel">
        <div className="border-b border-border bg-[#17201b] p-6 text-white">
          <div className="mb-5 flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-md bg-white/10 text-[#9ad7bd]">
              <Loader2 className="animate-spin" size={24} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#9ad7bd]">Analysis Engine</p>
              <h1 className="text-3xl font-bold text-white">Building the Pilot Control Room</h1>
            </div>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-3/4 rounded-full bg-[#9ad7bd]" />
          </div>
        </div>

        <div className="grid gap-3 p-6">
          {modules.map((module, index) => (
            <div key={module.title} className="grid gap-4 rounded-md border border-border bg-[#f8faf7] px-4 py-3 sm:grid-cols-[44px_1fr_auto] sm:items-center">
              <div className="grid h-11 w-11 place-items-center rounded-md bg-[#e7f3ed] text-accent">
                <module.icon size={20} aria-hidden="true" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{module.title}</p>
                <p className="text-sm leading-6 text-muted">{module.detail}</p>
              </div>
              {index < 3 ? (
                <CheckCircle2 className="text-accent" size={20} aria-hidden="true" />
              ) : (
                <Loader2 className="animate-spin text-amber" size={20} aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
