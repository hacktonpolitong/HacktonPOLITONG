import { ArrowRight, BrainCircuit, ClipboardCheck, Database, Gauge, Route, ShieldCheck, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

type StartScreenProps = {
  onStart: () => void;
};

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-8">
      <header className="flex items-center justify-between border-b border-border pb-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">PilotOps AI</p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">Italian Pilot Entry Control Room</h1>
        </div>
        <Button onClick={onStart}>
          Start Analysis
          <ArrowRight size={16} aria-hidden="true" />
        </Button>
      </header>

      <section className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-[#b7d5c8] bg-[#e7f3ed] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
              Live MVP
            </span>
            <span className="rounded-full border border-[#c4d6e5] bg-[#eaf3fb] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue">
              Multi-category engine
            </span>
          </div>
          <h2 className="mt-4 max-w-3xl text-5xl font-bold leading-tight text-foreground">
            Turn one automation product into a first Italian pilot package.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
            Submit AMR, sorting, inventory scanning or palletizing evidence. The engine picks the Italian buyer segment,
            process wedge, trust gaps, target accounts and sales pack for the first credible pilot conversation.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={onStart}>
              Open Demo Flow
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
            <Button variant="secondary" onClick={onStart}>
              View Product Intake
            </Button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { value: "6", label: "Italian segments" },
              { value: "7", label: "Product categories" },
              { value: "5-10", label: "Ranked accounts" }
            ].map((metric) => (
              <div key={metric.label} className="rounded-lg border border-border bg-panel p-4 shadow-panel">
                <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-[#253329] bg-[#17201b] p-5 text-white shadow-panel">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#9ad7bd]">Decision pipeline</p>
              <h3 className="mt-1 text-xl font-semibold">From product evidence to pilot wedge</h3>
            </div>
            <BrainCircuit className="text-[#9ad7bd]" size={28} aria-hidden="true" />
          </div>
          <div className="grid gap-4">
            {[
              { icon: ClipboardCheck, title: "Evidence extracted", body: "Category, proof, missing documents and support constraints." },
              { icon: Target, title: "Segment scored", body: "Italian buyer segments ranked by process fit and pilotability." },
              { icon: Route, title: "Pilot wedge selected", body: "One bounded workflow with KPIs, scope and exit conditions." },
              { icon: Database, title: "Accounts ranked", body: "Curated company-level target accounts matched to the chosen wedge." },
              { icon: ShieldCheck, title: "Guardrails applied", body: "No live-scraping, personal-contact or guaranteed-buyer claims." },
              { icon: Gauge, title: "Control Room assembled", body: "Dashboard-ready output with sales pack and next actions." }
            ].map((item) => (
              <div key={item.title} className="flex gap-4 rounded-md border border-white/10 bg-white/[0.06] p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[#9ad7bd]/15 text-[#9ad7bd]">
                  <item.icon size={20} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-white/70">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
