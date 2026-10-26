
import { jobs } from "../src/data/jobs";

export default function handler(request: Request): Response {
  if (request.method !== "GET") {
    return Response.json(
      { message: "Method not allowed" },
      { status: 405, headers: { Allow: "GET" } }
    );
  }

  const url = new URL(request.url);
  const search = (url.searchParams.get("search") ?? "").toLowerCase();
  const location = url.searchParams.get("location") ?? "";
  const workMode = url.searchParams.get("workMode") ?? "";

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search) ||
      job.company.toLowerCase().includes(search) ||
      job.skills.some((skill) =>
        skill.toLowerCase().includes(search)
      );

    return (
      matchesSearch &&
      (!location || job.location === location) &&
      (!workMode || job.workMode === workMode)
    );
  });

  return Response.json(filteredJobs);
}
