import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getProjectById,
  getDocumentsByProject,
  getExpensesByProject,
  getActivityByProject,
  getTeamByProject,
} from "@/lib/data";
import { formatCurrency, formatDate, getPhaseLabel } from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";
import ProgressBar from "@/components/ProgressBar";
import ProjectTimeline from "@/components/ProjectTimeline";
import EditProjectModal from "@/components/EditProjectModal";
import MilestoneManager from "@/components/MilestoneManager";
import DocumentsSection from "@/components/DocumentsSection";
import ProjectGallery from "@/components/ProjectGallery";
import ExpenseManager from "@/components/ExpenseManager";
import ActivityFeed from "@/components/ActivityFeed";
import TeamSection from "@/components/TeamSection";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [project, rawDocuments, expenses, activity, team] = await Promise.all([
    getProjectById(params.id),
    getDocumentsByProject(params.id),
    getExpensesByProject(params.id),
    getActivityByProject(params.id, 20),
    getTeamByProject(params.id),
  ]);
  if (!project) notFound();

  const budgetPct = project.budget > 0 ? (project.spent / project.budget) * 100 : 0;
  const milestones = project.milestones ?? [];
  const completedMilestones = milestones.filter((m) => m.completed).length;
  const tags = project.tags
    ? project.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  // Serialize dates so they can be passed to Client Components
  const editData = {
    id: project.id,
    name: project.name,
    description: project.description,
    location: project.location,
    budget: project.budget,
    startDate: new Date(project.startDate).toISOString(),
    endDate: new Date(project.endDate).toISOString(),
    clientName: project.clientName,
    status: project.status,
    phase: project.phase,
    type: project.type,
  };

  const serializedMilestones = milestones.map((m) => ({
    ...m,
    dueDate: new Date(m.dueDate).toISOString(),
  }));

  const IMAGE_EXT = /\.(svg|jpg|jpeg|png|gif|webp)$/i;
  const serializedDocuments = rawDocuments
    .filter((d) => !IMAGE_EXT.test(d.name))
    .map((d) => ({ ...d, uploadedAt: new Date(d.uploadedAt).toISOString() }));
  const serializedImages = rawDocuments
    .filter((d) => IMAGE_EXT.test(d.name))
    .map((d) => ({ ...d, uploadedAt: new Date(d.uploadedAt).toISOString() }));

  const serializedExpenses = expenses.map((e) => ({
    ...e,
    date: new Date(e.date).toISOString(),
    createdAt: new Date(e.createdAt).toISOString(),
  }));

  const serializedActivity = activity.map((a) => ({
    ...a,
    createdAt: new Date(a.createdAt).toISOString(),
  }));

  const serializedTeam = team.map((m) => ({
    ...m,
    createdAt: new Date(m.createdAt).toISOString(),
  }));

  return (
    <div className="max-w-6xl space-y-6">
      {/* Volver */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white text-sm transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Todos los Proyectos
      </Link>

      {/* Cabecera */}
      <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
                  {project.code}
                </span>
                <StatusBadge status={project.status} />
                <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
                  {getPhaseLabel(project.phase)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/report/${project.id}`}
                  target="_blank"
                  className="flex items-center gap-2 text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Exportar Informe
                </Link>
                <EditProjectModal project={editData} />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">{project.name}</h2>
            {project.description && (
              <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl">{project.description}</p>
            )}
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-zinc-400">
              {project.location && (
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {project.location}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(project.startDate)} — {formatDate(project.endDate)}
              </span>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {tags.map((tag) => (
                  <span key={tag} className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Progreso general */}
          <div className="lg:w-64 space-y-4">
            <div className="bg-zinc-900/60 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-zinc-400 text-sm">Progreso General</span>
                <span className="text-white text-xl font-semibold">{project.progress}%</span>
              </div>
              <ProgressBar value={project.progress} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-900/60 rounded-xl p-3 text-center">
                <p className="text-white text-lg font-semibold">{completedMilestones}</p>
                <p className="text-zinc-500 text-xs mt-0.5">de {milestones.length} hitos</p>
              </div>
              <div className="bg-zinc-900/60 rounded-xl p-3 text-center">
                <p className="text-white text-lg font-semibold">{formatCurrency(project.budget - project.spent)}</p>
                <p className="text-zinc-500 text-xs mt-0.5">restante</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cronograma */}
      {milestones.length > 0 && (
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-6 pt-5 pb-4">
          <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-3">Cronograma</h3>
          <ProjectTimeline
            startDate={project.startDate}
            endDate={project.endDate}
            milestones={milestones}
          />
        </div>
      )}

      {/* Galería de imágenes */}
      <ProjectGallery projectId={project.id} images={serializedImages} />

      {/* Cuadrícula principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda */}
        <div className="lg:col-span-2 space-y-6">
          {/* Presupuesto */}
          <Card title="Presupuesto">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <Metric label="Presupuesto Total" value={formatCurrency(project.budget)} />
              <Metric label="Gastado" value={formatCurrency(project.spent)} />
              <Metric
                label="Restante"
                value={formatCurrency(project.budget - project.spent)}
                valueClass="text-emerald-400"
              />
            </div>
            <ProgressBar value={budgetPct} />
            <p className="text-zinc-500 text-xs mt-2">
              {budgetPct.toFixed(1)}% del presupuesto utilizado
            </p>
          </Card>

          {/* Gastos */}
          <ExpenseManager projectId={project.id} expenses={serializedExpenses} />

          {/* Hitos — interactive */}
          <Card title="">
            <MilestoneManager projectId={project.id} milestones={serializedMilestones} />
          </Card>

          {/* Documentos */}
          <DocumentsSection projectId={project.id} documents={serializedDocuments} />
        </div>

        {/* Columna derecha */}
        <div className="space-y-6">
          {/* Cliente */}
          <Card title="Cliente">
            <div className="space-y-3">
              <p className="text-white font-medium">{project.clientName}</p>
              <div className="space-y-2">
                {project.clientEmail && (
                  <a
                    href={`mailto:${project.clientEmail}`}
                    className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm transition-colors"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {project.clientEmail}
                  </a>
                )}
                {project.clientPhone && (
                  <div className="flex items-center gap-2 text-zinc-400 text-sm">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {project.clientPhone}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Detalles */}
          <Card title="Detalles">
            <dl className="space-y-3 text-sm">
              <Row label="Creado" value={formatDate(project.createdAt)} />
              <Row label="Última actualización" value={formatDate(project.updatedAt)} />
              <Row label="Fase" value={getPhaseLabel(project.phase)} />
              <Row label="ID del Proyecto" value={<span className="font-mono text-xs">{project.id}</span>} />
            </dl>
          </Card>

          {/* Equipo */}
          <TeamSection projectId={project.id} members={serializedTeam} />

          {/* Actividad */}
          <ActivityFeed activities={serializedActivity} />
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-5">
      {title && (
        <h3 className="text-white font-medium mb-4 text-sm uppercase tracking-wider text-zinc-400">{title}</h3>
      )}
      {children}
    </div>
  );
}

function Metric({
  label,
  value,
  valueClass = "text-white",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div>
      <p className="text-zinc-500 text-xs mb-1">{label}</p>
      <p className={`text-lg font-semibold ${valueClass}`}>{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-zinc-500 flex-shrink-0">{label}</dt>
      <dd className="text-zinc-300 text-right">{value}</dd>
    </div>
  );
}
