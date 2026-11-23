import Link from "next/link";

export const metadata = { title: "Activity" };

export default function AccountActivityPage() {
  return (
    <section className="panel">
      <h1>Activity</h1>
      <p>
        View detailed sign-in activity on <Link href="/profile">profile</Link>.
      </p>
    </section>
  );
}