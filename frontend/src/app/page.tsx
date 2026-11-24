import Link from "next/link";
import { redirect } from "next/navigation";
import { accountHomePath } from "@backend/lib/roles";
import { safeHeaderUser } from "@/lib/safe-session";
import { Header } from "@/components/brand";
import { SiteFooter } from "@/components/site-footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Card Scanner",
  description: "Sign in to your dashboard or create an account.",
};

export default async function HomePage() {
  const user = await safeHeaderUser();
  if (user) redirect(accountHomePath(user.role));

  return (
    <>
      <Header />
      <main id="main-content" className="home-landing workspace">
        <div className="panel home-landing-card">
          <span className="eyebrow eyebrow--product">Card Scanner</span>
          <h1>Your files, one signed-in workspace</h1>
          <p>
            Create an account or sign in to open your dashboard. Administrators use the same login and are routed to
            the admin console.
          </p>
          <div className="empty-state-actions">
            <Link className="button dark" href="/signup">
              Sign up
            </Link>
            <Link className="button ghost" href="/signin">
              Sign in
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter signedIn={false} />
    </>
  );
}