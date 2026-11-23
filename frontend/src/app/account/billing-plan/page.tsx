import Link from "next/link";
import { DEMO_PLANS } from "@/lib/account/demo-data";

export const metadata = { title: "Billing plan" };

export default function BillingPlanPage() {
  const plan = DEMO_PLANS[1];
  return (
    <section className="panel">
      <h1>Billing plan</h1>
      <p>
        Current: <strong>{plan.name}</strong> · {plan.credits} credits · renews monthly (demo)
      </p>
      <p>Usage: 143 / {plan.credits} tasks (sample)</p>
      <Link className="button dark button--filedock" href="/pricing">
        Change plan
      </Link>
    </section>
  );
}