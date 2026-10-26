import { http, HttpResponse } from "msw";
import { jobs } from "../data/jobs";

export const handlers = [
  http.get("/api/jobs", () => {
    return HttpResponse.json(jobs);
  }),

  http.get("/api/jobs/:id", ({ params }) => {
    const job = jobs.find((item) => item.id === params.id);

    if (!job) {
      return HttpResponse.json(
        { message: "Job not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json(job);
  }),
];