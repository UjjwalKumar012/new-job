export type ApplicationStatus =
  | "Applied"
  | "Interview"
  | "Offer"
  | "Rejected";

export interface JobApplication {
  id: string;
  jobId: string;
  appliedAt: string;
  status: ApplicationStatus;
}