import { Header } from "@/components/brand";
import { SiteFooter } from "@/components/site-footer";
import { ToolDirectory } from "@/components/user/tool-directory";
import { safeHeaderUser } from "@/lib/safe-session";
import { isAdmin } from "@backend/lib/roles";

export const metadata = { title: "Convert", description: "Browse file conversion tools on FileDock." };

export default async function ConvertDirectoryPage() {
  const user = await safeHeaderUser();
  return (
    <>
      <Header signedIn={!!user} admin={user ? isAdmin(user.role) : false} />
      <ToolDirectory title="Convert" description="Format converters, presets, and calculators." filter="convert" />
      <SiteFooter signedIn={!!user} admin={user ? isAdmin(user.role) : false} />
    </>
  );
}