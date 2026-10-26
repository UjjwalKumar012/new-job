import { Link } from "react-router-dom";
import type { Job } from "../types/job";

interface JobCardProps {
  job: Job;
  isSaved: boolean;
  onToggleSave: (jobId: string) => void;
}

function formatSalary(min?: number, max?: number): string {
  if (min == null || max == null) {
    return "Salary not disclosed";
  }

  return `₹${(min / 100000).toFixed(1)} – ₹${(
    max / 100000
  ).toFixed(1)} LPA`;
}

export default function JobCard({
  job,
  isSaved,
  onToggleSave,
}: JobCardProps) {
  return (
    <article className="job-card">
      <div className="job-card-top">
        <div className="company-logo" aria-hidden="true">
          {job.company.charAt(0)}
        </div>

        <span className="work-badge">{job.workMode}</span>
      </div>

      <h2 className="job-title">{job.title}</h2>
      <p className="company-name">{job.company}</p>

      <div className="job-meta">
        <span>📍 {job.location}</span>
        <span>
          💰 {formatSalary(job.salaryMin, job.salaryMax)}
        </span>
      </div>

      <p className="job-description">{job.description}</p>

      <div className="skills-list">
        {job.skills.map((skill) => (
          <span className="skill-tag" key={skill}>
            {skill}
          </span>
        ))}
      </div>

      <div className="job-card-footer">
        <button
          className="save-button"
          type="button"
          aria-pressed={isSaved}
          onClick={() => onToggleSave(job.id)}
        >
          {isSaved ? "♥ Saved" : "♡ Save Job"}
        </button>

        <Link className="details-button" to={`/jobs/${job.id}`}>
          View Details →
        </Link>
      </div>
    </article>
  );
}