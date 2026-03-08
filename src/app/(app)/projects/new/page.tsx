"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const phases = [
  { value: "concept", label: "Concepto" },
  { value: "schematic", label: "Diseño Esquemático" },
  { value: "design_development", label: "Desarrollo de Diseño" },
  { value: "construction_docs", label: "Documentos de Construcción" },
  { value: "construction", label: "Construcción" },
  { value: "post_construction", label: "Post-Construcción" },
];

const statuses = [
  { value: "planning", label: "Planificación" },
  { value: "in_progress", label: "En Progreso" },
  { value: "review", label: "Revisión" },
  { value: "on_hold", label: "En Pausa" },
];

export default function NewProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
    status: "planning",
    phase: "concept",
    type: "administrative",
    location: "",
    startDate: "",
    endDate: "",
    budget: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    tags: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          budget: Number(form.budget) || 0,
        }),
      });
      if (!res.ok) throw new Error("Failed to create project");
      router.push("/projects");
      router.refresh();
    } catch {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl">
      {/* Volver */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white text-sm mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a Proyectos
      </Link>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Identificación del proyecto */}
        <Section title="Identificación del Proyecto" description="Información básica para identificar este proyecto.">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nombre del Proyecto" required className="col-span-2">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="ej. Centro Cultural Albolote"
                required
                className={inputCls}
              />
            </Field>
            <Field label="Código de Proyecto" required>
              <input
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="ej. CCA-2025"
                required
                className={inputCls}
              />
            </Field>
            <Field label="Ubicación" required>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="ej. Granada, España"
                required
                className={inputCls}
              />
            </Field>
            <Field label="Descripción" className="col-span-2">
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Breve descripción del proyecto..."
                rows={3}
                className={`${inputCls} resize-none`}
              />
            </Field>
            <Field label="Etiquetas">
              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="ej. Cultural, Público, LEED (separadas por coma)"
                className={inputCls}
              />
            </Field>
          </div>
        </Section>

        {/* Estado y Fase */}
        <Section title="Estado y Fase" description="Tipo, estado actual y fase de diseño del proyecto.">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tipo de Proyecto" className="col-span-2">
              <div className="flex gap-3">
                {[
                  { value: "administrative", label: "Administrativo", desc: "Institucional, público o comercial" },
                  { value: "personal", label: "Personal", desc: "Encargo privado o residencial" },
                ].map((t) => (
                  <label
                    key={t.value}
                    className={`flex-1 flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      form.type === t.value
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-zinc-700 hover:border-zinc-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={t.value}
                      checked={form.type === t.value}
                      onChange={handleChange}
                      className="mt-0.5 accent-amber-500"
                    />
                    <div>
                      <p className="text-white text-sm font-medium">{t.label}</p>
                      <p className="text-zinc-500 text-xs">{t.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </Field>
            <Field label="Estado">
              <select name="status" value={form.status} onChange={handleChange} className={selectCls}>
                {statuses.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Fase">
              <select name="phase" value={form.phase} onChange={handleChange} className={selectCls}>
                {phases.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </Field>
          </div>
        </Section>

        {/* Calendario y Presupuesto */}
        <Section title="Calendario y Presupuesto" description="Cronograma del proyecto y asignación económica.">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Fecha de Inicio" required>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
                className={inputCls}
              />
            </Field>
            <Field label="Fecha de Fin" required>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                required
                className={inputCls}
              />
            </Field>
            <Field label="Presupuesto (EUR)" required className="col-span-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">€</span>
                <input
                  type="number"
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  required
                  className={`${inputCls} pl-7`}
                />
              </div>
            </Field>
          </div>
        </Section>

        {/* Información del Cliente */}
        <Section title="Información del Cliente" description="Contacto principal de este proyecto.">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nombre del Cliente" required className="col-span-2">
              <input
                name="clientName"
                value={form.clientName}
                onChange={handleChange}
                placeholder="ej. Ayuntamiento de Granada"
                required
                className={inputCls}
              />
            </Field>
            <Field label="Correo Electrónico">
              <input
                type="email"
                name="clientEmail"
                value={form.clientEmail}
                onChange={handleChange}
                placeholder="cliente@ejemplo.es"
                className={inputCls}
              />
            </Field>
            <Field label="Teléfono">
              <input
                type="tel"
                name="clientPhone"
                value={form.clientPhone}
                onChange={handleChange}
                placeholder="+34 958 000 000"
                className={inputCls}
              />
            </Field>
          </div>
        </Section>

        {/* Acciones */}
        <div className="flex items-center gap-3 pt-2 border-t border-zinc-700/50">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-zinc-100 hover:bg-white disabled:opacity-60 text-zinc-900 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" />
                Creando...
              </>
            ) : (
              "Crear Proyecto"
            )}
          </button>
          <Link
            href="/projects"
            className="text-zinc-400 hover:text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}

const inputCls =
  "w-full bg-zinc-800/80 border border-zinc-700 text-white text-sm rounded-lg px-3 py-2.5 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 transition-colors";

const selectCls =
  "w-full bg-zinc-800/80 border border-zinc-700 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 transition-colors";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-6">
      <div className="mb-5">
        <h3 className="text-white font-medium">{title}</h3>
        <p className="text-zinc-400 text-sm mt-0.5">{description}</p>
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="block text-zinc-300 text-sm font-medium mb-1.5">
        {label}
        {required && <span className="text-zinc-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
