"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

const CATEGORIES: Record<string, string> = {
  materials:      "Materiales",
  labor:          "Mano de obra",
  equipment:      "Equipamiento",
  permits:        "Licencias y permisos",
  subcontracting: "Subcontratación",
  other:          "Otros",
};

const CAT_COLORS: Record<string, string> = {
  materials:      "bg-blue-500/15 text-blue-400",
  labor:          "bg-amber-500/15 text-amber-400",
  equipment:      "bg-violet-500/15 text-violet-400",
  permits:        "bg-red-500/15 text-red-400",
  subcontracting: "bg-emerald-500/15 text-emerald-400",
  other:          "bg-zinc-500/15 text-zinc-400",
};

interface Props {
  projectId: string;
  expenses: Expense[];
}

const fmt = (n: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });

export default function ExpenseManager({ projectId, expenses }: Props) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ description: "", amount: "", category: "materials", date: "" });

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  const handleAdd = async () => {
    if (!form.description.trim() || !form.amount || !form.date) return;
    setLoading(true);
    try {
      await fetch(`/api/projects/${projectId}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount: Number(form.amount) }),
      });
      setForm({ description: "", amount: "", category: "materials", date: "" });
      setAdding(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este gasto?")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/projects/${projectId}/expenses/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  };

  const inputCls =
    "bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors";

  return (
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Gastos Registrados</h3>
        <button
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-1.5 text-xs bg-zinc-700 hover:bg-zinc-600 text-white px-2.5 py-1.5 rounded-lg transition-colors"
        >
          <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Añadir Gasto
        </button>
      </div>

      {expenses.length === 0 && !adding ? (
        <p className="text-zinc-500 text-sm text-center py-6">No hay gastos registrados</p>
      ) : (
        <div className="space-y-2">
          {expenses.map((e) => (
            <div
              key={e.id}
              className="flex items-center gap-3 p-2.5 rounded-lg bg-zinc-900/50 hover:bg-zinc-900/80 transition-colors group"
            >
              <span className={`text-xs px-2 py-0.5 rounded font-medium flex-shrink-0 ${CAT_COLORS[e.category] ?? CAT_COLORS.other}`}>
                {CATEGORIES[e.category] ?? e.category}
              </span>
              <p className="flex-1 text-sm text-white truncate min-w-0">{e.description}</p>
              <span className="text-xs text-zinc-400 flex-shrink-0">{fmtDate(e.date)}</span>
              <span className="text-sm font-semibold text-white tabular-nums flex-shrink-0">{fmt(e.amount)}</span>
              <button
                onClick={() => handleDelete(e.id)}
                disabled={deletingId === e.id}
                aria-label={`Eliminar gasto: ${e.description}`}
                className="text-zinc-500 hover:text-red-400 p-1 rounded transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0 disabled:opacity-30"
              >
                <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}

          {/* Total */}
          {expenses.length > 0 && (
            <div className="flex items-center justify-between pt-3 mt-1 border-t border-zinc-700/50">
              <span className="text-zinc-300 text-sm font-medium">Total registrado</span>
              <span className="text-white font-semibold text-base tabular-nums">{fmt(total)}</span>
            </div>
          )}
        </div>
      )}

      {adding && (
        <div className="mt-4 p-3 bg-zinc-800/60 rounded-lg border border-zinc-700/50 space-y-3">
          <p className="text-xs text-zinc-400 uppercase tracking-wide">Nuevo Gasto</p>
          <div className="grid grid-cols-2 gap-2">
            <label htmlFor="expense-description" className="sr-only">Descripción</label>
            <input
              id="expense-description"
              placeholder="Descripción *"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className={`col-span-2 ${inputCls}`}
            />
            <label htmlFor="expense-amount" className="sr-only">Importe en euros</label>
            <input
              id="expense-amount"
              type="number"
              placeholder="Importe (€) *"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              min={0}
              className={inputCls}
            />
            <label htmlFor="expense-date" className="sr-only">Fecha</label>
            <input
              id="expense-date"
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className={inputCls}
            />
            <label htmlFor="expense-category" className="sr-only">Categoría</label>
            <select
              id="expense-category"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className={`col-span-2 ${inputCls}`}
            >
              {Object.entries(CATEGORIES).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={loading || !form.description.trim() || !form.amount || !form.date}
              className="text-sm bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-medium px-3 py-1.5 rounded-lg transition-colors"
            >
              {loading ? "Añadiendo..." : "Añadir"}
            </button>
            <button
              onClick={() => { setAdding(false); setForm({ description: "", amount: "", category: "materials", date: "" }); }}
              className="text-sm bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
