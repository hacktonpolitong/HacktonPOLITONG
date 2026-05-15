import { Badge } from "@/components/ui/badge";
import type { ReadinessStatus, RiskLevel } from "@/lib/pilot-analysis-types";

export function RiskPill({ level }: { level: RiskLevel }) {
  const tone = level === "high" ? "red" : level === "medium" ? "amber" : "green";
  return <Badge tone={tone}>{level}</Badge>;
}

export function ReadinessPill({ status }: { status: ReadinessStatus }) {
  const tone = status === "available" ? "green" : status === "partial" ? "amber" : status === "missing" ? "red" : "blue";
  return <Badge tone={tone}>{status}</Badge>;
}
