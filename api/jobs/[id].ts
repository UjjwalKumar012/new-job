
import { jobs } from "../../src/data/jobs.js";

export default function handler(request: Request): Response {
  if (request.method !== "GET") {
    return Response.json(
      { message: "Method not allowed" },
      { status: 405, headers: { Allow: "GET" } }
    );
  }

  const url = new URL(request.url);
  const segments = url.pathname.split("/");
  const id = decodeURIComponent(segments[segments.length - 1] ?? "");

  const job = jobs.find((item) => item.id === id);

  if (!job) {
    return Response.json(
      { message: "Job not found" },
      { status: 404 }
    );
  }

  return Response.json(job);
}
