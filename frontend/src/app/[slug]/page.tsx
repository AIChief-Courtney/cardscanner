import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { safeHeaderUser } from "@/lib/safe-session";
import { isAdmin } from "@backend/lib/roles";
import { Header } from "@/components/brand";
import { SiteFooter } from "@/components/site-footer";
import { ToolPageRouter } from "@/components/user/tool-page-router";
import { allToolRoutes, getToolByRoute } from "@/lib/tool-registry";
import { FC_PROXY_TOOL_PATHS } from "@/lib/fc-local-routes";

export const dynamic = "force-dynamic";

const FC_PROXY_SLUGS = new Set(
  [...FC_PROXY_TOOL_PATHS].map((p) => p.replace(/^\//, "")),
);

export function generateStaticParams() {
  return allToolRoutes()
    .filter((slug) => !FC_PROXY_SLUGS.has(slug))
    .map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolByRoute(slug);
  if (!tool) return { title: "Tool not found" };
  return {
    title: tool.h1,
    description: tool.tagline,
    openGraph: { title: `${tool.h1} | FileDock`, description: tool.tagline },
  };
}

export default async function ToolRoutePage({ params }: Props) {
  const { slug } = await params;
  if (FC_PROXY_SLUGS.has(slug)) notFound();
  const tool = getToolByRoute(slug);
  if (!tool) notFound();

  const user = await safeHeaderUser();
  const signedIn = !!user;
  const admin = user ? isAdmin(user.role) : false;

  return (
    <>
      <Header signedIn={signedIn} admin={admin} />
      <ToolPageRouter meta={tool} />
      <SiteFooter signedIn={signedIn} admin={admin} />
    </>
  );
}