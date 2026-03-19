import Link from "next/link";
import { getAllProjects, getProjectStats, getBudgetAnalytics } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";
import ProgressBar from "@/components/ProgressBar";
import StatsCard from "@/components/StatsCard";
import BudgetChart from "@/components/BudgetChart";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, allProjects, budgetAnalytics] = await Promise.all([
    getProjectStats(),
    getAllProjects(),
    getBudgetAnalytics(),
  ]);

  const recentProjects = allProjects.slice(0, 4);
  const activeProjects = allProjects.filter(
    (p) => p.status === "in_progress" || p.status === "review"
  );

  const budgetPct =
    stats.totalBudget > 0
      ? (stats.totalSpent / stats.totalBudget) * 100
      : 0;

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Bienvenida */}
      <div>
        <h2 className="text-2xl font-semibold text-white">Buenos días, Arch Studio</h2>
        <p className="text-zinc-400 mt-1 text-sm">
          Esto es lo que está ocurriendo en tus proyectos.
        </p>
      </div>

      {/* Stats grid — 2 cols on mobile, 3 on md, 6 on xl */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard
          label="Proyectos Totales"
          value={stats.total.toString()}
          sub="Total acumulado"
          accent="zinc"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
        />

        <StatsCard
          label="Proyectos Activos"
          value={stats.active.toString()}
          sub="En progreso o revisión"
          accent="amber"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />

        <StatsCard
          label="Completados"
          value={stats.completed.toString()}
          sub="Entregados al cliente"
          accent="emerald"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          }
        />

        <StatsCard
          label="Finalizan Pronto"
          value={stats.finishingSoon.toString()}
          sub="Próximos 30 días"
          accent={stats.finishingSoon > 0 ? "orange" : "zinc"}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <StatsCard
          label="Presup. Medio"
          value={formatCurrency(stats.avgBudget)}
          sub="Por proyecto"
          accent="blue"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <StatsCard
          label="Hitos"
          value={`${stats.milestoneCompletionPct}%`}
          sub={`${stats.completedMilestones} de ${stats.totalMilestones} completados`}
          accent="violet"
          progress={stats.milestoneCompletionPct}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
          }
        />
      </div>

      {/* Análisis de Presupuesto */}
      <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-medium">Análisis de Presupuesto</h3>
            <p className="text-zinc-500 text-xs mt-0.5">Gastado vs. restante en todos los proyectos</p>
          </div>
        </div>
        <BudgetChart projects={budgetAnalytics.projects} totals={budgetAnalytics.totals} />
      </div>

      {/* Resumen de Presupuesto */}
      <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium">Resumen de Presupuesto</h3>
          <span className="text-zinc-400 text-sm">Todos los proyectos</span>
        </div>
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div>
            <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1">Presupuesto Total</p>
            <p className="text-white text-2xl font-semibold">{formatCurrency(stats.totalBudget)}</p>
          </div>
          <div>
            <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1">Total Gastado</p>
            <p className="text-white text-2xl font-semibold">{formatCurrency(stats.totalSpent)}</p>
          </div>
          <div>
            <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1">Restante</p>
            <p className="text-emerald-400 text-2xl font-semibold">
              {formatCurrency(stats.totalBudget - stats.totalSpent)}
            </p>
          </div>
        </div>
        <ProgressBar value={budgetPct} />
        <p className="text-zinc-500 text-xs mt-2">
          {budgetPct.toFixed(1)}% del presupuesto total utilizado
        </p>
      </div>

      {/* Proyectos Activos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium">Proyectos Activos</h3>
          <Link href="/projects" className="text-zinc-400 hover:text-white text-sm transition-colors">
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {activeProjects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-5 hover:border-zinc-600 transition-colors group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-zinc-500 font-mono mb-1">{project.code}</p>
                  <h4 className="text-white font-medium group-hover:text-zinc-100">{project.name}</h4>
                  <p className="text-zinc-400 text-sm mt-0.5">{project.location}</p>
                </div>
                <StatusBadge status={project.status} />
              </div>
              <ProgressBar value={project.progress} className="mb-2" />
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>{project.progress}% completado</span>
                <span>Vence {formatDate(project.endDate)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Actualizados Recientemente */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium">Actualizados Recientemente</h3>
        </div>
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-700/50">
                <th className="text-left text-xs text-zinc-500 font-medium uppercase tracking-wider px-5 py-3">Proyecto</th>
                <th className="text-left text-xs text-zinc-500 font-medium uppercase tracking-wider px-5 py-3 hidden md:table-cell">Cliente</th>
                <th className="text-left text-xs text-zinc-500 font-medium uppercase tracking-wider px-5 py-3">Estado</th>
                <th className="text-left text-xs text-zinc-500 font-medium uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Presupuesto</th>
                <th className="text-left text-xs text-zinc-500 font-medium uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Actualizado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-700/30">
              {recentProjects.map((project) => (
                <tr key={project.id} className="hover:bg-zinc-700/20 transition-colors">
                  <td className="px-5 py-3.5">
                    <Link href={`/projects/${project.id}`} className="group">
                      <p className="text-white text-sm font-medium group-hover:text-zinc-300 transition-colors">{project.name}</p>
                      <p className="text-zinc-500 text-xs font-mono">{project.code}</p>
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-zinc-400 text-sm hidden md:table-cell">{project.clientName}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={project.status} />
                  </td>
                  <td className="px-5 py-3.5 text-zinc-400 text-sm hidden lg:table-cell">{formatCurrency(project.budget)}</td>
                  <td className="px-5 py-3.5 text-zinc-500 text-sm hidden lg:table-cell">{formatDate(project.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
