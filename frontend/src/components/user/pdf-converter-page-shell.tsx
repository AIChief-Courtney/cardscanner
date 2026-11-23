import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/brand";
import { SiteFooter } from "@/components/site-footer";
import { ToolConverterPage } from "@/components/user/tool-converter-page";
import { recordToPageMeta } from "@/lib/tool-registry";
import { safeHeaderUser } from "@/lib/safe-session";
import { isAdmin } from "@backend/lib/roles";
import type { ToolPageMeta } from "@/lib/tool-registry";

export const pdfConverterMetadata: Metadata = {
  title: { absolute: "PDF Converter - Convert PDF Files Online for Free" },
  description: "Convert to PDF format online, for free.",
};

export async function PdfConverterPageShell({ route }: { route: "pdf-convert" | "pdf-converter" }) {
  const base = recordToPageMeta("pdf-converter");
  if (!base) notFound();

  const meta: ToolPageMeta = { ...base, route };

  const user = await safeHeaderUser();
  const signedIn = !!user;
  const admin = user ? isAdmin(user.role) : false;

  return (
    <>
      <Header signedIn={signedIn} admin={admin} />
      <ToolConverterPage meta={meta} />
      <SiteFooter signedIn={signedIn} admin={admin} />
    </>
  );
}