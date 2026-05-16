import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { buildFullPackReportModel, normalizeRiskLabel } from "@/lib/certibridge/report-format";
import type { DashboardRisk } from "@/lib/certibridge/dashboard-mappers";
import type { PilotAnalysis, ProductProfile } from "@/lib/pilot-analysis-types";

type CertiBridgeFullPackPdfProps = {
  profile: ProductProfile;
  analysis: PilotAnalysis;
  generatedAt?: Date;
};

const colors = {
  navy: "#07111f",
  ink: "#172033",
  muted: "#64748b",
  line: "#dbeafe",
  blue: "#2563eb",
  cyan: "#0891b2",
  pale: "#eff6ff",
  soft: "#f8fafc",
  red: "#b91c1c",
  orange: "#c2410c",
  amber: "#b45309",
  green: "#047857"
};

const styles = StyleSheet.create({
  page: {
    padding: 34,
    fontSize: 9.5,
    color: colors.ink,
    fontFamily: "Helvetica",
    lineHeight: 1.45
  },
  coverPage: {
    padding: 38,
    color: "#ffffff",
    backgroundColor: colors.navy,
    fontFamily: "Helvetica"
  },
  coverKicker: {
    color: "#67e8f9",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1.8,
    textTransform: "uppercase"
  },
  coverTitle: {
    marginTop: 22,
    fontSize: 34,
    fontWeight: 700,
    lineHeight: 1.08
  },
  coverSubtitle: {
    marginTop: 12,
    color: "#bfdbfe",
    fontSize: 13,
    lineHeight: 1.45
  },
  coverMeta: {
    marginTop: 34,
    borderTopWidth: 1,
    borderTopColor: "#1d4ed8",
    paddingTop: 16
  },
  coverMetaText: {
    marginBottom: 7,
    color: "#e0f2fe",
    fontSize: 11
  },
  disclaimer: {
    marginTop: "auto",
    color: "#bfdbfe",
    fontSize: 8,
    lineHeight: 1.5
  },
  header: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    paddingBottom: 9
  },
  headerKicker: {
    color: colors.blue,
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: 1.2,
    textTransform: "uppercase"
  },
  pageTitle: {
    marginTop: 3,
    color: colors.navy,
    fontSize: 18,
    fontWeight: 700
  },
  section: {
    marginBottom: 14
  },
  sectionTitle: {
    marginBottom: 7,
    color: colors.navy,
    fontSize: 12,
    fontWeight: 700
  },
  card: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    backgroundColor: colors.soft,
    padding: 10,
    marginBottom: 8
  },
  scoreCard: {
    borderWidth: 1,
    borderColor: "#bfdbfe",
    borderRadius: 10,
    backgroundColor: colors.pale,
    padding: 12,
    marginBottom: 10
  },
  scoreText: {
    color: colors.blue,
    fontSize: 30,
    fontWeight: 700
  },
  row: {
    flexDirection: "row",
    gap: 8
  },
  half: {
    flexGrow: 1,
    flexBasis: 0
  },
  keyValueRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingVertical: 4
  },
  key: {
    width: "32%",
    color: colors.muted,
    fontWeight: 700
  },
  value: {
    width: "68%"
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 4
  },
  bulletDot: {
    width: 10,
    color: colors.blue,
    fontWeight: 700
  },
  bulletText: {
    flex: 1
  },
  table: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 8
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.pale,
    borderBottomWidth: 1,
    borderBottomColor: colors.line
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0"
  },
  tableHeaderCell: {
    padding: 6,
    color: colors.navy,
    fontSize: 8,
    fontWeight: 700,
    textTransform: "uppercase"
  },
  tableCell: {
    padding: 6,
    fontSize: 8.5
  },
  smallCaps: {
    color: colors.muted,
    fontSize: 7.5,
    fontWeight: 700,
    letterSpacing: 0.8,
    textTransform: "uppercase"
  },
  risk: {
    fontSize: 8,
    fontWeight: 700,
    textTransform: "uppercase"
  },
  footer: {
    position: "absolute",
    bottom: 16,
    left: 34,
    right: 34,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 7,
    color: colors.muted,
    fontSize: 8
  }
});

