import { AdminActivity } from "@/components/admin/admin-activity";
import { getAdminActivityData } from "@backend/lib/admin-activity-data";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin activity", robots: { index: false, follow: false } };

export const dynamic = "force-dynamic";

export default async function AdminActivityPage() {
  let initial: Awaited<ReturnType<typeof getAdminActivityData>> | null = null;
  let loadError: string | null = null;
  try {
    initial = await getAdminActivityData({ page: 1, pageSize: 20 });
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Could not load activity.";
  }

  return <AdminActivity initialData={initial} initialError={loadError} />;
}