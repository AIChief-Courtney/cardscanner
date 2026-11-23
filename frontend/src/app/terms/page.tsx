import { Header } from "@/components/brand";
import { SiteFooter } from "@/components/site-footer";

export const metadata = { title: "Terms (draft)" };

export default function TermsPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="workspace panel">
        <h1>Terms of service (draft)</h1>
        <p>Placeholder terms — review with counsel before launch.</p>
      </main>
      <SiteFooter />
    </>
  );
}