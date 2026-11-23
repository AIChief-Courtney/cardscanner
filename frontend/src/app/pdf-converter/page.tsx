import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolFreeConvertPage } from "@/components/user/tool-freeconvert-page";
import { getToolByRoute } from "@/lib/tool-registry";

/** Matches freeconvert.com/pdf-converter title for parity. */
export const metadata: Metadata = {
  title: { absolute: "PDF Converter - Convert PDF Files Online for Free" },
  description: "Convert to PDF format online, for free.",
};

export default function PdfConverterPage() {
  const meta = getToolByRoute("pdf-converter");
  if (!meta) notFound();
  return <ToolFreeConvertPage meta={meta} />;
}