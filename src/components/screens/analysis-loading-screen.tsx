"use client";

import { CheckCircle2, Loader2 } from "lucide-react";

const modules = [
  "Parsing product profile",
  "Matching Italian warehouse segments",
  "Selecting pilot workflow",
  "Identifying buyer trust gaps",
  "Generating pilot offer",
  "Preparing sales pack"
];

export function AnalysisLoadingScreen() {
  return (
    <main className="mx-auto grid min-h-screen w-full max-w-5xl place-items-center px-5 py-8">
      <section className="w-full rounded-lg border border-border bg-panel p-6 shadow-panel">
        <div className="mb-6 flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-md bg-[#e7f3ed] text-accent">
            <Loader2 className="animate-spin" size={24} aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">Analysis Engine</p>
            <h1 className="text-3xl font-bold text-foreground">Building the Pilot Control Room</h1>
          </div>
        </div>

        <div className="grid gap-3">
          {modules.map((module, index) => (
            <div key={module} className="flex items-center justify-between rounded-md border border-border bg-[#f8faf7] px-4 py-3">
              <div>
                <p className="font-semibold text-foreground">{module}</p>
                <p className="text-sm text-muted">Structured output module {index + 1}</p>
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
