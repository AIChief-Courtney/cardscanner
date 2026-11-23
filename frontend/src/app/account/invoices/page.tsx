import { DEMO_INVOICES } from "@/lib/account/demo-data";

export const metadata = { title: "Invoices" };

export default function InvoicesPage() {
  return (
    <section>
      <h1>Invoices</h1>
      <table className="account-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {DEMO_INVOICES.map((inv) => (
            <tr key={inv.id}>
              <td>{inv.date}</td>
              <td>${inv.amount}</td>
              <td>{inv.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}