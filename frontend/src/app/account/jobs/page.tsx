import { DemoJobsClient } from "@/components/account/demo-tasks-client";

export const metadata = { title: "Jobs" };

export default function AccountJobsPage() {
  return (
    <section>
      <h1>Jobs</h1>
      <p className="tool-demo-banner">Jobs group one or more tasks from a workspace run.</p>
      <DemoJobsClient />
    </section>
  );
}