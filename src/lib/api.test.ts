
import { describe, it, expect } from "vitest";
import { getJobs } from "./api";

describe("getJobs API", () => {
  it("should load the list of jobs", async () => {
    const jobs = await getJobs();

    expect(Array.isArray(jobs)).toBe(true);
    expect(jobs.length).toBe(12);
  });
});
