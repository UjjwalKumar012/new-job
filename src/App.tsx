import { useState } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
} from "react-router-dom";

import JobListingsPage from "./pages/JobListingsPage";
import JobDetailsPage from "./pages/JobDetailsPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";

import { jobs } from "./data/jobs";
import type {
  ApplicationStatus,
  JobApplication,
} from "./types/application";

import "./App.css";

const APPLICATIONS_KEY = "new-job-applications";
const SAVED_JOBS_KEY = "new-job-saved-jobs";

function readSavedJobs(): string[] {
  try {
    const value: unknown = JSON.parse(
      localStorage.getItem(SAVED_JOBS_KEY) ?? "[]"
    );

    if (!Array.isArray(value)) return [];

    return value.filter(
      (id): id is string =>
        typeof id === "string" &&
        jobs.some((job) => job.id === id)
    );
  } catch {
    return [];
  }
}

function readApplications(): JobApplication[] {
  try {
    const value: unknown = JSON.parse(
      localStorage.getItem(APPLICATIONS_KEY) ?? "[]"
    );

    if (!Array.isArray(value)) return [];

    const validStatuses: ApplicationStatus[] = [
      "Applied",
      "Interview",
      "Offer",
      "Rejected",
    ];

    const valid = value.filter((item): item is JobApplication => {
      if (typeof item !== "object" || item === null) return false;

      const app = item as Record<string, unknown>;

      return (
        typeof app.id === "string" &&
        typeof app.jobId === "string" &&
        jobs.some((job) => job.id === app.jobId) &&
        typeof app.appliedAt === "string" &&
        !Number.isNaN(Date.parse(app.appliedAt)) &&
        typeof app.status === "string" &&
        validStatuses.includes(app.status as ApplicationStatus)
      );
    });

    const unique = new Map<string, JobApplication>();

    for (const application of valid) {
      if (!unique.has(application.jobId)) {
        unique.set(application.jobId, application);
      }
    }

    return [...unique.values()];
  } catch {
    return [];
  }
}

function AppContent() {
  const [savedJobIds, setSavedJobIds] =
    useState<string[]>(readSavedJobs);

  const [applications, setApplications] =
    useState<JobApplication[]>(readApplications);

  function toggleSavedJob(jobId: string) {
    setSavedJobIds((current) => {
      const updated = current.includes(jobId)
        ? current.filter((id) => id !== jobId)
        : [...current, jobId];

      try {
        localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(updated));
      } catch {
        console.error("Could not save job preferences.");
      }

      return updated;
    });
  }

  function applyToJob(jobId: string) {
    setApplications((current) => {
      if (
        !jobs.some((job) => job.id === jobId) ||
        current.some((application) => application.jobId === jobId)
      ) {
        return current;
      }

      const updated: JobApplication[] = [
        ...current,
        {
          id: crypto.randomUUID(),
          jobId,
          appliedAt: new Date().toISOString(),
          status: "Applied",
        },
      ];

      try {
        localStorage.setItem(
          APPLICATIONS_KEY,
          JSON.stringify(updated)
        );
      } catch {
        console.error("Could not persist the application.");
      }

      return updated;
    });
  }

  function updateApplicationStatus(
    applicationId: string,
    status: ApplicationStatus
  ) {
    setApplications((current) => {
      const updated = current.map((application) =>
        application.id === applicationId
          ? { ...application, status }
          : application
      );

      try {
        localStorage.setItem(
          APPLICATIONS_KEY,
          JSON.stringify(updated)
        );
      } catch {
        console.error("Could not persist the application status.");
      }

      return updated;
    });
  }

  return (
    <div className="app">
      <header className="navbar">
        <Link className="brand" to="/" aria-label="New Job home">
          New <span>Job</span>
        </Link>

        <nav aria-label="Main navigation">
          <Link to="/">Explore Jobs</Link>
          <Link to="/applications">My Applications</Link>
          <a href="/#about">About</a>
        </nav>

        <span className="demo-label">
          Saved: {savedJobIds.length}
        </span>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <JobListingsPage
              savedJobIds={savedJobIds}
              onToggleSave={toggleSavedJob}
            />
          }
        />

        <Route
          path="/jobs/:id"
          element={
            <JobDetailsPage
              applications={applications}
              onApply={applyToJob}
            />
          }
        />

        <Route
          path="/applications"
          element={
            <MyApplicationsPage
              applications={applications}
              onUpdateStatus={updateApplicationStatus}
            />
          }
        />

        <Route
          path="*"
          element={
            <main className="details-page">
              <h1>Page not found</h1>
              <Link to="/">Back to jobs</Link>
            </main>
          }
        />
      </Routes>

      <footer className="footer">
        <span>New Job © 2026</span>
        <span>Built with React and TypeScript</span>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}