export function CertiBridgeFullPackPdf({ profile, analysis, generatedAt = new Date() }: CertiBridgeFullPackPdfProps) {
  const report = buildFullPackReportModel(profile, analysis, generatedAt);
  const dashboard = report.dashboard;
  const selectedBuyer = dashboard.buyers[0];

  return (
    <Document
      title={`CertiBridge Full Pack - ${dashboard.productSummary.name}`}
      author="CertiBridge AI"
      subject="EU market-entry preparation pack"
    >
      <Page size="A4" style={styles.coverPage}>
        <Text style={styles.coverKicker}>CertiBridge AI</Text>
        <Text style={styles.coverTitle}>Full EU Market-Entry Preparation Pack</Text>
        <Text style={styles.coverSubtitle}>
          Structured first-pilot preparation for a Chinese warehouse automation vendor entering the Italian market.
        </Text>
        <View style={styles.coverMeta}>
          <Text style={styles.coverMetaText}>Product: {dashboard.productSummary.name}</Text>
          <Text style={styles.coverMetaText}>Company: {dashboard.productSummary.company}</Text>
          <Text style={styles.coverMetaText}>Target market: {dashboard.productSummary.targetMarket}</Text>
          <Text style={styles.coverMetaText}>Generated: {report.generatedDate}</Text>
        </View>
        <Text style={styles.disclaimer}>
          Disclaimer: this pack is AI-assisted business preparation, not legal certification, CE approval, or a guarantee that a pilot will be sold.
          Use it to organize buyer conversations and decide which evidence should be reviewed by qualified experts.
        </Text>
      </Page>

      <PdfPage title="Executive Summary">
        <View style={styles.scoreCard}>
          <Text style={styles.smallCaps}>Readiness and pilot fit</Text>
          <Text style={styles.scoreText}>{dashboard.score.value}/100</Text>
          <Text>Confidence: {report.confidence}</Text>
        </View>
        <Section title="Top Risks">
          <BulletList items={report.topRisks.map((risk) => `${risk.name}: ${risk.fix}`)} />
        </Section>
        <Section title="Fastest Next Actions">
          <BulletList items={report.fastestNextActions.map((item) => `Day ${item.day}: ${item.action} (${item.owner})`)} />
        </Section>
        <Section title="Decision Signal">
          <BulletList items={dashboard.score.bullets} />
        </Section>
      </PdfPage>

      <PdfPage title="Product Evidence Profile">
        <KeyValueTable
          rows={[
            ["Company", dashboard.productSummary.company],
            ["Product", dashboard.productSummary.name],
            ["Category", dashboard.productSummary.category],
            ["Intended use", analysis.product_summary.primary_use_case],
            ["Target market", dashboard.productSummary.targetMarket],
            ["Evidence summary", analysis.product_evidence_profile.evidence_summary],
            ["Support model", analysis.product_evidence_profile.support_model],
            ["Extracted facts", dashboard.productSummary.chips.join(", ")]
          ]}
        />
        <View style={styles.row}>
          <View style={styles.half}>
            <Section title="Available Evidence">
              <BulletList items={report.availableEvidence.length > 0 ? report.availableEvidence : analysis.product_summary.available_proof} />
            </Section>
          </View>
          <View style={styles.half}>
            <Section title="Missing Evidence">
              <BulletList items={report.missingEvidence.length > 0 ? report.missingEvidence : analysis.product_summary.missing_proof} />
            </Section>
          </View>
        </View>
      </PdfPage>

      <PdfPage title="Regulatory Route and Evidence Plan">
        <Section title="Regulatory / Compliance Route Mapping">
          <SimpleTable
            columns={[
              { title: "Route", width: "24%" },
              { title: "Why triggered", width: "38%" },
              { title: "Confidence", width: "14%" },
              { title: "Next action", width: "24%" }
            ]}
            rows={report.routeMapping.map((route) => [route.name, route.whyTriggered, route.confidence, route.nextAction])}
          />
        </Section>
        <Section title="Required Tests and Evidence Plan">
          <SimpleTable
            columns={[
              { title: "Test / evidence", width: "22%" },
              { title: "Priority", width: "12%" },
              { title: "Why needed", width: "28%" },
              { title: "Cost", width: "16%" },
              { title: "Duration", width: "12%" },
              { title: "Evidence", width: "10%" }
            ]}
            rows={report.evidencePlan.map((item) => [
              item.testName,
              normalizeRiskLabel(item.priority),
              item.whyNeeded,
              item.estimatedCost,
              item.estimatedDuration,
              item.evidenceNeeded
            ])}
          />
        </Section>
      </PdfPage>

      <PdfPage title="Documentation Gap Analysis">
        <SimpleTable
          columns={[
            { title: "Gap", width: "22%" },
            { title: "Severity", width: "12%" },
            { title: "Required state", width: "28%" },
            { title: "Recommended fix", width: "38%" }
          ]}
          rows={analysis.trust_gaps.map((gap) => [
            gap.title,
            normalizeRiskLabel(gap.risk_level),
            gap.required_proof.join(", "),
            gap.recommended_mitigation
          ])}
        />
      </PdfPage>

      <PdfPage title="Target Best Buyer Segment">
        <Section title="Best First Segment">
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>{selectedBuyer?.name ?? analysis.buyer_segment_recommendation.segment_name}</Text>
            <Text>{selectedBuyer?.reason ?? analysis.buyer_segment_recommendation.typical_buyer_profile}</Text>
            <Text style={{ marginTop: 6 }}>Recommended first pitch: {selectedBuyer?.pitchAngle ?? analysis.sales_pack.meeting_pitch}</Text>
          </View>
        </Section>
        <View style={styles.row}>
          <View style={styles.half}>
            <Section title="Pros">
              <BulletList items={selectedBuyer?.pros ?? analysis.buyer_segment_recommendation.why_this_segment.slice(0, 3)} />
            </Section>
          </View>
          <View style={styles.half}>
            <Section title="Cons">
              <BulletList items={selectedBuyer?.cons ?? analysis.buyer_segment_recommendation.key_objections.slice(0, 3)} />
            </Section>
          </View>
        </View>
        <Section title="Buyer Shortlist">
          <SimpleTable
            columns={[
              { title: "Company", width: "24%" },
              { title: "Region", width: "14%" },
              { title: "Category", width: "18%" },
              { title: "Fit signal", width: "24%" },
              { title: "Outreach angle", width: "20%" }
            ]}
            rows={analysis.target_account_shortlist.slice(0, 8).map((account) => [
              account.company_name,
              account.hq_region ?? "To verify",
              account.logistics_category,
              account.likely_process_fit.slice(0, 2).join(", "),
              account.outreach_angle
            ])}
          />
        </Section>
      </PdfPage>

      <PdfPage title="Objection Battlecards">
        {dashboard.battlecards.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.smallCaps}>Risk: {normalizeRiskLabel(item.risk)}</Text>
            <Text style={styles.sectionTitle}>{item.objection}</Text>
            <Text>{item.answer}</Text>
            <Text style={{ marginTop: 5, color: colors.muted }}>Evidence: {item.evidenceToAttach.join(", ") || "Pilot proof checklist"}</Text>
          </View>
        ))}
      </PdfPage>

      <PdfPage title="Roadmap and Sales Pack">
        <Section title="Roadmap">
          <SimpleTable
            columns={[
              { title: "Phase", width: "12%" },
              { title: "Timeframe", width: "16%" },
              { title: "Tasks", width: "34%" },
              { title: "Owner", width: "16%" },
              { title: "Exit criteria", width: "22%" }
            ]}
            rows={analysis.next_7_days_plan.map((item) => [
              `Day ${item.day}`,
              "Next 7 days",
              item.action,
              item.owner,
              item.output
            ])}
          />
        </Section>
        <Section title="Sales Pack">
          <KeyValueTable
            rows={[
              ["Outreach subject", analysis.sales_pack.outreach_email.subject],
              ["Meeting pitch", analysis.sales_pack.meeting_pitch],
              ["Proposal headline", analysis.sales_pack.one_page_pilot_proposal.headline],
              ["ROI argument", analysis.sales_pack.roi_argument],
              ["Decision request", analysis.sales_pack.one_page_pilot_proposal.decision_request]
            ]}
          />
        </Section>
      </PdfPage>

      <PdfPage title="Normalized EU-Style Dossier">
        <KeyValueTable rows={report.normalizedDossier} />
      </PdfPage>

      <PdfPage title="Appendix">
        <Section title="Warnings and Limitations">
          <BulletList
            items={[
              "This pack organizes market-entry and pilot-readiness work; it does not certify legal or product compliance.",
              "Target accounts are a curated company-level shortlist, not private personal lead data.",
              "Estimated testing actions are planning assumptions and must be confirmed by qualified labs or advisors.",
              ...analysis.metadata.assumptions
            ]}
          />
        </Section>
        <Section title="AI / Legal Disclaimer">
          <Text>
            CertiBridge AI outputs should be reviewed by commercial, technical, safety, and legal specialists before buyer submission.
            The system should not be represented as a compliance certification tool or autonomous outreach engine.
          </Text>
        </Section>
      </PdfPage>
    </Document>
  );
}

function PdfPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerKicker}>CertiBridge AI Full Pack</Text>
        <Text style={styles.pageTitle}>{title}</Text>
      </View>
      {children}
      <View style={styles.footer} fixed>
        <Text>CertiBridge AI</Text>
        <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`} />
      </View>
    </Page>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function BulletList({ items }: { items: string[] }) {
  const list = items.length > 0 ? items : ["To be defined."];

  return (
    <View>
      {list.map((item) => (
        <View key={item} style={styles.bullet}>
          <Text style={styles.bulletDot}>-</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function KeyValueTable({ rows }: { rows: string[][] }) {
  return (
    <View style={styles.card}>
      {rows.map(([key, value]) => (
        <View key={key} style={styles.keyValueRow}>
          <Text style={styles.key}>{key}</Text>
          <Text style={styles.value}>{value || "To be defined"}</Text>
        </View>
      ))}
    </View>
  );
}

function SimpleTable({
  columns,
  rows
}: {
  columns: Array<{ title: string; width: string }>;
  rows: string[][];
}) {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        {columns.map((column) => (
          <Text key={column.title} style={[styles.tableHeaderCell, { width: column.width }]}>
            {column.title}
          </Text>
        ))}
      </View>
      {(rows.length > 0 ? rows : [["To be defined"]]).map((row, rowIndex) => (
        <View key={`${rowIndex}-${row.join("-")}`} style={styles.tableRow}>
          {columns.map((column, columnIndex) => (
            <Text
              key={`${column.title}-${columnIndex}`}
              style={[
                styles.tableCell,
                { width: column.width },
                column.title.toLowerCase().includes("severity") || column.title.toLowerCase().includes("priority")
                  ? riskTextStyle(row[columnIndex] as DashboardRisk)
                  : {}
              ]}
            >
              {row[columnIndex] || ""}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

function riskTextStyle(value: DashboardRisk | string) {
  const risk = String(value).toLowerCase();

  if (risk.includes("critical")) {
    return { color: colors.red, fontWeight: 700 };
  }

  if (risk.includes("high")) {
    return { color: colors.orange, fontWeight: 700 };
  }

  if (risk.includes("medium")) {
    return { color: colors.amber, fontWeight: 700 };
  }

  if (risk.includes("low")) {
    return { color: colors.green, fontWeight: 700 };
  }

  return {};
}
