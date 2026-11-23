import { Header } from "@/components/brand";
import { SiteFooter } from "@/components/site-footer";
import { PricingCheckout } from "@/components/user/pricing-checkout";
import { currentUser } from "@backend/lib/access";
import { isAdmin } from "@backend/lib/roles";

export const metadata = { title: "Pricing", description: "FileDock plans (demo checkout)." };

export default async function PricingPage() {
  const user = await currentUser();
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