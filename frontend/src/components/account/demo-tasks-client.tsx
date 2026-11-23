"use client";

import { useEffect, useState } from "react";
import { loadDemoJobs, type DemoJob } from "@/lib/tools/job-history";

export function DemoTasksClient() {
  const [jobs, setJobs] = useState<DemoJob[]>([]);
  useEffect(() => setJobs(loadDemoJobs()), []);

  if (!jobs.length) {
    return <p className="placeholder-note">No tasks yet. Run a conversion demo to populate history.</p>;
  }

  return (
    <table className="account-table">
      <thead>
        <tr>
          <th>Task</th>
          <th>File</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {jobs.flatMap((j) =>
          j.tasks.map((t) => (
            <tr key={`${j.id}-${t.id}`}>
              <td>{j.toolLabel}</td>
              <td>{t.fileName}</td>
              <td>{t.status}</td>
            </tr>
          )),
        )}
      </tbody>
    </table>
  );
}

export function DemoJobsClient() {
  const [jobs, setJobs] = useState<DemoJob[]>([]);
  useEffect(() => setJobs(loadDemoJobs()), []);

  if (!jobs.length) {
    return <p className="placeholder-note">No jobs yet.</p>;
  }

  return (
    <ul className="job-list">
      {jobs.map((j) => (
        <li key={j.id} className="panel">
          <p>
            <strong>{j.jobId}</strong> · {j.toolLabel} · {new Date(j.createdAt).toLocaleString()}
          </p>
          <p>Status: {j.status}</p>
          <ul>
            {j.tasks.map((t) => (
              <li key={t.id}>
                {t.fileName} — {t.status}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}