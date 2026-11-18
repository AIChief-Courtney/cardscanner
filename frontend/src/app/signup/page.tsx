import { redirect } from "next/navigation";
import { Header } from "@/components/brand";
import { AuthForm } from "@/components/auth-form";
import { SiteFooter } from "@/components/site-footer";
import { currentUser } from "@backend/lib/access";
import { accountHomePath } from "@backend/lib/roles";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign up", robots: { index: false, follow: false } };

export default async function SignUp() {
  const user = await currentUser();
  if (user) redirect(accountHomePath(user.role));
  return (
    <div className="auth-page">
      <Header />
      <div className="auth-layout">
        <aside className="auth-aside" aria-labelledby="signup-aside-title">
          <span className="eyebrow">Get started</span>
          <h2 id="signup-aside-title">Create your free account</h2>
          <p>
            One form, no credit card. After you sign up we sign you in automatically and open your personal
            dashboard.
          </p>
          <ul className="help-list">
            <li>Pick a strong password you’ll remember.</li>
            <li>Use a real email—you’ll need it to sign in later.</li>
            <li>Administrator access is granted separately by your team.</li>
          </ul>
        </aside>
        <main id="main-content" className="auth-card">
          <span className="eyebrow">New account</span>
          <h1>Create account</h1>
          <p>Takes about a minute. Fields marked required must be filled in.</p>
          <AuthForm signup />
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}