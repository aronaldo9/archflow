import Link from "next/link";
import { Suspense } from "react";
import { getAllProjects } from "@/lib/data";
import { formatCurrency, formatDate, getPhaseLabel } from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";
import ProgressBar from "@/components/ProgressBar";
import ProjectFilters from "@/components/ProjectFilters";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { status?: string; q?: string };
}) {
  const projects = await getAllProjects();

  const counts = {
    all:         projects.length,
    in_progress: projects.filter((p) => p.status === "in_progress").length,
    planning:    projects.filter((p) => p.status === "planning").length,
    review:      projects.filter((p) => p.status === "review").length,
    completed:   projects.filter((p) => p.status === "completed").length,
    on_hold:     projects.filter((p) => p.status === "on_hold").length,
  };

  const status = searchParams.status ?? "all";
  const q = (searchParams.q ?? "").toLowerCase().trim();

  const filtered = projects.filter((p) => {
    if (status !== "all" && p.status !== status) return false;
    if (q) {
      const haystack = `${p.name} ${p.code} ${p.clientName} ${p.location ?? ""}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <p className="text-zinc-400 text-sm">
          {filtered.length !== projects.length
            ? `${filtered.length} de ${counts.all} proyectos`
            : `${counts.all} proyectos en total`}
        </p>
        <Link
          href="/projects/new"
          className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Proyecto
        </Link>
      </div>

      {/* Filters */}
      <Suspense
        fallback={
          <div className="flex flex-wrap gap-2">
            {["Todos", "En Progreso", "Planificación", "Revisión", "Completado", "En Pausa"].map((l) => (
              <div key={l} className="h-8 w-24 bg-zinc-800 rounded-lg animate-pulse" />
            ))}
          </div>
        }
      >
        <ProjectFilters counts={counts} />
      </Suspense>

      {/* Project cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-10 h-10 text-zinc-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-zinc-400 text-sm">No se encontraron proyectos</p>
          {q && <p className="text-zinc-600 text-xs mt-1">Prueba con otro término de búsqueda</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((project) => {
            const tags = project.tags
              ? project.tags.split(",").map((t) => t.trim()).filter(Boolean)
              : [];

            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6 hover:border-zinc-600 transition-all group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-mono text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
                        {project.code}
                      </span>
                      <StatusBadge status={project.status} />
                    </div>
                    <h3 className="text-white font-semibold text-lg group-hover:text-zinc-100 mb-1">
                      {project.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-zinc-400 text-sm">
                      {project.location && (
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {project.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {project.clientName}
                      </span>
                      <span className="text-zinc-500">{getPhaseLabel(project.phase)}</span>
                    </div>
                  </div>

                  <div className="flex flex-row lg:flex-col gap-6 lg:gap-4 lg:items-end lg:min-w-[280px]">
                    <div className="flex gap-6">
                      <div>
                        <p className="text-zinc-500 text-xs mb-0.5">Presupuesto</p>
                        <p className="text-white text-sm font-medium">{formatCurrency(project.budget)}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500 text-xs mb-0.5">Gastado</p>
                        <p className="text-white text-sm font-medium">{formatCurrency(project.spent)}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500 text-xs mb-0.5">Fecha límite</p>
                        <p className="text-white text-sm font-medium">{formatDate(project.endDate)}</p>
                      </div>
                    </div>
                    <div className="flex-1 lg:w-full">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-zinc-500 text-xs">Progreso</span>
                        <span className="text-zinc-300 text-xs font-medium">{project.progress}%</span>
                      </div>
                      <ProgressBar value={project.progress} />
                    </div>
                  </div>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-zinc-700/30">
                    {tags.map((tag) => (
                      <span key={tag} className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
