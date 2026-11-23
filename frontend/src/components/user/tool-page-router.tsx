import type { ToolPageMeta } from "@/lib/tool-registry";
import { ToolConverterPage } from "@/components/user/tool-converter-page";
import { ToolExternalPage } from "@/components/user/tool-external-page";
import { ToolApiPage } from "@/components/user/tool-api-page";
import { UnitCalculator } from "@/components/user/unit-calculator";
import { TimeCalculator } from "@/components/user/time-calculator";
import { VideoTrimWorkspace } from "@/components/user/video-trim-workspace";
import { PdfOrganizeWorkspace } from "@/components/user/pdf-organize-workspace";
import { PdfMergeWorkspace } from "@/components/user/pdf-merge-workspace";
import { PdfSplitWorkspace } from "@/components/user/pdf-split-workspace";
import { PdfProtectWorkspace } from "@/components/user/pdf-protect-workspace";

export function ToolPageRouter({ meta }: { meta: ToolPageMeta }) {
  if (meta.template === "external") return <ToolExternalPage meta={meta} />;
  if (meta.template === "api-landing") return <ToolApiPage meta={meta} />;
  if (meta.template === "calculator") {
    if (meta.slug.includes("time") || meta.slug === "pst-to-est" || meta.slug === "cst-to-est") {
      return <TimeCalculator meta={meta} />;
    }
    return <UnitCalculator meta={meta} />;
  }
  if (meta.slug === "trim-video") return <VideoTrimWorkspace meta={meta} />;
  if (meta.slug === "organize-pdf") return <PdfOrganizeWorkspace meta={meta} />;
  if (meta.slug === "merge-pdf") return <PdfMergeWorkspace meta={meta} />;
  if (meta.slug === "split-pdf") return <PdfSplitWorkspace meta={meta} />;
  if (meta.slug === "protect-pdf" || meta.slug === "unlock-pdf") return <PdfProtectWorkspace meta={meta} />;
  return <ToolConverterPage meta={meta} />;
}