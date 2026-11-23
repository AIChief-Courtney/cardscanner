export const metadata = { title: "Account FAQ" };

export default function AccountFaqPage() {
  return (
    <section>
      <h1>Account FAQ</h1>
      <details>
        <summary>Is billing live?</summary>
        <p>No — checkout is demo-only until a payment provider is configured.</p>
      </details>
      <details>
        <summary>Where are my files?</summary>
        <p>Demo jobs keep files in memory; connect storage adapters for persistence.</p>
      </details>
    </section>
  );
}