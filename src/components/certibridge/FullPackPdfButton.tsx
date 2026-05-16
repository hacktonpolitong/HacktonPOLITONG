"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { electricButtonClasses } from "@/components/certibridge/ElectricButton";
import { CertiBridgeFullPackPdf } from "@/lib/certibridge/pdf-report";
import { buildFullPackFilename } from "@/lib/certibridge/report-format";
import type { PilotAnalysis, ProductProfile } from "@/lib/pilot-analysis-types";

type FullPackPdfButtonProps = {
  profile: ProductProfile;
  analysis: PilotAnalysis;
};

export function FullPackPdfButton({ profile, analysis }: FullPackPdfButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const productName = analysis.product_summary.product_name || profile.productName;

  async function handleExport() {
    setIsExporting(true);
    setError(null);

    try {
      const generatedAt = new Date();
      const blob = await pdf(<CertiBridgeFullPackPdf profile={profile} analysis={analysis} generatedAt={generatedAt} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = buildFullPackFilename(productName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch (downloadError) {
      console.error(downloadError);
      setError("PDF export failed. Try again after the report finishes loading.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="grid justify-items-stretch gap-1">
      <button
        type="button"
        className={electricButtonClasses({ size: "large" })}
        disabled={isExporting}
        onClick={() => void handleExport()}
      >
        {isExporting ? <Loader2 className="animate-spin" size={18} aria-hidden="true" /> : <Download size={18} aria-hidden="true" />}
        Export full pack
      </button>
      {error ? <span className="text-xs text-red-200">{error}</span> : null}
    </div>
  );
}
