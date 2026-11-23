import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/brand";
import { SiteFooter } from "@/components/site-footer";
import { ToolsCatalog } from "@/components/user/tools-catalog";
import { currentUser } from "@backend/lib/access";
import { accountHomePath } from "@backend/lib/roles";
import { ArrowRight, ScanLine, Sparkles, Zap } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await currentUser();
  if (user) redirect(accountHomePath(user.role));

  return (
    <>
      <Header signedIn={false} admin={false} />
      <main id="main-content" className="page-main user-landing">
        <section className="hero hero-product" aria-labelledby="home-title">
          <span className="eyebrow eyebrow--product">Card Scanner</span>
          <h1 id="home-title">
            Convert cards, images, and PDFs in a <span className="text-gradient text-gradient--blue">single workspace</span>.
          </h1>
          <p>
            Use Convert, Compress, and Tools in the header — like FreeConvert — then sign in for your dashboard,
            uploads, and account.
          </p>
          <div className="hero-badge-row" aria-label="Highlights">
            <span className="trust-pill trust-pill--product">
              <Zap size={14} aria-hidden /> Fast converters
            </span>
            <span className="trust-pill trust-pill--product">
              <ScanLine size={14} aria-hidden /> ID &amp; invoice OCR
            </span>
            <span className="trust-pill trust-pill--product">
              <Sparkles size={14} aria-hidden /> Clean dashboard
            </span>
          </div>
          <div className="hero-actions">
            <Link className="button dark button--blue" href="/signup">
              Create free account <ArrowRight size={17} aria-hidden />
            </Link>
            <Link className="button outline" href="/signin">
              Login
            </Link>
          </div>
        </section>

        <section className="landing-upload-preview panel" aria-labelledby="preview-title">
          <h2 id="preview-title" className="sr-only">
            Upload preview
          </h2>
          <span className="landing-upload-frame" aria-hidden />
          <p className="landing-upload-caption">
            Sign in to upload files on your dashboard — guests can browse tools from the header menu.
          </p>
        </section>

        <ToolsCatalog signedIn={false} />

        <section className="plans-strip panel landing-plans" id="plans" aria-labelledby="landing-plans-title">
          <div className="plans-strip-head">
            <span className="eyebrow eyebrow--product">Plans</span>
            <h2 id="landing-plans-title">Grow from free to Pro</h2>
            <p>Every account includes the full Tools catalog. Dashboard access starts after you sign in.</p>
          </div>
          <div className="plans-strip-cta">
            <Link className="button dark button--blue" href="/signup">
              Get started free
            </Link>
            <Link className="button outline" href="/signin">
              Sign in
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter signedIn={false} />
    </>
  );
}