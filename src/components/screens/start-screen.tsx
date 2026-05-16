import { ArrowRight, ClipboardCheck, Gauge, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

type StartScreenProps = {
  onStart: () => void;
};

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-8">
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

      <section className="grid flex-1 gap-8 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">For Chinese warehouse automation teams</p>
          <h2 className="mt-4 max-w-3xl text-5xl font-bold leading-tight text-foreground">
            Turn a warehouse automation product into a first Italian pilot strategy.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
            PilotOps AI helps expansion teams identify the right buyer segment, the right workflow to pilot, the
            trust gaps to close and the sales pack needed for the first credible buyer conversation.
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
        </div>

        <div className="rounded-lg border border-border bg-panel p-5 shadow-panel">
          <div className="grid gap-4">
            {[
              { icon: Target, title: "Buyer segment", body: "Find the Italian warehouse buyer most likely to approve a first pilot." },
              { icon: Gauge, title: "Pilot process", body: "Choose one measurable workflow instead of proposing broad automation." },
              { icon: ClipboardCheck, title: "Trust gaps", body: "Surface missing proof, support concerns and documentation readiness." }
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="flex gap-4 rounded-md border border-border bg-[#f8faf7] p-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[#e7f3ed] text-accent">
                    <Icon size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted">{item.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
