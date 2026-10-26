import { useEffect, useState } from "react";
import JobCard from "../components/JobCard";
import { getJobs } from "../lib/api";
import type { Job, WorkMode } from "../types/job";

interface JobListingsPageProps {
  savedJobIds: string[];
  onToggleSave: (jobId: string) => void;
}

export default function JobListingsPage({
  savedJobIds,
  onToggleSave,
}: JobListingsPageProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadJobs() {
      setLoading(true);
      setError("");

      try {
        const data = await getJobs(controller.signal);
        setJobs(data);
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadJobs();

    return () => controller.abort();
  }, []);

  const locations = [...new Set(jobs.map((job) => job.location))];

  const filteredJobs = jobs.filter((job) => {
    const term = search.trim().toLowerCase();

    const matchesSearch =
      job.title.toLowerCase().includes(term) ||
      job.company.toLowerCase().includes(term) ||
      job.skills.some((skill) =>
        skill.toLowerCase().includes(term)
      );

    const matchesLocation =
      !location || job.location === location;

    const matchesMode =
      !workMode || job.workMode === workMode;

    const matchesSaved =
      !showSavedOnly || savedJobIds.includes(job.id);

    return (
      matchesSearch &&
      matchesLocation &&
      matchesMode &&
      matchesSaved
    );
  });

  function resetFilters() {
    setSearch("");
    setLocation("");
    setWorkMode("");
    setShowSavedOnly(false);
  }

  return (
    <>
      <section className="hero">
        <p className="eyebrow">YOUR NEXT OPPORTUNITY STARTS HERE</p>
        <h1>
          Find a job that
          <br />
          <span>moves you forward.</span>
        </h1>
        <p className="hero-description">
          Explore opportunities, discover new skills, and find
          your next career move.
        </p>
        <a className="hero-button" href="#jobs">
          Explore opportunities ↓
        </a>
      </section>

      <section className="jobs-section" id="jobs">
        <div className="section-heading">
          <div>
            <p className="eyebrow">CAREER OPPORTUNITIES</p>
            <h2>Explore jobs</h2>
            <p className="section-description">
              Find opportunities that match your interests.
            </p>
          </div>

          <span className="result-count" aria-live="polite">
            {loading
              ? "Loading jobs..."
              : `${filteredJobs.length} ${
                  filteredJobs.length === 1 ? "job" : "jobs"
                } found`}
          </span>
        </div>

        <div className="filter-panel">
          <div className="search-field">
            <label htmlFor="job-search">Search jobs</label>
            <input
              id="job-search"
              type="search"
              placeholder="Title, company or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={loading || Boolean(error)}
            />
          </div>

          <div className="filter-field">
            <label htmlFor="location-filter">Location</label>
            <select
              id="location-filter"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={loading || Boolean(error)}
            >
              <option value="">All locations</option>
              {locations.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-field">
            <label htmlFor="work-mode-filter">Work mode</label>
            <select
              id="work-mode-filter"
              value={workMode}
              onChange={(e) =>
                setWorkMode(e.target.value as "" | WorkMode)
              }
              disabled={loading || Boolean(error)}
            >
              <option value="">All modes</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

          <button
            className="reset-button"
            type="button"
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>

        <div className="saved-toolbar">
          <button
            type="button"
            className="reset-button"
            aria-pressed={showSavedOnly}
            onClick={() => setShowSavedOnly((value) => !value)}
            disabled={loading || Boolean(error)}
          >
            {showSavedOnly ? "♥ Showing saved" : "♡ Show saved jobs"}
            {" "}({savedJobIds.length})
          </button>
        </div>

        {loading ? (
          <div className="empty-state" role="status">
            <h3>Loading jobs...</h3>
            <p>Please wait while we fetch job listings.</p>
          </div>
        ) : error ? (
          <div className="empty-state" role="alert">
            <h3>Unable to load jobs</h3>
            <p>{error}</p>
            <button
              className="details-button"
              type="button"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="jobs-grid">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSaved={savedJobIds.includes(job.id)}
                onToggleSave={onToggleSave}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No jobs found</h3>
            <p>Try changing your search or filters.</p>
            <button
              className="details-button"
              type="button"
              onClick={resetFilters}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </>
  );
}