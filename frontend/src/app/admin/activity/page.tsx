import { AdminActivity } from "@/components/admin/admin-activity";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin activity", robots: { index: false, follow: false } };

export default function AdminActivityPage() {
  return <AdminActivity />;
}