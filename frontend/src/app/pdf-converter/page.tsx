import { redirect } from "next/navigation";

/** Canonical FC-style workspace lives at /pdf-convert (Ebook / Image / Document output picker). */
export default function PdfConverterRedirectPage() {
  redirect("/pdf-convert");
}