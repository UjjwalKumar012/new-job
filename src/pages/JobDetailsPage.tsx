import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getJobById } from "../lib/api";
import type { Job } from "../types/job";
import type { JobApplication } from "../types/application";

interface Props {
  applications: JobApplication[];
  onApply: (jobId: string) => void;
}

export default function JobDetailsPage({
  applications,
  onApply,
}: Props) {
  const { id } = useParams<{ id: string }>();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Invalid job ID.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadJob() {
      setLoading(true);
      setError("");
      setJob(null);

      try {
        const data = await getJobById(id!, controller.signal);
        setJob(data);
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error ? err.message : "Unable to load job."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadJob();

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <main className="details-page" role="status">
        <h1>Loading job details...</h1>
      </main>
    );
  }

  if (error || !job) {
    return (
      <main className="details-page" role="alert">
        <h1>{error || "Job not found"}</h1>
        <Link to="/">← Back to jobs</Link>
      </main>
    );
  }

  const alreadyApplied = applications.some(
    (application) => application.jobId === job.id
  );

  return (
    <main className="details-page">
      <Link className="back-link" to="/">
        ← Back to jobs
      </Link>

      <article className="details-card">
        <div className="company-logo" aria-hidden="true">
          {job.company.charAt(0)}
        </div>

        <p className="eyebrow">JOB DETAILS</p>
        <h1>{job.title}</h1>
        <p className="company-name">{job.company}</p>

        <div className="job-meta">
          <span>📍 {job.location}</span>
          <span>{job.workMode}</span>
          <span>{job.postedAt}</span>
        </div>

        <h2>About this role</h2>
        <p>{job.description}</p>

        <h2>Required skills</h2>
        <div className="skills-list">
          {job.skills.map((skill) => (
            <span className="skill-tag" key={skill}>
              {skill}
            </span>
          ))}
        </div>

        <h2>Salary range</h2>
        <p>
          {job.salaryMin != null && job.salaryMax != null
            ? `₹${(job.salaryMin / 100000).toFixed(1)} – ₹${(
                job.salaryMax / 100000
              ).toFixed(1)} LPA`
            : "Salary not disclosed"}
        </p>

        <button
          className="apply-button"
          type="button"
          disabled={alreadyApplied}
          onClick={() => onApply(job.id)}
        >
          {alreadyApplied ? "Already Applied ✓" : "Apply for this job"}
        </button>

        {alreadyApplied && (
          <p role="status">
            Your demo application is in My Applications.
          </p>
        )}
      </article>
    </main>
  );
}