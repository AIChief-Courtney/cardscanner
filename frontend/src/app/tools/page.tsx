import { Header } from "@/components/brand";
import { SiteFooter } from "@/components/site-footer";
import { ToolDirectory } from "@/components/user/tool-directory";
import { safeHeaderUser } from "@/lib/safe-session";
import { isAdmin } from "@backend/lib/roles";

export const metadata = { title: "Tools", description: "Media editors, PDF utilities, and partner links." };

export default async function ToolsDirectoryPage() {
  const user = await safeHeaderUser();
  return (
    <>
      <Header signedIn={!!user} admin={user ? isAdmin(user.role) : false} />
      <ToolDirectory title="Tools" description="Dedicated editors plus clearly labeled external destinations." filter="tools" />
      <SiteFooter signedIn={!!user} admin={user ? isAdmin(user.role) : false} />
    </>
  );
}