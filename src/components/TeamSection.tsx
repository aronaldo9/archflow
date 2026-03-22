"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Member {
  id: string;
  name: string;
  role: string;
  email: string | null;
  phone: string | null;
}

interface Props {
  projectId: string;
  members: Member[];
}

const ROLES = [
  "Arquitecto Director",
  "Arquitecto Técnico",
  "Aparejador",
  "Ingeniero de Estructuras",
  "Ingeniero de Instalaciones",
  "Delineante",
  "Jefe de Obra",
  "Responsable de Calidad",
  "Subcontratista",
  "Coordinador de Seguridad",
  "Otro",
];

const ROLE_COLORS: Record<string, string> = {
  "Arquitecto Director":        "bg-blue-600",
  "Arquitecto Técnico":         "bg-sky-600",
  "Aparejador":                 "bg-amber-600",
  "Ingeniero de Estructuras":   "bg-violet-600",
  "Ingeniero de Instalaciones": "bg-purple-600",
  "Delineante":                 "bg-teal-600",
  "Jefe de Obra":               "bg-orange-600",
  "Responsable de Calidad":     "bg-emerald-600",
  "Subcontratista":             "bg-rose-600",
  "Coordinador de Seguridad":   "bg-red-600",
  "Otro":                       "bg-zinc-600",
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function TeamSection({ projectId, members }: Props) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", role: ROLES[0], email: "", phone: "" });

  const handleAdd = async () => {
    if (!form.name.trim()) return;
    setLoading(true);
    try {
      await fetch(`/api/projects/${projectId}/team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name.trim(), role: form.role, email: form.email || undefined, phone: form.phone || undefined }),
      });
      setForm({ name: "", role: ROLES[0], email: "", phone: "" });
      setAdding(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este miembro?")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/projects/${projectId}/team/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  };

  const inputCls =
    "bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors";

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Equipo</h3>
        <button
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-1.5 text-xs bg-zinc-700 hover:bg-zinc-600 text-white px-2.5 py-1.5 rounded-lg transition-colors"
        >
          <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Añadir
        </button>
      </div>

      {members.length === 0 && !adding && (
        <p className="text-zinc-500 text-sm text-center py-4">Sin miembros asignados</p>
      )}

      <div className="space-y-2">
        {members.map((m) => (
          <div key={m.id} className="flex items-center gap-3 group">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0 ${ROLE_COLORS[m.role] ?? "bg-zinc-600"}`}>
              {initials(m.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{m.name}</p>
              <p className="text-xs text-zinc-400 truncate">{m.role}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {m.email && (
                <a href={`mailto:${m.email}`} className="text-zinc-400 hover:text-white p-1 rounded transition-colors" aria-label={`Enviar email a ${m.name}`}>
                  <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              )}
              <button
                onClick={() => handleDelete(m.id)}
                disabled={deletingId === m.id}
                aria-label={`Eliminar miembro ${m.name}`}
                className="text-zinc-500 hover:text-red-400 p-1 rounded transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-30"
              >
                <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {adding && (
        <div className="mt-3 p-3 bg-zinc-800/60 rounded-lg border border-zinc-700/50 space-y-2">
          <p className="text-xs text-zinc-400 uppercase tracking-wide">Nuevo Miembro</p>
          <label htmlFor="member-name" className="sr-only">Nombre</label>
          <input id="member-name" placeholder="Nombre *" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={`w-full ${inputCls}`} />
          <label htmlFor="member-role" className="sr-only">Rol</label>
          <select id="member-role" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} className={`w-full ${inputCls}`}>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <label htmlFor="member-email" className="sr-only">Email</label>
            <input id="member-email" placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={inputCls} />
            <label htmlFor="member-phone" className="sr-only">Teléfono</label>
            <input id="member-phone" placeholder="Teléfono" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className={inputCls} />
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={handleAdd} disabled={loading || !form.name.trim()} className="text-sm bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-medium px-3 py-1.5 rounded-lg transition-colors">
              {loading ? "Añadiendo..." : "Añadir"}
            </button>
            <button onClick={() => setAdding(false)} className="text-sm bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1.5 rounded-lg transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
