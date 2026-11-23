import { DemoTasksClient } from "@/components/account/demo-tasks-client";

export const metadata = { title: "Tasks" };

export default function AccountTasksPage() {
  return (
    <section>
      <h1>Tasks</h1>
      <p className="tool-demo-banner">Tasks are individual file operations stored locally in demo mode.</p>
      <DemoTasksClient />
    </section>
  );
}