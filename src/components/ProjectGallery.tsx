"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface ImageItem {
  id: string;
  name: string;
  fileUrl: string;
  uploadedAt: string;
}

interface Props {
  projectId: string;
  images: ImageItem[];
}

export default function ProjectGallery({ projectId, images }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const current = lightboxIdx !== null ? images[lightboxIdx] : null;

  const prev = useCallback(() => setLightboxIdx((i) => (i !== null && i > 0 ? i - 1 : i)), []);
  const next = useCallback(
    () => setLightboxIdx((i) => (i !== null && i < images.length - 1 ? i + 1 : i)),
    [images.length]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setLightboxIdx(null);
    },
    [prev, next]
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`/api/projects/${projectId}/documents`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setError("No se pudo subir la imagen.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!confirm("¿Eliminar esta imagen?")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/projects/${projectId}/documents/${id}`, { method: "DELETE" });
      if (lightboxIdx !== null) setLightboxIdx(null);
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  };

  const labelFromName = (name: string) => name.replace(/\.[^/.]+$/, "");

  return (
    <>
      <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider">
            Imágenes del Proyecto
          </h3>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 text-xs bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 text-white px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {uploading ? "Subiendo..." : "Añadir Imagen"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,.svg"
            className="hidden"
            onChange={handleUpload}
          />
        </div>

        {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

        {images.length === 0 ? (
          <div className="text-center py-10">
            <svg
              className="w-10 h-10 text-zinc-700 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-zinc-500 text-sm">No hay imágenes del proyecto</p>
            <p className="text-zinc-600 text-xs mt-1">Añade renders, planos o fotografías de obra</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {images.map((img, idx) => (
              <div
                key={img.id}
                className="relative group aspect-video bg-zinc-900 rounded-lg overflow-hidden cursor-pointer ring-1 ring-zinc-700/50 hover:ring-zinc-500 transition-all duration-200"
                onClick={() => setLightboxIdx(idx)}
              >
                <img
                  src={img.fileUrl}
                  alt={labelFromName(img.name)}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                {/* Delete button — top right */}
                <button
                  onClick={(e) => handleDelete(img.id, e)}
                  disabled={deletingId === img.id}
                  className="absolute top-2 right-2 bg-black/50 hover:bg-red-500/80 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-40"
                  title="Eliminar imagen"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
                {/* Label — bottom */}
                <div className="absolute bottom-0 left-0 right-0 px-2.5 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <p className="text-white text-xs font-medium truncate drop-shadow">
                    {labelFromName(img.name)}
                  </p>
                </div>
                {/* Expand icon */}
                <div className="absolute top-2 left-2 bg-black/40 p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {current && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-md"
          onClick={() => setLightboxIdx(null)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 z-10 text-white/70 hover:text-white p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            onClick={() => setLightboxIdx(null)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Prev */}
          {lightboxIdx! > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white/70 hover:text-white p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              onClick={(e) => { e.stopPropagation(); prev(); }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next */}
          {lightboxIdx! < images.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white/70 hover:text-white p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              onClick={(e) => { e.stopPropagation(); next(); }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Image + caption */}
          <div
            className="flex flex-col items-center gap-4 max-w-5xl w-full px-16"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={current.fileUrl}
              alt={labelFromName(current.name)}
              className="max-h-[78vh] w-full object-contain rounded-xl shadow-2xl"
            />
            <div className="flex items-center gap-4">
              <span className="text-white/80 text-sm font-medium">{labelFromName(current.name)}</span>
              <span className="text-white/25">|</span>
              <span className="text-white/40 text-xs tabular-nums">
                {lightboxIdx! + 1} / {images.length}
              </span>
              <span className="text-white/25">|</span>
              <button
                onClick={() => handleDelete(current.id)}
                disabled={deletingId === current.id}
                className="text-white/40 hover:text-red-400 text-xs transition-colors disabled:opacity-30"
              >
                Eliminar
              </button>
            </div>
          </div>

          {/* Counter dots */}
          <div className="absolute bottom-6 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setLightboxIdx(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === lightboxIdx ? "bg-white w-4" : "bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
