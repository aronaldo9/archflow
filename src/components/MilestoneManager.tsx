"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";

interface MilestoneItem {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
  projectId: string;
}

interface Props {
  projectId: string;
  milestones: MilestoneItem[];
}

export default function MilestoneManager({ projectId, milestones }: Props) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  const toDateInput = (iso: string) => iso.split("T")[0];

  const startEdit = (m: MilestoneItem) => {
    setEditingId(m.id);
    setEditTitle(m.title);
    setEditDate(toDateInput(m.dueDate));
  };

  const refresh = () => router.refresh();

  const handleAdd = async () => {
    if (!newTitle.trim() || !newDate) return;
    setLoading("add");
    try {
      await fetch(`/api/projects/${projectId}/milestones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle.trim(), dueDate: newDate }),
      });
      setNewTitle("");
      setNewDate("");
      setAdding(false);
      refresh();
    } finally {
      setLoading(null);
    }
  };

  const handleEdit = async (id: string) => {
    setLoading(id);
    try {
      await fetch(`/api/projects/${projectId}/milestones/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, dueDate: editDate }),
      });
      setEditingId(null);
      refresh();
    } finally {
      setLoading(null);
    }
  };

  const handleToggle = async (m: MilestoneItem) => {
    setLoading(m.id);
    try {
      await fetch(`/api/projects/${projectId}/milestones/${m.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !m.completed }),
      });
      refresh();
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este hito?")) return;
    setLoading(id);
    try {
      await fetch(`/api/projects/${projectId}/milestones/${id}`, { method: "DELETE" });
      refresh();
    } finally {
      setLoading(null);
    }
  };

  const inputCls =
    "bg-zinc-800 border border-zinc-600 rounded px-2 py-1.5 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors";

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Hitos</h3>
        <button
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-1.5 text-xs bg-zinc-700 hover:bg-zinc-600 text-white px-2.5 py-1.5 rounded-lg transition-colors"
        >
          <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Añadir Hito
        </button>
      </div>

      <ul className="space-y-3">
        {milestones.map((m) => (
          <li key={m.id}>
            {editingId === m.id ? (
              <div className="flex items-center gap-2 flex-wrap">
                <label htmlFor={`edit-title-${m.id}`} className="sr-only">Nombre del hito</label>
                <input
                  id={`edit-title-${m.id}`}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className={`flex-1 min-w-0 ${inputCls}`}
                />
                <label htmlFor={`edit-date-${m.id}`} className="sr-only">Fecha límite</label>
                <input
                  id={`edit-date-${m.id}`}
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className={inputCls}
                />
                <button
                  onClick={() => handleEdit(m.id)}
                  disabled={loading === m.id}
                  className="text-emerald-400 hover:text-emerald-300 text-xs px-2 py-1.5 bg-emerald-500/10 rounded-lg transition-colors disabled:opacity-50"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-zinc-400 hover:text-white text-xs px-2 py-1.5 bg-zinc-700 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 group">
                <button
                  onClick={() => handleToggle(m)}
                  disabled={loading === m.id}
                  aria-label={m.completed ? `Marcar "${m.title}" como pendiente` : `Marcar "${m.title}" como completado`}
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-colors disabled:opacity-50 ${
                    m.completed
                      ? "bg-emerald-500/20 border-emerald-500 hover:bg-emerald-500/30"
                      : "border-zinc-600 hover:border-emerald-500 bg-transparent"
                  }`}
                >
                  {m.completed && (
                    <svg aria-hidden="true" className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${m.completed ? "text-zinc-400 line-through" : "text-white"}`}>
                    {m.title}
                  </p>
                </div>
                <span className={`text-xs flex-shrink-0 ${m.completed ? "text-zinc-500" : "text-zinc-400"}`}>
                  {formatDate(m.dueDate)}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEdit(m)}
                    aria-label="Editar hito"
                    className="text-zinc-400 hover:text-white p-1 rounded transition-colors"
                  >
                    <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    disabled={loading === m.id}
                    aria-label="Eliminar hito"
                    className="text-zinc-400 hover:text-red-400 p-1 rounded transition-colors disabled:opacity-50"
                  >
                    <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {adding && (
        <div className="mt-4 p-3 bg-zinc-800/60 rounded-lg border border-zinc-700/50">
          <p className="text-xs text-zinc-400 mb-2 uppercase tracking-wide">Nuevo Hito</p>
          <div className="flex gap-2 flex-wrap">
            <label htmlFor="new-milestone-title" className="sr-only">Nombre del hito</label>
            <input
              id="new-milestone-title"
              placeholder="Nombre del hito..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className={`flex-1 min-w-0 ${inputCls} placeholder:text-zinc-500`}
            />
            <label htmlFor="new-milestone-date" className="sr-only">Fecha límite</label>
            <input
              id="new-milestone-date"
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleAdd}
              disabled={loading === "add" || !newTitle.trim() || !newDate}
              className="text-sm bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-medium px-3 py-1.5 rounded-lg transition-colors"
            >
              {loading === "add" ? "Añadiendo..." : "Añadir"}
            </button>
            <button
              onClick={() => { setAdding(false); setNewTitle(""); setNewDate(""); }}
              className="text-sm bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {milestones.length === 0 && !adding && (
        <p className="text-zinc-500 text-sm text-center py-6">No hay hitos definidos</p>
      )}
    </div>
  );
}
