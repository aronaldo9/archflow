"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface ProjectData {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  budget: number;
  startDate: string;
  endDate: string;
  clientName: string;
  status: string;
  phase: string;
  type: string;
}

export default function EditProjectModal({ project }: { project: ProjectData }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const toDateInput = (iso: string) => iso.split("T")[0];

  const [form, setForm] = useState({
    name: project.name,
    description: project.description ?? "",
    location: project.location ?? "",
    budget: project.budget.toString(),
    startDate: toDateInput(project.startDate),
    endDate: toDateInput(project.endDate),
    clientName: project.clientName,
    status: project.status,
    phase: project.phase,
    type: project.type,
  });

  // Move focus to first input when modal opens; restore to trigger when it closes
  useEffect(() => {
    if (open) {
      firstInputRef.current?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }, [open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, budget: Number(form.budget) }),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
      router.refresh();
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
      }, 1200);
    } catch {
      setError("No se pudo guardar el proyecto.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors";

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-sm bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1.5 rounded-lg transition-colors"
      >
        <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        Editar Proyecto
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-modal-title"
            className="relative bg-zinc-900 border border-zinc-700/50 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-zinc-700/50">
              <h2 id="edit-modal-title" className="text-white font-semibold text-lg">
                Editar Proyecto
              </h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar modal"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label htmlFor="edit-name" className="block text-zinc-400 text-xs mb-1.5 uppercase tracking-wide">
                  Nombre del Proyecto *
                </label>
                <input
                  ref={firstInputRef}
                  id="edit-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className={inputCls}
                />
              </div>

              <div>
                <label htmlFor="edit-description" className="block text-zinc-400 text-xs mb-1.5 uppercase tracking-wide">
                  Descripción
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              </div>

              <div>
                <label htmlFor="edit-location" className="block text-zinc-400 text-xs mb-1.5 uppercase tracking-wide">
                  Ubicación
                </label>
                <input
                  id="edit-location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-startDate" className="block text-zinc-400 text-xs mb-1.5 uppercase tracking-wide">
                    Fecha Inicio *
                  </label>
                  <input
                    id="edit-startDate"
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    required
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="edit-endDate" className="block text-zinc-400 text-xs mb-1.5 uppercase tracking-wide">
                    Fecha Fin *
                  </label>
                  <input
                    id="edit-endDate"
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    required
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="edit-budget" className="block text-zinc-400 text-xs mb-1.5 uppercase tracking-wide">
                  Presupuesto (€)
                </label>
                <input
                  id="edit-budget"
                  type="number"
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  min={0}
                  className={inputCls}
                />
              </div>

              <div>
                <label htmlFor="edit-clientName" className="block text-zinc-400 text-xs mb-1.5 uppercase tracking-wide">
                  Cliente *
                </label>
                <input
                  id="edit-clientName"
                  name="clientName"
                  value={form.clientName}
                  onChange={handleChange}
                  required
                  className={inputCls}
                />
              </div>

              <fieldset>
                <legend className="block text-zinc-400 text-xs mb-1.5 uppercase tracking-wide">
                  Tipo de Proyecto
                </legend>
                <div className="flex gap-3">
                  {[
                    { value: "administrative", label: "Administrativo" },
                    { value: "personal", label: "Personal" },
                  ].map((t) => (
                    <label
                      key={t.value}
                      className={`flex-1 flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                        form.type === t.value
                          ? "border-amber-500 bg-amber-500/10 text-white"
                          : "border-zinc-700 text-zinc-400 hover:border-zinc-600"
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={t.value}
                        checked={form.type === t.value}
                        onChange={handleChange}
                        className="accent-amber-500"
                      />
                      <span className="text-sm font-medium">{t.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-status" className="block text-zinc-400 text-xs mb-1.5 uppercase tracking-wide">
                    Estado
                  </label>
                  <select id="edit-status" name="status" value={form.status} onChange={handleChange} className={inputCls}>
                    <option value="planning">Planificación</option>
                    <option value="in_progress">En progreso</option>
                    <option value="review">Revisión</option>
                    <option value="completed">Completado</option>
                    <option value="on_hold">En pausa</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="edit-phase" className="block text-zinc-400 text-xs mb-1.5 uppercase tracking-wide">
                    Fase
                  </label>
                  <select id="edit-phase" name="phase" value={form.phase} onChange={handleChange} className={inputCls}>
                    <option value="concept">Concepto</option>
                    <option value="schematic">Diseño Esquemático</option>
                    <option value="design_development">Desarrollo de Diseño</option>
                    <option value="construction_docs">Documentos de Construcción</option>
                    <option value="construction">Construcción</option>
                    <option value="post_construction">Post-Construcción</option>
                  </select>
                </div>
              </div>

              {error && <p role="alert" className="text-red-400 text-sm">{error}</p>}
              {success && <p role="status" className="text-emerald-400 text-sm">¡Proyecto actualizado correctamente!</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-medium text-sm py-2 rounded-lg transition-colors"
                >
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 bg-zinc-700 hover:bg-zinc-600 text-white text-sm py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
