
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { jobs } from "../../src/data/jobs.js";

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

  const id = request.query.id;

  if (typeof id !== "string") {
    return response.status(400).json({
      message: "Invalid job ID",
    });
  }

  const job = jobs.find((item) => item.id === id);

  if (!job) {
    return response.status(404).json({
      message: "Job not found",
    });
  }

  return response.status(200).json(job);
}
