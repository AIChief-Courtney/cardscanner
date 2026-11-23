import { Header } from "@/components/brand";
import { SiteFooter } from "@/components/site-footer";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="workspace panel">
        <h1>Contact</h1>
        <p>support@filedock.demo (not live)</p>
      </main>
      <SiteFooter />
    </>
  );
}