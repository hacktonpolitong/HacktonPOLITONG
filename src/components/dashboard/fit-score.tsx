type FitScoreProps = {
  value: number;
  label: string;
  rationale: string;
};

export function FitScore({ value, label, rationale }: FitScoreProps) {
  const normalized = Math.max(0, Math.min(100, value));

  return (
    <div className="grid gap-5 md:grid-cols-[160px_1fr] md:items-center">
      <div
        className="grid aspect-square place-items-center rounded-full border-[14px] border-[#dfe7db]"
        style={{
          background: `conic-gradient(#245c47 ${normalized * 3.6}deg, #dfe7db 0deg)`
        }}
        aria-label={`Pilot fit score ${normalized} out of 100`}
      >
        <div className="grid h-[104px] w-[104px] place-items-center rounded-full bg-panel text-center">
          <div>
            <div className="text-4xl font-bold text-foreground">{normalized}</div>
            <div className="text-xs font-semibold uppercase text-muted">fit score</div>
          </div>
        </div>
      </div>
      <div>
        <p className="text-xl font-semibold text-foreground">{label}</p>
        <p className="mt-2 text-sm leading-6 text-muted">{rationale}</p>
      </div>
    </div>
  );
}
