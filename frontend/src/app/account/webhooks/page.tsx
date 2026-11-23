import { DEMO_WEBHOOKS } from "@/lib/account/demo-data";

export const metadata = { title: "Webhooks" };

export default function WebhooksPage() {
  return (
    <section>
      <h1>Webhooks</h1>
      <ul>
        {DEMO_WEBHOOKS.map((w) => (
          <li key={w.url} className="panel">
            {w.url} — {w.status}
          </li>
        ))}
      </ul>
      <button type="button" className="button outline" disabled>
        Send test delivery (demo)
      </button>
    </section>
  );
}