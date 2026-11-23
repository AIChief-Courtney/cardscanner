"use client";

import { useState } from "react";
import { DEMO_PLANS } from "@/lib/account/demo-data";

export function PricingCheckout() {
  const [interval, setInterval] = useState<"monthly" | "yearly">("monthly");
  const [selected, setSelected] = useState("pro");
  const [checkout, setCheckout] = useState<"idle" | "pending" | "success" | "canceled" | "failed">("idle");
  const plan = DEMO_PLANS.find((p) => p.id === selected) ?? DEMO_PLANS[1];
  const price = interval === "monthly" ? plan.priceMonthly : plan.priceMonthly * 10;

  function startCheckout() {
    setCheckout("pending");
    window.setTimeout(() => setCheckout("success"), 800);
  }

  return (
    <div className="pricing-page">
      <div className="pricing-toggle">
        <button type="button" className={interval === "monthly" ? "active" : ""} onClick={() => setInterval("monthly")}>
          Monthly
        </button>
        <button type="button" className={interval === "yearly" ? "active" : ""} onClick={() => setInterval("yearly")}>
          Yearly
        </button>
      </div>
      <div className="pricing-grid">
        {DEMO_PLANS.map((p) => (
          <article key={p.id} className={`panel pricing-card ${selected === p.id ? "pricing-card--selected" : ""}`}>
            <h2>{p.name}</h2>
            <p className="pricing-price">
              ${interval === "monthly" ? p.priceMonthly : p.priceMonthly * 10}/{interval === "monthly" ? "mo" : "yr"}
            </p>
            <ul>
              {p.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <button type="button" className="button outline" onClick={() => setSelected(p.id)}>
              Select
            </button>
          </article>
        ))}
      </div>
      <div className="panel checkout-summary">
        <h2>Checkout summary (demo)</h2>
        <p>
          {plan.name} · ${price} total · {plan.credits} credits · renews {interval}
        </p>
        <button type="button" className="button dark button--filedock" onClick={startCheckout} disabled={checkout === "pending"}>
          Continue (demo — no payment)
        </button>
        {checkout !== "idle" && <p aria-live="polite">Status: {checkout}</p>}
      </div>
    </div>
  );
}