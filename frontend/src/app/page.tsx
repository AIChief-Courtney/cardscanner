import Link from "next/link";
import { Header } from "@/components/brand";
import { SiteFooter } from "@/components/site-footer";
import { ToolsCatalog } from "@/components/user/tools-catalog";
import { safeHeaderUser } from "@/lib/safe-session";
import { isAdmin } from "@backend/lib/roles";
import { ArrowRight, FileStack, Sparkles, Zap } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await safeHeaderUser();
  const signedIn = !!user;
  const admin = user ? isAdmin(user.role) : false;

  return (
    <>
      <Header signedIn={signedIn} admin={admin} />
      <main id="main-content" className="page-main user-landing">
        <section className="hero hero-product" aria-labelledby="home-title">
          <span className="eyebrow eyebrow--product">FileDock</span>
          <h1 id="home-title">
            Convert and compress in one <span className="text-gradient text-gradient--blue">honest workspace</span>.
          </h1>
          <p>
            Pick a tool from Convert, Compress, or Tools — run labeled demos in the browser, then sign in to see tasks and
            jobs in your account.
          </p>
          <div className="hero-badge-row" aria-label="Highlights">
            <span className="trust-pill trust-pill--product">
              <Zap size={14} aria-hidden /> Typed registry
            </span>
            <span className="trust-pill trust-pill--product">
              <FileStack size={14} aria-hidden /> Batch queue
            </span>
            <span className="trust-pill trust-pill--product">
              <Sparkles size={14} aria-hidden /> Sample outputs labeled
            </span>
          </div>
          <HeroActions signedIn={signedIn} />
        </section>

        <section className="landing-upload-preview panel" aria-labelledby="popular-title">
          <h2 id="popular-title">Popular tools</h2>
          <ul className="home-popular-links">
            <li>
              <Link href="/pdf-to-word">PDF to Word</Link>
            </li>
            <li>
              <Link href="/video-converter">Video Converter</Link>
            </li>
            <li>
              <Link href="/compress-pdf">PDF Compressor</Link>
            </li>
            <li>
              <Link href="/convert">Browse all converters</Link>
            </li>
          </ul>
        </section>

        <ToolsCatalog signedIn={signedIn} />
      </main>
      <SiteFooter signedIn={signedIn} admin={admin} />
    </>
  );
}

function HeroActions({ signedIn }: { signedIn: boolean }) {
  return (
    <div className="hero-actions">
      <Link className="button dark button--filedock" href="/pdf-to-word">
        Try PDF to Word <ArrowRight size={17} aria-hidden />
      </Link>
      {signedIn ? (
        <Link className="button outline" href="/account/tasks">
          View tasks
        </Link>
      ) : (
        <Link className="button outline" href="/signin?callbackUrl=/pdf-to-word">
          Sign in
        </Link>
      )}
    </div>
  );
}