import { Header } from "@/components/brand";
import { SiteFooter } from "@/components/site-footer";
import { currentUser } from "@backend/lib/access";
import { isAdmin } from "@backend/lib/roles";

export const metadata = { title: "FAQ" };

export default async function FaqPage() {
  const user = await currentUser();
  return (
    <>
      <Header signedIn={!!user} admin={user ? isAdmin(user.role) : false} />
      <main id="main-content" className="workspace panel">
        <h1>FAQ</h1>
        <details>
          <summary>Are conversions real?</summary>
          <p>Most tools use a labeled demo adapter. Calculators run locally in the browser.</p>
        </details>
        <details>
          <summary>Do files leave my device?</summary>
          <p>Not in demo mode. Integrations will state when uploads occur.</p>
        </details>
      </main>
      <SiteFooter signedIn={!!user} admin={user ? isAdmin(user.role) : false} />
    </>
  );
}