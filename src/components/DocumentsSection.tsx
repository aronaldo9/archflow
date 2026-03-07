"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface DocumentItem {
  id: string;
  name: string;
  fileUrl: string;
  uploadedAt: string;
}

interface Props {
  projectId: string;
  documents: DocumentItem[];
}

export default function DocumentsSection({ projectId, documents }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

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
      setError("No se pudo subir el archivo. Inténtalo de nuevo.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este documento?")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/projects/${projectId}/documents/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("es-ES", { year: "numeric", month: "short", day: "numeric" });

  const fileIcon = (name: string) => {
    const ext = name.split(".").pop()?.toLowerCase() ?? "";
    if (ext === "pdf") return (
      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return (
      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    );
    return (
      <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
      </svg>
    );
  };

  return (
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider">
          Documentos del Proyecto
        </h3>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 text-xs bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 text-white px-2.5 py-1.5 rounded-lg transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          {uploading ? "Subiendo..." : "Subir Documento"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/pdf,image/*"
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

      {documents.length === 0 ? (
        <div className="text-center py-8">
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-zinc-500 text-sm">No hay documentos subidos</p>
          <p className="text-zinc-600 text-xs mt-1">Sube PDFs e imágenes del proyecto</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center gap-3 p-2.5 rounded-lg bg-zinc-900/50 hover:bg-zinc-900/80 transition-colors group"
            >
              <span className="flex-shrink-0">{fileIcon(doc.name)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{doc.name}</p>
                <p className="text-xs text-zinc-500">{formatDate(doc.uploadedAt)}</p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <a
                  href={doc.fileUrl}
                  download={doc.name}
                  className="text-zinc-400 hover:text-white p-1.5 rounded transition-colors"
                  title="Descargar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
                <button
                  onClick={() => handleDelete(doc.id)}
                  disabled={deletingId === doc.id}
                  title="Eliminar documento"
                  className="text-zinc-400 hover:text-red-400 p-1.5 rounded transition-colors disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
