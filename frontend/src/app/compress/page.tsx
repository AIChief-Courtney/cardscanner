import { Header } from "@/components/brand";
import { SiteFooter } from "@/components/site-footer";
import { ToolDirectory } from "@/components/user/tool-directory";
import { safeHeaderUser } from "@/lib/safe-session";
import { isAdmin } from "@backend/lib/roles";

export const metadata = { title: "Compress", description: "Video, audio, image, PDF, and GIF compressors." };

export default async function CompressDirectoryPage() {
  const user = await safeHeaderUser();
  return (
    <>
      <Header signedIn={!!user} admin={user ? isAdmin(user.role) : false} />
      <ToolDirectory title="Compress" description="Reduce file size while keeping acceptable quality." filter="compress" />
      <SiteFooter signedIn={!!user} admin={user ? isAdmin(user.role) : false} />
    </>
  );
}