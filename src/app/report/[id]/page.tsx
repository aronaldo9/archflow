import { notFound } from "next/navigation";
import { getProjectById, getDocumentsByProject, getExpensesByProject, getActivityByProject, getTeamByProject } from "@/lib/data";
import { formatDate, getPhaseLabel, statusConfig } from "@/lib/utils";
import ReportActions from "@/components/ReportActions";

export const dynamic = "force-dynamic";

function fmt(n: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

const CATEGORIES: Record<string, string> = {
  materials: "Materiales", labor: "Mano de obra", equipment: "Equipamiento",
  permits: "Licencias y permisos", subcontracting: "Subcontratación", other: "Otros",
};

export default async function ReportPage({ params }: { params: { id: string } }) {
  const [project, rawDocs, expenses, activity, team] = await Promise.all([
    getProjectById(params.id),
    getDocumentsByProject(params.id),
    getExpensesByProject(params.id),
    getActivityByProject(params.id, 20),
    getTeamByProject(params.id),
  ]);
  if (!project) notFound();

  const milestones   = project.milestones ?? [];
  const completed    = milestones.filter((m) => m.completed).length;
  const budgetPct    = project.budget > 0 ? (project.spent / project.budget) * 100 : 0;
  const generatedAt  = new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
  const statusCfg    = statusConfig[project.status as keyof typeof statusConfig];
  const expenseTotal = expenses.reduce((s, e) => s + e.amount, 0);
  const files        = rawDocs.filter((d) => !/\.(svg|jpg|jpeg|png|gif|webp)$/i.test(d.name));

  return (
    <>
      {/* ── Print button (hidden in print) ── */}
      <ReportActions />

      {/* ── Report body ── */}
      <article className="min-h-screen bg-white text-zinc-900 font-sans">
        <div className="max-w-4xl mx-auto px-10 py-12 print:px-8 print:py-8">

          {/* Cover */}
          <header className="flex items-start justify-between mb-10 pb-8 border-b-2 border-zinc-900">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="ArchFlow" width={200} height={60} className="mb-4 object-contain" />
              <p className="text-xs text-zinc-400 uppercase tracking-widest mb-2">Informe de Proyecto</p>
              <h1 className="text-3xl font-bold text-zinc-900 leading-tight">{project.name}</h1>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-xs font-mono bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">{project.code}</span>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${statusCfg?.color ?? ""} bg-zinc-50 border-zinc-200`}>
                  {statusCfg?.label ?? project.status}
                </span>
                <span className="text-xs text-zinc-400">{getPhaseLabel(project.phase)}</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-zinc-400">Generado el</p>
              <p className="text-sm font-medium text-zinc-700">{generatedAt}</p>
            </div>
          </header>

          {/* Summary */}
          <section className="mb-10">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Resumen Ejecutivo</h2>
            <div className="grid grid-cols-2 gap-6">
              <dl className="space-y-2 text-sm">
                {project.location && <div className="flex gap-3"><dt className="text-zinc-400 w-32 flex-shrink-0">Ubicación</dt><dd className="text-zinc-800 font-medium">{project.location}</dd></div>}
                <div className="flex gap-3"><dt className="text-zinc-400 w-32 flex-shrink-0">Cliente</dt><dd className="text-zinc-800 font-medium">{project.clientName}</dd></div>
                {project.clientEmail && <div className="flex gap-3"><dt className="text-zinc-400 w-32 flex-shrink-0">Email cliente</dt><dd className="text-zinc-800">{project.clientEmail}</dd></div>}
                <div className="flex gap-3"><dt className="text-zinc-400 w-32 flex-shrink-0">Inicio</dt><dd className="text-zinc-800">{formatDate(project.startDate)}</dd></div>
                <div className="flex gap-3"><dt className="text-zinc-400 w-32 flex-shrink-0">Fin previsto</dt><dd className="text-zinc-800">{formatDate(project.endDate)}</dd></div>
              </dl>
              <div>
                {project.description && (
                  <p className="text-sm text-zinc-600 leading-relaxed">{project.description}</p>
                )}
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1 bg-zinc-100 rounded-full h-2">
                    <div className="bg-zinc-900 h-2 rounded-full" style={{ width: `${Math.min(100, project.progress)}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-zinc-900">{project.progress}%</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">Progreso general — {completed} de {milestones.length} hitos completados</p>
              </div>
            </div>
          </section>

          {/* Budget */}
          <section className="mb-10 print:break-inside-avoid">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Presupuesto</h2>
            <table className="w-full text-sm border border-zinc-200 rounded-lg overflow-hidden">
              <thead className="bg-zinc-50">
                <tr>
                  {["Presupuesto total","Gasto declarado","Gastos registrados","Restante","Utilización"].map((h) => (
                    <th key={h} scope="col" className="text-left px-4 py-2.5 text-xs font-semibold text-zinc-500 uppercase tracking-wide border-b border-zinc-200">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-3 font-semibold text-zinc-900">{fmt(project.budget)}</td>
                  <td className="px-4 py-3 text-zinc-700">{fmt(project.spent)}</td>
                  <td className="px-4 py-3 text-zinc-700">{fmt(expenseTotal)}</td>
                  <td className="px-4 py-3 font-medium text-emerald-700">{fmt(project.budget - project.spent)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-zinc-100 rounded-full h-1.5">
                        <div className="bg-zinc-700 h-1.5 rounded-full" style={{ width: `${Math.min(100, budgetPct)}%` }} />
                      </div>
                      <span className="text-xs font-medium">{budgetPct.toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Team */}
          {team.length > 0 && (
            <section className="mb-10 print:break-inside-avoid">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Equipo del Proyecto</h2>
              <table className="w-full text-sm border border-zinc-200 rounded-lg overflow-hidden">
                <thead className="bg-zinc-50"><tr>
                  {["Nombre","Rol","Contacto"].map((h) => (
                    <th key={h} scope="col" className="text-left px-4 py-2.5 text-xs font-semibold text-zinc-500 uppercase tracking-wide border-b border-zinc-200">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {team.map((m, i) => (
                    <tr key={m.id} className={i % 2 === 0 ? "bg-white" : "bg-zinc-50/50"}>
                      <td className="px-4 py-2.5 font-medium text-zinc-900">{m.name}</td>
                      <td className="px-4 py-2.5 text-zinc-600">{m.role}</td>
                      <td className="px-4 py-2.5 text-zinc-500">{m.email ?? m.phone ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {/* Milestones */}
          {milestones.length > 0 && (
            <section className="mb-10 print:break-inside-avoid">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Hitos y Cronograma</h2>
              <table className="w-full text-sm border border-zinc-200 rounded-lg overflow-hidden">
                <thead className="bg-zinc-50"><tr>
                  {["Hito","Fecha límite","Estado"].map((h) => (
                    <th key={h} scope="col" className="text-left px-4 py-2.5 text-xs font-semibold text-zinc-500 uppercase tracking-wide border-b border-zinc-200">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {milestones.map((m, i) => (
                    <tr key={m.id} className={i % 2 === 0 ? "bg-white" : "bg-zinc-50/50"}>
                      <td className="px-4 py-2.5 text-zinc-800">{m.title}</td>
                      <td className="px-4 py-2.5 text-zinc-500">{formatDate(m.dueDate)}</td>
                      <td className="px-4 py-2.5">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m.completed ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>
                          {m.completed ? "Completado" : "Pendiente"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {/* Expenses */}
          {expenses.length > 0 && (
            <section className="mb-10 print:break-inside-avoid">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Gastos Registrados</h2>
              <table className="w-full text-sm border border-zinc-200 rounded-lg overflow-hidden">
                <thead className="bg-zinc-50"><tr>
                  {["Descripción","Categoría","Fecha","Importe"].map((h) => (
                    <th key={h} scope="col" className="text-left px-4 py-2.5 text-xs font-semibold text-zinc-500 uppercase tracking-wide border-b border-zinc-200">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {expenses.map((e, i) => (
                    <tr key={e.id} className={i % 2 === 0 ? "bg-white" : "bg-zinc-50/50"}>
                      <td className="px-4 py-2.5 text-zinc-800">{e.description}</td>
                      <td className="px-4 py-2.5 text-zinc-500">{CATEGORIES[e.category] ?? e.category}</td>
                      <td className="px-4 py-2.5 text-zinc-500">{new Date(e.date).toLocaleDateString("es-ES")}</td>
                      <td className="px-4 py-2.5 font-medium tabular-nums text-zinc-900">{fmt(e.amount)}</td>
                    </tr>
                  ))}
                  <tr className="bg-zinc-50 border-t border-zinc-200">
                    <td colSpan={3} className="px-4 py-2.5 font-semibold text-zinc-700">Total</td>
                    <td className="px-4 py-2.5 font-bold tabular-nums text-zinc-900">{fmt(expenseTotal)}</td>
                  </tr>
                </tbody>
              </table>
            </section>
          )}

          {/* Documents */}
          {files.length > 0 && (
            <section className="mb-10 print:break-inside-avoid">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Documentos</h2>
              <ul className="space-y-1">
                {files.map((d) => (
                  <li key={d.id} className="flex items-center gap-2 text-sm text-zinc-600 py-1 border-b border-zinc-100">
                    <svg aria-hidden="true" className="w-4 h-4 text-zinc-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="flex-1">{d.name}</span>
                    <span className="text-zinc-400 text-xs">{new Date(d.uploadedAt).toLocaleDateString("es-ES")}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Activity */}
          {activity.length > 0 && (
            <section className="mb-10 print:break-inside-avoid">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Actividad Reciente</h2>
              <ul className="space-y-2">
                {activity.slice(0, 10).map((a) => (
                  <li key={a.id} className="flex items-start gap-3 text-sm border-b border-zinc-50 pb-2">
                    <span className="text-zinc-300 flex-shrink-0 mt-0.5">◦</span>
                    <span className="flex-1 text-zinc-700">{a.description}</span>
                    <span className="text-xs text-zinc-400 flex-shrink-0">{new Date(a.createdAt).toLocaleDateString("es-ES")}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Footer */}
          <footer className="pt-6 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-400">
            <span>Generado por <strong className="text-zinc-600">ArchFlow</strong></span>
            <span>{project.code} · {generatedAt}</span>
          </footer>
        </div>
      </article>
    </>
  );
}
