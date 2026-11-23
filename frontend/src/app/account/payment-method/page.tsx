export const metadata = { title: "Payment method" };

export default function PaymentMethodPage() {
  return (
    <section className="panel">
      <h1>Payment method</h1>
      <p>Demo — no payment processor connected.</p>
      <p>Card ending •••• 4242 (sample)</p>
      <button type="button" className="button outline" disabled>
        Update via provider (unavailable)
      </button>
    </section>
  );
}