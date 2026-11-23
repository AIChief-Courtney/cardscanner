export type DemoTask = {
  id: string;
  fileName: string;
  status: "complete" | "failed" | "processing";
  outputLabel?: string;
  sampleOutput?: boolean;
};

export type DemoJob = {
  id: string;
  jobId: string;
  toolSlug: string;
  toolLabel: string;
  createdAt: string;
  status: "complete" | "failed" | "mixed" | "processing";
  tasks: DemoTask[];
};

const KEY = "filedock-demo-jobs";

export function loadDemoJobs(): DemoJob[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as DemoJob[]) : [];
  } catch {
    return [];
  }
}

export function saveDemoJob(job: DemoJob): void {
  const list = loadDemoJobs();
  list.unshift(job);
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 40)));
}