import type { Job } from "../types/job";

export async function getJobs(signal?: AbortSignal): Promise<Job[]> {
  const response = await fetch("/api/jobs", { signal });

  if (!response.ok) {
    throw new Error(`Failed to load jobs (${response.status})`);
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Invalid jobs response");
  }

  return data as Job[];
}

export async function getJobById(
  id: string,
  signal?: AbortSignal
): Promise<Job> {
  const response = await fetch(
    `/api/jobs/${encodeURIComponent(id)}`,
    { signal }
  );

  if (!response.ok) {
    throw new Error(
      response.status === 404
        ? "Job not found"
        : `Failed to load job (${response.status})`
    );
  }

  return (await response.json()) as Job;
}