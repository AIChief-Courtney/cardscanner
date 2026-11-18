import { redirect } from "next/navigation";
import { Header } from "@/components/brand";
import { AuthForm } from "@/components/auth-form";
import { SiteFooter } from "@/components/site-footer";
import { currentUser } from "@backend/lib/access";
import { accountHomePath } from "@backend/lib/roles";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default async function SignIn() {
  const user = await currentUser();
  if (user) redirect(accountHomePath(user.role));

  return (
    <div className="auth-page">
      <Header />
      <div className="auth-layout">
        <aside className="auth-aside" aria-labelledby="signin-aside-title">
          <span className="eyebrow">Welcome back</span>
          <h2 id="signin-aside-title">Sign in with confidence</h2>
          <p>
            Use the same email and password you chose at sign-up. We’ll send you to your dashboard as soon as
            everything checks out.
          </p>
          <ul className="help-list">
            <li>Passwords are at least 12 characters.</li>
            <li>Sign out anytime from the dashboard.</li>
            <li>Admins are taken to the admin panel after sign-in.</li>
          </ul>
        </aside>
        <main id="main-content" className="auth-card">
          <span className="eyebrow">Account</span>
          <h1>Sign in</h1>
          <p>Enter your details below to continue.</p>
          <AuthForm />
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}