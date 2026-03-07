import dynamic from "next/dynamic";
import { getProjectsForMap } from "@/lib/data";

const ProjectMap = dynamic(() => import("@/components/ProjectMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-zinc-900 rounded-xl">
      <p className="text-zinc-500 text-sm">Cargando mapa…</p>
    </div>
  ),
});

export default async function MapPage() {
  const projects = await getProjectsForMap();

  return (
    <div className="flex flex-col gap-6 max-w-7xl">
      {/* Cabecera */}
      <div>
        <h2 className="text-2xl font-semibold text-white">Mapa de Proyectos</h2>
        <p className="text-zinc-400 mt-1 text-sm">
          Visión geográfica de todos los proyectos activos.
        </p>
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
        {[
          { label: "Planificación",  color: "#71717a" },
          { label: "En Progreso",    color: "#f59e0b" },
          { label: "Revisión",       color: "#3b82f6" },
          { label: "Completado",     color: "#10b981" },
          { label: "En Pausa",       color: "#f97316" },
        ].map(({ label, color }) => (
          <span key={label} className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ background: color }}
            />
            {label}
          </span>
        ))}
      </div>

      {/* Mapa */}
      <div className="h-[560px] rounded-xl overflow-hidden border border-zinc-700/50">
        <ProjectMap projects={projects} />
      </div>

      {/* Tabla de proyectos */}
      <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-700/50">
              <th className="text-left text-xs text-zinc-500 font-medium uppercase tracking-wider px-5 py-3">Proyecto</th>
              <th className="text-left text-xs text-zinc-500 font-medium uppercase tracking-wider px-5 py-3 hidden sm:table-cell">Ubicación</th>
              <th className="text-left text-xs text-zinc-500 font-medium uppercase tracking-wider px-5 py-3">Estado</th>
              <th className="text-left text-xs text-zinc-500 font-medium uppercase tracking-wider px-5 py-3 hidden md:table-cell">Coordenadas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-700/30">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-zinc-700/20 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="text-white text-sm font-medium">{p.name}</p>
                  <p className="text-zinc-500 text-xs font-mono">{p.code}</p>
                </td>
                <td className="px-5 py-3.5 text-zinc-400 text-sm hidden sm:table-cell">{p.location ?? "—"}</td>
                <td className="px-5 py-3.5">
                  <span className="text-xs font-medium capitalize text-zinc-300">
                    {p.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-zinc-500 text-xs font-mono hidden md:table-cell">
                  {p.latitude?.toFixed(4)}, {p.longitude?.toFixed(4)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
