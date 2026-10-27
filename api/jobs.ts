
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { jobs } from "../src/data/jobs.js";

export default function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({
      message: "Method not allowed",
    });
  }

  const search = String(request.query.search ?? "").toLowerCase();
  const location = String(request.query.location ?? "");
  const workMode = String(request.query.workMode ?? "");

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

  return response.status(200).json(filteredJobs);
}