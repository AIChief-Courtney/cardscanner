import { redirect } from "next/navigation";
import { currentUser } from "@backend/lib/access";
import { isAdmin } from "@backend/lib/roles";
import { Header } from "@/components/brand";
import { Admin } from "@/components/admin";
import type { Metadata } from "next";
import Link from "next/link";
import "./admin-theme.css";

export const metadata: Metadata = { title: "Admin dashboard", robots: { index: false, follow: false } };

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await currentUser();
  if (!user) redirect("/signin");
  if (!isAdmin(user.role)) redirect("/dashboard?admin=0");
  return (
    <div className="admin-shell">
      <Header signedIn admin variant="admin" />
      <Admin />
      <footer className="admin-footer">
        <span>Admin console · authorized personnel only</span>
        <nav aria-label="Admin footer">
          <Link href="/">Home</Link>
          <span aria-hidden> · </span>
          <Link href="/dashboard">User dashboard</Link>
        </nav>
      </footer>
    </div>
  );
}