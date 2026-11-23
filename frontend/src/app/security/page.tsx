import { Header } from "@/components/brand";
import { SiteFooter } from "@/components/site-footer";

export const metadata = { title: "Security" };

export default function SecurityPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="workspace panel">
        <h1>Security</h1>
        <p>Demo mode avoids server uploads. Passwords for PDF unlock are not persisted. API keys are masked in the UI.</p>
      </main>
      <SiteFooter />
    </>
  );
}