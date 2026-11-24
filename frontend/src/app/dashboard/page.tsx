import { redirect } from "next/navigation";
import { currentUser } from "@backend/lib/access";
import { accountHomePath, isAdmin } from "@backend/lib/roles";
import { Dashboard } from "@/components/dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Your dashboard", robots: { index: false, follow: false } };

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/signin");
  if (isAdmin(user.role)) redirect(accountHomePath(user.role));
  return <Dashboard email={user.email} balanceUsd={user.balanceUsd} />;
}