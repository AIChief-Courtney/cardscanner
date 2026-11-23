import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/brand";
import { currentUser } from "@backend/lib/access";

const LINKS = [
  { href: "/account/profile", label: "Profile" },
  { href: "/account/billing-plan", label: "Billing plan" },
  { href: "/account/payment-method", label: "Payment method" },
  { href: "/account/invoices", label: "Invoices" },
  { href: "/account/tasks", label: "Tasks" },
  { href: "/account/jobs", label: "Jobs" },
  { href: "/account/api-keys", label: "API keys" },
  { href: "/account/webhooks", label: "Webhooks" },
  { href: "/account/notifications", label: "Notifications" },
  { href: "/account/activity", label: "Activity" },
  { href: "/account/faq", label: "FAQ" },
];

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) redirect("/signin?callbackUrl=/account/profile");

  return (
    <>
      <Header signedIn admin={false} />
      <div className="account-shell">
        <nav className="account-nav panel" aria-label="Account">
          <ul>
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <main className="account-main">{children}</main>
      </div>
    </>
  );
}