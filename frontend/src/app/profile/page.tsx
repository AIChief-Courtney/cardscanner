import { redirect } from "next/navigation";
import { currentUser } from "@backend/lib/access";
import { accountHomePath, isAdmin, roleLabel } from "@backend/lib/roles";
import { Header } from "@/components/brand";
import { ProfileForm, type ProfileUser } from "@/components/profile-form";
import { ProfileActivity } from "@/components/profile-activity";
import { SiteFooter } from "@/components/site-footer";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Account", robots: { index: false, follow: false } };

export default async function ProfilePage() {
  const user = await currentUser();
  if (!user) redirect("/signin");
  if (isAdmin(user.role)) redirect(accountHomePath(user.role));

  const profile: ProfileUser = {
    id: user.id,
    email: user.email,
    role: user.role,
    roleLabel: roleLabel(user.role),
    balanceUsd: user.balanceUsd,
    createdAt: user.createdAt,
  };

  return (
    <>
      <Header signedIn={true} admin={false} />
      <ProfileForm user={profile} />
      <div className="workspace" style={{ paddingTop: 0 }}>
        <ProfileActivity />
      </div>
      <SiteFooter signedIn={true} admin={false} />
    </>
  );
}