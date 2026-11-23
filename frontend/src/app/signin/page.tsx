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
          <span className="eyebrow eyebrow--product">Card Scanner</span>
          <h2 id="signin-aside-title">Welcome back</h2>
          <p>
            Sign in to open your dashboard with uploads, balance, and the full Tools catalog in the header.
          </p>
          <ul className="help-list">
            <li>Use the Tools menu for converters and OCR before or after login.</li>
            <li>Passwords are at least 12 characters.</li>
            <li>Admins are routed to the admin console automatically.</li>
          </ul>
        </aside>
        <main id="main-content" className="auth-card">
          <span className="eyebrow eyebrow--product">Login</span>
          <h1>Sign in</h1>
          <p>Enter your email and password to continue to your workspace.</p>
          <AuthForm />
        </main>
      </div>
      <SiteFooter signedIn={false} />
    </div>
  );
}