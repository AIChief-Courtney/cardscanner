import { Header } from "@/components/brand";
import { SiteFooter } from "@/components/site-footer";
import { PricingCheckout } from "@/components/user/pricing-checkout";
import { safeHeaderUser } from "@/lib/safe-session";
import { isAdmin } from "@backend/lib/roles";

export const metadata = { title: "Pricing", description: "FileDock plans (demo checkout)." };
export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const user = await safeHeaderUser();
  return (
    <>
      <Header signedIn={!!user} admin={user ? isAdmin(user.role) : false} />
      <main id="main-content" className="workspace">
        <h1>Pricing</h1>
        <p className="tool-demo-banner">Checkout is demo-only — no payment details are collected.</p>
        <PricingCheckout />
      </main>
      <SiteFooter signedIn={!!user} admin={user ? isAdmin(user.role) : false} />
    </>
  );
}