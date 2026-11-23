import { Header } from "@/components/brand";
import { SiteFooter } from "@/components/site-footer";

export const metadata = { title: "Privacy (draft)" };

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="workspace panel">
        <h1>Privacy (draft)</h1>
        <p>
          Draft policy for FileDock. Demo mode stores jobs in browser localStorage only. Production deployments must link
          to a reviewed policy before collecting personal data.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}