import {
  CalendarDays,
  ClipboardCheck,
  ExternalLink,
  FileStack,
  Gauge,
  Lightbulb,
  MapPinned,
  MessageSquareWarning,
  PackageCheck,
  ShieldAlert,
  Sparkles,
  Target
} from "lucide-react";
import { FitScore } from "@/components/dashboard/fit-score";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { ReadinessPill, RiskPill } from "@/components/dashboard/status-pill";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PilotAnalysis, ProductProfile } from "@/lib/pilot-analysis-types";

type ControlRoomScreenProps = {
  profile: ProductProfile;
  analysis: PilotAnalysis;
  onRestart: () => void;
};

export function ControlRoomScreen({ profile, analysis, onRestart }: ControlRoomScreenProps) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-5 py-8">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">Pilot Control Room</p>
          <h1 className="mt-1 text-3xl font-bold text-foreground">{profile.companyName}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            {profile.productCategory} entering {profile.targetMarket}. Structured pilot strategy for the first credible Italian buyer conversation.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">Export Pack</Button>
          <Button onClick={onRestart}>New Analysis</Button>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-12">
        <SectionPanel title="Pilot Fit Score" eyebrow="Readiness" icon={Gauge} className="lg:col-span-5">
          <FitScore
            value={analysis.buyer_segment_recommendation.fit_score}
            label="Strong pilot fit"
            rationale="The AMR use case can be isolated in one workflow, measured quickly and positioned as lower risk than a full automation redesign."
          />
        </SectionPanel>

        <SectionPanel title="Best First Buyer Segment" eyebrow="Target" icon={Target} className="lg:col-span-7">
          <h3 className="text-xl font-semibold text-foreground">{analysis.buyer_segment_recommendation.segment_name}</h3>
          <p className="mt-2 text-sm font-semibold text-accent">{analysis.buyer_segment_recommendation.typical_buyer_profile}</p>
          <ul className="mt-4 grid gap-2">
            {analysis.buyer_segment_recommendation.why_this_segment.map((item) => (
              <li key={item} className="rounded-md border border-border bg-[#f8faf7] px-3 py-2 text-sm leading-6 text-muted">
                {item}
              </li>
            ))}
          </ul>
        </SectionPanel>

        <SectionPanel title="Best Warehouse Process" eyebrow="Pilot use case" icon={MapPinned} className="lg:col-span-7">
          <h3 className="text-xl font-semibold text-foreground">{analysis.warehouse_process_recommendation.process_name}</h3>
          <p className="mt-3 text-sm leading-6 text-muted">{analysis.warehouse_process_recommendation.why_suitable.join(" ")}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {analysis.warehouse_process_recommendation.kpis.map((kpi) => (
              <Badge key={kpi.name} tone="blue">
                {kpi.name}
              </Badge>
            ))}
          </div>
        </SectionPanel>

        <SectionPanel title="Why Now" eyebrow="Timing signals" icon={Lightbulb} className="lg:col-span-5">
          <ul className="space-y-3">
            {analysis.why_now.map((signal) => (
              <li key={signal} className="text-sm leading-6 text-muted">
                {signal}
              </li>
            ))}
          </ul>
        </SectionPanel>

        <SectionPanel title="Trust Gap Analysis" eyebrow="Buyer risk" icon={ShieldAlert} className="lg:col-span-7">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="border-b border-border pb-3">Trust gap</th>
                  <th className="border-b border-border pb-3">Risk</th>
                  <th className="border-b border-border pb-3">Recommended fix</th>
                </tr>
              </thead>
              <tbody>
                {analysis.trust_gaps.map((gap) => (
                  <tr key={gap.gap_id}>
                    <td className="border-b border-border py-3 font-semibold text-foreground">{gap.title}</td>
                    <td className="border-b border-border py-3">
                      <RiskPill level={gap.risk_level} />
                    </td>
                    <td className="border-b border-border py-3 leading-6 text-muted">{gap.recommended_mitigation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionPanel>

        <SectionPanel title="Recommended Pilot Offer" eyebrow="Package" icon={PackageCheck} className="lg:col-span-5">
          <div className="grid gap-3 text-sm">
            <KeyValue label="Duration" value={`${analysis.pilot_offer.duration_days} days`} />
            <KeyValue label="Scope" value={analysis.pilot_offer.scope} />
            <KeyValue label="Setup" value={analysis.pilot_offer.required_setup.join(", ")} />
            <KeyValue label="Next step" value={analysis.pilot_offer.next_commercial_step} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {analysis.pilot_offer.buyer_risk_reducers.map((item) => (
              <Badge key={item} tone="green">
                {item}
              </Badge>
            ))}
          </div>
        </SectionPanel>

        <SectionPanel title="Target Account Shortlist" eyebrow="Account ranking" icon={Sparkles} className="lg:col-span-12">
          <div className="grid gap-3">
            {analysis.target_account_shortlist.map((account, index) => (
              <article key={account.company_name} className="rounded-md border border-border bg-[#f8faf7] p-4">
                <div className="grid gap-4 lg:grid-cols-[1fr_1.25fr]">
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <Badge tone="green">Rank {index + 1}</Badge>
                      <Badge tone="blue">{account.hq_region ?? "region not verified"}</Badge>
                      <Badge>{account.logistics_category}</Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{account.company_name}</h3>
                    <a
                      className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
                      href={account.website}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Official website
                      <ExternalLink size={14} aria-hidden="true" />
                    </a>
                    <p className="mt-3 text-sm leading-6 text-muted">{account.outreach_angle}</p>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <AccountList title="Signals" items={account.warehouse_signals.slice(0, 3)} />
                    <AccountList title="Process fit" items={account.likely_process_fit.slice(0, 4)} />
                    <AccountList title="Buyer roles" items={account.recommended_buyer_roles.slice(0, 4)} />
                  </div>
                </div>
                <p className="mt-3 border-t border-border pt-3 text-xs leading-5 text-muted">{account.source_note}</p>
              </article>
            ))}
          </div>
        </SectionPanel>

        <SectionPanel title="Buyer Objection Battlecard" eyebrow="Sales readiness" icon={MessageSquareWarning} className="lg:col-span-6">
          <div className="grid gap-3">
            {analysis.objection_battlecard.map((item) => (
              <div key={item.objection} className="rounded-md border border-border bg-[#f8faf7] p-3">
                <p className="font-semibold text-foreground">{item.objection}</p>
                <p className="mt-1 text-sm leading-6 text-muted">{item.response}</p>
              </div>
            ))}
          </div>
        </SectionPanel>

        <SectionPanel title="Documentation Checklist" eyebrow="Proof readiness" icon={ClipboardCheck} className="lg:col-span-6">
          <div className="grid gap-3">
            {analysis.proof_checklist.map((item) => (
              <div key={item.proof_id} className="grid gap-2 rounded-md border border-border bg-[#f8faf7] p-3 sm:grid-cols-[1fr_auto]">
                <div>
                  <p className="font-semibold text-foreground">{item.name}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{item.recommended_action}</p>
                </div>
                <ReadinessPill status={item.status} />
              </div>
            ))}
          </div>
        </SectionPanel>

        <SectionPanel title="Sales Pack" eyebrow="Ready-to-send assets" icon={FileStack} className="lg:col-span-6">
          <div className="grid gap-3">
            {[
              {
                asset: "First outreach email",
                purpose: analysis.sales_pack.outreach_email.subject,
                status: "draft-ready"
              },
              {
                asset: "One-page pilot proposal",
                purpose: analysis.sales_pack.one_page_pilot_proposal.headline,
                status: "draft-ready"
              },
              {
                asset: "Meeting pitch",
                purpose: analysis.sales_pack.meeting_pitch,
                status: "draft-ready"
              },
              {
                asset: "ROI argument",
                purpose: analysis.sales_pack.roi_argument,
                status: "needs-input"
              }
            ].map((asset) => (
              <div key={asset.asset} className="flex items-start justify-between gap-4 rounded-md border border-border bg-[#f8faf7] p-3">
                <div>
                  <p className="font-semibold text-foreground">{asset.asset}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{asset.purpose}</p>
                </div>
                <Badge tone={asset.status === "draft-ready" ? "green" : "amber"}>{asset.status}</Badge>
              </div>
            ))}
          </div>
        </SectionPanel>

        <SectionPanel title="Next 7 Days Action Plan" eyebrow="Execution" icon={CalendarDays} className="lg:col-span-6">
          <ol className="grid gap-3">
            {analysis.next_7_days_plan.map((item) => (
              <li key={item.day} className="grid gap-2 rounded-md border border-border bg-[#f8faf7] p-3 sm:grid-cols-[88px_1fr]">
                <span className="text-sm font-semibold text-accent">Day {item.day}</span>
                <span className="text-sm leading-6 text-muted">{item.action}</span>
              </li>
            ))}
          </ol>
        </SectionPanel>
      </div>
    </main>
  );
}

function AccountList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{title}</p>
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li key={item} className="rounded-md border border-border bg-panel px-3 py-2 text-sm leading-5 text-muted">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-[#f8faf7] p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 leading-6 text-foreground">{value}</p>
    </div>
  );
}
