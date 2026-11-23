import { redirect } from "next/navigation";

/** Common typo / alias for pdf-converter. */
export default function PdfConvertAliasPage() {
  redirect("/pdf-converter");
}