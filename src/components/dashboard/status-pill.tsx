import { Badge } from "@/components/ui/badge";
import type { ReadinessStatus, RiskLevel } from "@/lib/pilot-analysis-types";

const riskToneByLevel = {
  critical: "red",
  high: "red",
  medium: "amber",
  low: "green"
} satisfies Record<RiskLevel, "red" | "amber" | "green">;

export function RiskPill({ level }: { level: RiskLevel }) {
  const tone = riskToneByLevel[level];
  return <Badge tone={tone}>{level}</Badge>;
}

export function ReadinessPill({ status }: { status: ReadinessStatus }) {
  const tone = status === "available" ? "green" : status === "partial" ? "amber" : status === "missing" ? "red" : "blue";
  return <Badge tone={tone}>{status}</Badge>;
}
