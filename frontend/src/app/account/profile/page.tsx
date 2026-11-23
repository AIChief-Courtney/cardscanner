import Link from "next/link";
import { currentUser } from "@backend/lib/access";

export const metadata = { title: "Profile" };

export default async function AccountProfilePage() {
  const user = await currentUser();
  return (
    <section className="panel">
      <h1>Profile</h1>
      <p>Email: {user?.email ?? "—"}</p>
      <p>
        <Link href="/profile">Edit profile settings</Link> (existing route).
      </p>
    </section>
  );
}