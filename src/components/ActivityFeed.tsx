"use client";

interface Activity {
  id: string;
  type: string;
  description: string;
  createdAt: string;
}

interface Props {
  activities: Activity[];
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)   return "Ahora mismo";
  if (m < 60)  return `Hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `Hace ${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7)   return `Hace ${d}d`;
  return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

const TYPE_CONFIG: Record<string, { color: string; icon: React.ReactNode }> = {
  project_updated:    { color: "bg-zinc-500/20 text-zinc-400",    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /> },
  milestone_added:    { color: "bg-blue-500/20 text-blue-400",    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H11.5l-1-1H5a2 2 0 00-2 2zm0 0h2" /> },
  milestone_completed:{ color: "bg-emerald-500/20 text-emerald-400", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> },
  milestone_updated:  { color: "bg-zinc-500/20 text-zinc-400",    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /> },
  milestone_deleted:  { color: "bg-red-500/20 text-red-400",      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> },
  document_uploaded:  { color: "bg-blue-500/20 text-blue-400",    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /> },
  image_uploaded:     { color: "bg-sky-500/20 text-sky-400",      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
  document_deleted:   { color: "bg-red-500/20 text-red-400",      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> },
  expense_added:      { color: "bg-amber-500/20 text-amber-400",  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
  expense_deleted:    { color: "bg-red-500/20 text-red-400",      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> },
  team_member_added:  { color: "bg-violet-500/20 text-violet-400",icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /> },
  team_member_removed:{ color: "bg-red-500/20 text-red-400",      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" /> },
};

const DEFAULT_CONFIG = { color: "bg-zinc-500/20 text-zinc-400", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> };

export default function ActivityFeed({ activities }: Props) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-6">
        <svg className="w-8 h-8 text-zinc-700 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-zinc-500 text-sm">Sin actividad registrada</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {activities.map((a) => {
        const cfg = TYPE_CONFIG[a.type] ?? DEFAULT_CONFIG;
        return (
          <li key={a.id} className="flex items-start gap-3">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.color}`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {cfg.icon}
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-zinc-300 leading-snug">{a.description}</p>
              <time className="text-xs text-zinc-600 mt-0.5 block">{timeAgo(a.createdAt)}</time>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
