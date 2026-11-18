import { AdminOverview } from "@/components/admin/admin-overview";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin overview", robots: { index: false, follow: false } };

export default function AdminOverviewPage() {
  return <AdminOverview />;
}