import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { currentUser } from "@backend/lib/access";
import { isAdmin } from "@backend/lib/roles";
import { Header } from "@/components/brand";
import { SiteFooter } from "@/components/site-footer";
import { ToolConverterPage } from "@/components/user/tool-converter-page";
import { ToolFreeConvertPage } from "@/components/user/tool-freeconvert-page";
import { freeConvertPath } from "@/lib/freeconvert-url";
import { allToolRoutes, getToolByRoute } from "@/lib/tool-registry";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return allToolRoutes().map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolByRoute(slug);
  if (!tool) return { title: "Tool not found" };
  return {
    title: tool.h1,
    description: tool.tagline,
    openGraph: { title: `${tool.h1} | Card Scanner`, description: tool.tagline },
  };
}

export default async function ToolRoutePage({ params }: Props) {
  const { slug } = await params;
  const tool = getToolByRoute(slug);
  if (!tool) notFound();

  const user = await currentUser();
  const signedIn = !!user;
  const admin = user ? isAdmin(user.role) : false;
  const fcEmbed = !!freeConvertPath(tool.slug, tool.kind);

  return (
    <>
      <Header signedIn={signedIn} admin={admin} />
      {fcEmbed ? <ToolFreeConvertPage meta={tool} /> : <ToolConverterPage meta={tool} />}
      {!fcEmbed && <SiteFooter signedIn={signedIn} admin={admin} />}
    </>
  );
}