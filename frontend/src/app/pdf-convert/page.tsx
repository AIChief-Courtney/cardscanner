import { PdfConverterPageShell, pdfConverterMetadata } from "@/components/user/pdf-converter-page-shell";

export const metadata = pdfConverterMetadata;
export const dynamic = "force-dynamic";

export default function PdfConvertPage() {
  return <PdfConverterPageShell route="pdf-convert" />;
}