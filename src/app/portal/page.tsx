import { getSession } from "@/lib/auth";
import { getProjectById, getDocumentsByProject } from "@/lib/data";
import { formatCurrency, formatDate, statusConfig, getPhaseLabel } from "@/lib/utils";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import PortalGallery from "@/components/PortalGallery";

export const dynamic = "force-dynamic";

// ── Logo (inline, sin importar el componente del app layout) ──────────────────
function Logo() {
  return (
    <svg width="160" height="40" viewBox="0 0 192 48" fill="none" aria-label="ArchFlow">
      <defs>
        <linearGradient id="pt-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="pt-blue" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
      </defs>
      <path d="M8 38 L8 22 Q8 10 18 10 Q28 10 28 22 L28 38" stroke="url(#pt-gold)" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M20 38 L20 18 Q20 4 32 4 Q44 4 44 18 L44 38" stroke="url(#pt-gold)" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M4 42 Q10 38 16 42 Q22 46 28 42 Q34 38 40 42 Q46 46 52 42" stroke="url(#pt-blue)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M4 46 Q10 42 16 46 Q22 50 28 46 Q34 42 40 46 Q46 50 52 46" stroke="url(#pt-blue)" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
      <text x="60" y="30" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="22" fill="white">Arch</text>
      <text x="101" y="30" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="22" fill="#38bdf8">Flow</text>
      <text x="60" y="44" fontFamily="system-ui, sans-serif" fontWeight="400" fontSize="9" fill="#71717a" letterSpacing="2">ARQUITECTURA</text>
    </svg>
  );
}

const IMAGE_REGEX = /\.(svg|jpg|jpeg|png|gif|webp)$/i;

export default async function PortalPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // Si no tiene proyecto asignado, mostrar pantalla genérica
  if (!session.projectId) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <Logo />
          <p className="text-zinc-400 mt-8 mb-2">Bienvenido, <span className="text-white">{session.name}</span></p>
          <p className="text-zinc-600 text-sm">No tienes ningún proyecto asignado en este momento.</p>
          <div className="mt-8"><LogoutButton /></div>
        </div>
      </div>
    );
  }

  const [project, documents] = await Promise.all([
    getProjectById(session.projectId),
    getDocumentsByProject(session.projectId),
  ]);

  if (!project) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-zinc-400">Proyecto no encontrado.</p>
          <div className="mt-6"><LogoutButton /></div>
        </div>
      </div>
    );
  }

  const images = documents.filter((d) => IMAGE_REGEX.test(d.name));
  const docs = documents.filter((d) => !IMAGE_REGEX.test(d.name));

  const st = statusConfig[project.status as keyof typeof statusConfig];
  const completedMilestones = project.milestones.filter((m) => m.completed).length;
  const totalMilestones = project.milestones.length;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <span className="text-zinc-500 text-sm hidden sm:block">{session.name}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-10">

        {/* ── Intro ── */}
        <div>
          <p className="text-zinc-500 text-sm mb-1">Portal del cliente</p>
          <h1 className="text-2xl font-bold text-white">{project.name}</h1>
          <p className="text-zinc-500 text-sm mt-1">{project.location} · Ref. {project.code}</p>
        </div>

        {/* ── Estado general ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Estado */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <p className="text-zinc-500 text-xs mb-2">Estado</p>
            <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${st.color}`}>
              <span className={`w-2 h-2 rounded-full ${st.dot}`} />
              {st.label}
            </span>
          </div>

          {/* Fase */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <p className="text-zinc-500 text-xs mb-2">Fase actual</p>
            <p className="text-white text-sm font-medium leading-tight">{getPhaseLabel(project.phase)}</p>
          </div>

          {/* Fechas */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <p className="text-zinc-500 text-xs mb-2">Fecha de entrega</p>
            <p className="text-white text-sm font-medium">{formatDate(project.endDate)}</p>
          </div>

          {/* Presupuesto */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <p className="text-zinc-500 text-xs mb-2">Presupuesto</p>
            <p className="text-white text-sm font-medium">{formatCurrency(project.budget)}</p>
          </div>
        </div>

        {/* ── Progreso ── */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white">Avance del proyecto</h2>
            <span className="text-2xl font-bold text-amber-400">{project.progress}%</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          {totalMilestones > 0 && (
            <p className="text-zinc-500 text-sm mt-3">
              {completedMilestones} de {totalMilestones} hitos completados
            </p>
          )}
        </div>

        {/* ── Descripción ── */}
        {project.description && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-3">Descripción del proyecto</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">{project.description}</p>
          </div>
        )}

        {/* ── Hitos ── */}
        {project.milestones.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-5">Hitos</h2>
            <div className="space-y-3">
              {project.milestones.map((m) => (
                <div key={m.id} className="flex items-start gap-3">
                  {/* Icono */}
                  <div className={`mt-0.5 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center border ${
                    m.completed
                      ? "bg-emerald-500/20 border-emerald-500/40"
                      : "bg-zinc-800 border-zinc-700"
                  }`}>
                    {m.completed ? (
                      <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                    )}
                  </div>
                  {/* Texto */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${m.completed ? "text-zinc-300" : "text-white"}`}>
                      {m.title}
                    </p>
                    <p className="text-zinc-600 text-xs mt-0.5">{formatDate(m.dueDate)}</p>
                  </div>
                  {/* Badge */}
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                    m.completed
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-zinc-800 text-zinc-500"
                  }`}>
                    {m.completed ? "Completado" : "Pendiente"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Galería ── */}
        <PortalGallery images={images} />

        {/* ── Documentos ── */}
        {docs.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-4">Documentación</h2>
            <div className="space-y-2">
              {docs.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-800 transition-colors group"
                >
                  <div className="w-9 h-9 bg-zinc-800 group-hover:bg-zinc-700 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                    <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{doc.name}</p>
                    <p className="text-xs text-zinc-600">{formatDate(doc.uploadedAt)}</p>
                  </div>
                  <svg className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── Contacto ── */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 text-center">
          <p className="text-zinc-500 text-sm">¿Tienes alguna pregunta sobre tu proyecto?</p>
          <a
            href="mailto:hola@archflow.es"
            className="inline-block mt-3 text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
          >
            hola@archflow.es
          </a>
        </div>

      </main>
    </div>
  );
}
