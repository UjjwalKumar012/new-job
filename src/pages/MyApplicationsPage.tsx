import { Link } from "react-router-dom";
import type {
  ApplicationStatus,
  JobApplication,
} from "../types/application";
import { jobs } from "../data/jobs";

interface Props {
  applications: JobApplication[];
  onUpdateStatus: (
    applicationId: string,
    status: ApplicationStatus
  ) => void;
}

const statuses: ApplicationStatus[] = [
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
];

export default function MyApplicationsPage({
  applications,
  onUpdateStatus,
}: Props) {
  if (applications.length === 0) {
    return (
      <main className="details-page">
        <h1>My Applications</h1>
        <p>You haven't applied to any demo jobs yet.</p>
        <Link to="/">Explore jobs →</Link>
      </main>
    );
  }

  return (
    <main className="applications-page">
      <div className="section-heading">
        <div>
          <p className="eyebrow">YOUR CAREER JOURNEY</p>
          <h1>My Applications</h1>
          <p className="section-description">
            Track the progress of your job applications.
          </p>
        </div>

        <span className="result-count">
          {applications.length} applications
        </span>
      </div>

      <div className="application-list">
        {applications.map((application) => {
          const job = jobs.find(
            (item) => item.id === application.jobId
          );

          if (!job) return null;

          return (
            <article
              className="application-card"
              key={application.id}
            >
              <div className="company-logo" aria-hidden="true">
                {job.company.charAt(0)}
              </div>

              <div className="application-info">
                <h2>{job.title}</h2>
                <p className="company-name">
                  {job.company} · {job.location}
                </p>

                <p className="application-date">
                  Applied on{" "}
                  {new Date(application.appliedAt).toLocaleDateString(
                    "en-IN"
                  )}
                </p>

                <Link to={`/jobs/${job.id}`}>
                  View job details →
                </Link>
              </div>

              <div className="application-status">
                <label htmlFor={`status-${application.id}`}>
                  Application status
                </label>

                <select
                  id={`status-${application.id}`}
                  value={application.status}
                  onChange={(event) =>
                    onUpdateStatus(
                      application.id,
                      event.target.value as ApplicationStatus
                    )
                  }
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}