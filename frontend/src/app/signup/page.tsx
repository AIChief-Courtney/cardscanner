import { redirect } from "next/navigation";
import { Header } from "@/components/brand";
import { AuthForm } from "@/components/auth-form";
import { SiteFooter } from "@/components/site-footer";
import { accountHomePath } from "@backend/lib/roles";
import { safeHeaderUser } from "@/lib/safe-session";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign up", robots: { index: false, follow: false } };

export default async function SignUp() {
  const user = await safeHeaderUser();
  if (user) redirect(accountHomePath(user.role));
  return (
    <div className="auth-page">
      <Header />
      <div className="auth-layout">
        <aside className="auth-aside" aria-labelledby="signup-aside-title">
          <span className="eyebrow eyebrow--product">OnlineConvert</span>
          <h2 id="signup-aside-title">Create your free account</h2>
          <p>One quick form — we sign you in and send you straight to the dashboard.</p>
          <ul className="help-list">
            <li>Pick a strong password you’ll remember.</li>
            <li>Administrator roles are assigned separately.</li>
          </ul>
        </aside>
        <main id="main-content" className="auth-card">
          <span className="eyebrow eyebrow--product">Sign up</span>
          <h1>Create account</h1>
          <p>Free workspace · no credit card required.</p>
          <AuthForm signup />
        </main>
      </div>
      <SiteFooter signedIn={false} />
    </div>
  );
}