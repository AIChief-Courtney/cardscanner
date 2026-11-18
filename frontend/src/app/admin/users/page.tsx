import { AdminUsers } from "@/components/admin/admin-users";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin users", robots: { index: false, follow: false } };

export default function AdminUsersPage() {
  return <AdminUsers />;
}