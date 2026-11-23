export const metadata = { title: "Notifications" };

export default function NotificationsPage() {
  return (
    <section className="panel">
      <h1>Notifications</h1>
      <label>
        <input type="checkbox" defaultChecked /> Email when a job completes (demo)
      </label>
    </section>
  );
}