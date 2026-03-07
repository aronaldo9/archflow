export type ProjectStatus = "planning" | "in_progress" | "review" | "completed" | "on_hold";

export type ProjectPhase =
  | "concept"
  | "schematic"
  | "design_development"
  | "construction_docs"
  | "construction"
  | "post_construction";

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate: Date | string;
  projectId: string;
}

export interface Document {
  id: string;
  name: string;
  fileUrl: string;
  uploadedAt: Date | string;
  projectId: string;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  description: string | null;
  status: ProjectStatus;
  phase: ProjectPhase;
  location: string | null;
  budget: number;
  spent: number;
  progress: number;
  startDate: Date | string;
  endDate: Date | string;
  clientName: string;
  clientEmail: string | null;
  clientPhone: string | null;
  tags: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  milestones?: Milestone[];
  documents?: Document[];
}

export interface ProjectStats {
  total: number;
  inProgress: number;
  completed: number;
  onHold: number;
  totalBudget: number;
  totalSpent: number;
}
