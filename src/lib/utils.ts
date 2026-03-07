import { ProjectStatus, ProjectPhase } from "@/types";

export function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) {
    return `€${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `€${(amount / 1_000).toFixed(0)}K`;
  }
  return `€${amount}`;
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const statusConfig: Record<ProjectStatus, { label: string; color: string; bg: string; dot: string }> = {
  planning: {
    label: "Planificación",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    dot: "bg-blue-400",
  },
  in_progress: {
    label: "En progreso",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    dot: "bg-amber-400",
  },
  review: {
    label: "Revisión",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    dot: "bg-violet-400",
  },
  completed: {
    label: "Completado",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    dot: "bg-emerald-400",
  },
  on_hold: {
    label: "En pausa",
    color: "text-zinc-400",
    bg: "bg-zinc-400/10",
    dot: "bg-zinc-400",
  },
};

export const phaseLabels: Record<ProjectPhase, string> = {
  concept: "Concepto",
  schematic: "Diseño Esquemático",
  design_development: "Desarrollo de Diseño",
  construction_docs: "Documentos de Construcción",
  construction: "Construcción",
  post_construction: "Post-Construcción",
};

export function getPhaseLabel(phase: string): string {
  return phaseLabels[phase as ProjectPhase] ?? phase;
}
