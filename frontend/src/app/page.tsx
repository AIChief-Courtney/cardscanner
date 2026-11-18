import Link from "next/link";
import { Header } from "@/components/brand";
import { SiteFooter } from "@/components/site-footer";
import { currentUser } from "@backend/lib/access";
import { accountHomePath, isAdmin } from "@backend/lib/roles";
import { ArrowRight, LayoutDashboard, Shield, Sparkles, UserPlus, Zap } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await currentUser();
  const dashboardHref = user ? accountHomePath(user.role) : "/dashboard";

  return (
  <>
      <Header signedIn={!!user} admin={isAdmin(user?.role)} />
      <main id="main-content" className="page-main">
        <section className="hero hero-spotlight" aria-labelledby="home-title">
          <span className="eyebrow">Welcome</span>
          <h1 id="home-title">
            Everything you need in one <span className="text-gradient">calm workspace</span>.
          </h1>
          <p>
            Create a free account in under a minute, sign in from any device, and open your dashboard
            whenever you need it. Administrators get a simple overview of every user.
          </p>
          <div className="hero-badge-row" aria-label="Highlights">
            <span className="trust-pill">
              <Zap size={14} aria-hidden /> Fast sign-up
            </span>
            <span className="trust-pill">
              <Sparkles size={14} aria-hidden /> Polished dashboard
            </span>
            <span className="trust-pill">
              <Shield size={14} aria-hidden /> Admin controls
            </span>
          </div>
          <div className="hero-actions">
            {user ? (
              <Link className="button dark" href={dashboardHref}>
                Open your dashboard <ArrowRight size={17} aria-hidden />
              </Link>
            ) : (
              <>
                <Link className="button dark" href="/signup">
                  Create free account <ArrowRight size={17} aria-hidden />
                </Link>
                <Link className="button outline" href="/signin">
                  I already have an account
                </Link>
              </>
            )}
          </div>
        </section>

        <section className="section-block" aria-labelledby="how-it-works">
          <h2 id="how-it-works">How it works</h2>
          <p className="section-intro">Three short steps—no confusing setup.</p>
          <div className="steps">
            <article className="step-card">
              <div className="step-number" aria-hidden>
                1
              </div>
              <h3>Sign up with your email</h3>
              <p>Use a work or personal address. Passwords stay at least 12 characters for your security.</p>
            </article>
            <article className="step-card">
              <div className="step-number" aria-hidden>
                2
              </div>
              <h3>Sign in anytime</h3>
              <p>We keep you signed in on this browser until you choose to sign out from the dashboard.</p>
            </article>
            <article className="step-card">
              <div className="step-number" aria-hidden>
                3
              </div>
              <h3>Use your dashboard</h3>
              <p>See who you’re signed in as, jump back home, and (if you’re an admin) manage users in one place.</p>
            </article>
          </div>
        </section>

        <section className="section-block" aria-labelledby="explore">
          <h2 id="explore">What you can do</h2>
          <p className="section-intro">Pick the path that matches where you are today.</p>
          <div className="tool-grid">
            <article className="tool-card">
              <div className="tool-card-icon">
                <UserPlus size={22} aria-hidden />
              </div>
              <h3>New here?</h3>
              <p>Set up your account once. We’ll take you straight to your dashboard after sign-up.</p>
              <Link className="button outline small" href="/signup">
                Sign up free
              </Link>
            </article>
            <article className="tool-card">
              <div className="tool-card-icon">
                <LayoutDashboard size={22} aria-hidden />
              </div>
              <h3>Your dashboard</h3>
              <p>Check that you’re on the right account and get back to the home page in one click.</p>
              <Link
                className="button outline small"
                href={user ? accountHomePath(user.role) : "/signin"}
              >
                {user ? (isAdmin(user.role) ? "Go to admin" : "Go to dashboard") : "Sign in first"}
              </Link>
            </article>
            <article className="tool-card">
              <div className="tool-card-icon">
                <Shield size={22} aria-hidden />
              </div>
              <h3>Admin overview</h3>
              <p>See total users, roles, and when each account was created. Pagination keeps long lists readable.</p>
              <Link
                className="button outline small"
                href={user && isAdmin(user.role) ? "/admin/overview" : user ? "/dashboard" : "/signin"}
              >
                {user && isAdmin(user.role) ? "Open admin" : user ? "Admin only" : "Sign in"}
              </Link>
            </article>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}