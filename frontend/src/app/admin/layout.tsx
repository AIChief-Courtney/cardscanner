import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@backend/lib/access";
import { accountHomePath, isAdmin } from "@backend/lib/roles";
import { Header } from "@/components/brand";
import { AdminNav } from "@/components/admin/admin-nav";
import "./admin-theme.css";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) redirect("/signin");
  if (!isAdmin(user.role)) redirect("/dashboard?admin=0");

  return (
    <div className="admin-shell">
      <Header signedIn admin variant="admin" />
      <div className="admin-frame">
        <AdminNav />
        <div className="admin-frame-content">{children}</div>
      </div>
      <footer className="admin-footer">
        <span>Admin console · signed in as {user.email}</span>
        <nav aria-label="Admin footer">
          <Link href="/">Home</Link>
          <span aria-hidden> · </span>
          <Link href={accountHomePath(user.role)}>Overview</Link>
        </nav>
      </footer>
    </div>
  );
}