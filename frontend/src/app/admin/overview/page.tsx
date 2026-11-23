import { AdminOverview } from "@/components/admin/admin-overview";
import { getAdminOverviewData } from "@backend/lib/admin-overview-data";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin overview", robots: { index: false, follow: false } };

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  let initial: Awaited<ReturnType<typeof getAdminOverviewData>> | null = null;
  let loadError: string | null = null;
  try {
    initial = await getAdminOverviewData("week");
  } catch (e) {
    loadError =
      e instanceof Error
        ? e.message
        : "Could not load overview. Check the database connection and run migrations.";
  }

  return <AdminOverview initialData={initial} initialError={loadError} />;
}