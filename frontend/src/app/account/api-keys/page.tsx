import { DEMO_API_KEYS } from "@/lib/account/demo-data";

export const metadata = { title: "API keys" };

export default function ApiKeysPage() {
  return (
    <section>
      <h1>API keys</h1>
      <p className="tool-demo-banner">Never display live secrets in demo mode.</p>
      <ul>
        {DEMO_API_KEYS.map((k) => (
          <li key={k.label} className="panel">
            {k.label}: <code>{k.masked}</code>
          </li>
        ))}
      </ul>
      <button type="button" className="button outline" disabled>
        Create key (demo only)
      </button>
    </section>
  );
}