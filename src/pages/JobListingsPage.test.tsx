
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import JobListingsPage from "./JobListingsPage";
import { getJobs } from "../lib/api";
import { jobs } from "../data/jobs";

vi.mock("../lib/api", () => ({
  getJobs: vi.fn(),
}));

vi.mock("../components/JobCard", () => ({
  default: ({ job, isSaved, onToggleSave }: {
    job: { id: string; title: string; company: string; location: string; workMode: string };
    isSaved: boolean;
    onToggleSave: (id: string) => void;
  }) => (
    <article>
      <h3>{job.title}</h3>
      <p>{job.company}</p>
      <p>{job.location}</p>
      <p>{job.workMode}</p>
      <button onClick={() => onToggleSave(job.id)}>
        {isSaved ? "Saved" : "Save Job"}
      </button>
    </article>
  ),
}));

const mockedGetJobs = vi.mocked(getJobs);

describe("JobListingsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetJobs.mockResolvedValue(jobs);
  });

  it("shows loading state before jobs load", () => {
    mockedGetJobs.mockReturnValue(new Promise(() => {}));

    render(
      <JobListingsPage savedJobIds={[]} onToggleSave={vi.fn()} />
    );

    expect(screen.getByRole("status")).toBeInTheDocument();

expect(
  screen.getAllByText("Loading jobs...").length
).toBeGreaterThan(0);
  });

  it("renders jobs returned by the API", async () => {
    render(
      <JobListingsPage savedJobIds={[]} onToggleSave={vi.fn()} />
    );

    expect(
      await screen.findByText(jobs[0].title)
    ).toBeInTheDocument();

    expect(screen.getByText("12 jobs found")).toBeInTheDocument();
  });

  it("filters jobs by title", async () => {
    const user = userEvent.setup();

    render(
      <JobListingsPage savedJobIds={[]} onToggleSave={vi.fn()} />
    );

    await screen.findByText(jobs[0].title);

    const searchInput = screen.getByRole("searchbox", {
      name: "Search jobs",
    });

    await user.type(searchInput, jobs[0].title);

    expect(
      screen.getByText(jobs[0].title)
    ).toBeInTheDocument();

    expect(screen.getByText("1 job found")).toBeInTheDocument();
  });

  it("filters jobs by location", async () => {
    const user = userEvent.setup();

    render(
      <JobListingsPage savedJobIds={[]} onToggleSave={vi.fn()} />
    );

    await screen.findByText(jobs[0].title);

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Location" }),
      jobs[0].location
    );

    await waitFor(() => {
      expect(
        screen.getByText(`${jobs.filter((job) => job.location === jobs[0].location).length} jobs found`)
      ).toBeInTheDocument();
    });
  });

  it("shows only saved jobs when the saved filter is enabled", async () => {
    const user = userEvent.setup();
    const savedJob = jobs[0];

    render(
      <JobListingsPage
        savedJobIds={[savedJob.id]}
        onToggleSave={vi.fn()}
      />
    );

    await screen.findByText(savedJob.title);

    await user.click(
      screen.getByRole("button", { name: /Show saved jobs/i })
    );

    expect(screen.getByText(savedJob.title)).toBeInTheDocument();
    expect(screen.getByText("1 job found")).toBeInTheDocument();
  });

  it("shows an error message when the API fails", async () => {
    mockedGetJobs.mockRejectedValue(new Error("Network error"));

    render(
      <JobListingsPage savedJobIds={[]} onToggleSave={vi.fn()} />
    );

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Network error")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Retry" })
    ).toBeInTheDocument();
  });

  it("resets search and filters", async () => {
    const user = userEvent.setup();

    render(
      <JobListingsPage savedJobIds={[]} onToggleSave={vi.fn()} />
    );

    await screen.findByText(jobs[0].title);

    await user.type(
      screen.getByRole("searchbox", { name: "Search jobs" }),
      "no-matching-job"
    );

    expect(screen.getByText("0 jobs found")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Reset" }));

    expect(
      screen.getByRole("searchbox", { name: "Search jobs" })
    ).toHaveValue("");

    expect(screen.getByText("12 jobs found")).toBeInTheDocument();
  });
});
