import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { currentUser } from "@backend/lib/access";
import { isAdmin } from "@backend/lib/roles";
import { Header } from "@/components/brand";
import { SiteFooter } from "@/components/site-footer";
import { ToolConverterPage } from "@/components/user/tool-converter-page";
import { ApiToolPage } from "@/components/user/api-tool-page";
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

  return (
    <>
      <Header signedIn={signedIn} admin={admin} />
      {tool.kind === "api" ? <ApiToolPage meta={tool} /> : <ToolConverterPage meta={tool} />}
      <SiteFooter signedIn={signedIn} admin={admin} />
    </>
  );
}