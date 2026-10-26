export type WorkMode = "Remote" | "Hybrid" | "On-site";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  workMode: WorkMode;
  salaryMin?: number;
  salaryMax?: number;
  skills: string[];
  description: string;
  postedAt: string;
}