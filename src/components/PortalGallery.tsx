"use client";

import { useState, useCallback } from "react";

interface ImageItem {
  id: string;
  name: string;
  fileUrl: string;
}

export default function PortalGallery({ images }: { images: ImageItem[] }) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const current = lightboxIdx !== null ? images[lightboxIdx] : null;
  const prev = useCallback(() => setLightboxIdx((i) => (i !== null && i > 0 ? i - 1 : i)), []);
  const next = useCallback(() => setLightboxIdx((i) => (i !== null && i < images.length - 1 ? i + 1 : i)), [images.length]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
    if (e.key === "Escape") setLightboxIdx(null);
  }, [prev, next]);

  const label = (name: string) => name.replace(/\.[^/.]+$/, "");

  if (images.length === 0) return null;

  return (
    <>
      <div>
        <h2 className="font-semibold text-white mb-4">Imágenes del proyecto</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className="relative group aspect-video bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden cursor-pointer hover:border-zinc-600 transition-colors"
              onClick={() => setLightboxIdx(idx)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.fileUrl}
                alt={label(img.name)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              <div className="absolute top-2 left-2 bg-black/40 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>
              <div className="absolute bottom-0 left-0 right-0 px-2.5 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <p className="text-white text-xs font-medium truncate drop-shadow">{label(img.name)}</p>
              </div>
            </div>
          ))}
        </div>
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.fileUrl}
              alt={label(current.name)}
              className="max-h-[78vh] w-full object-contain rounded-xl shadow-2xl"
            />
            <div className="flex items-center gap-4">
              <span className="text-white/80 text-sm font-medium">{label(current.name)}</span>
              <span className="text-white/25">|</span>
              <span className="text-white/40 text-xs tabular-nums">
                {lightboxIdx! + 1} / {images.length}
              </span>
            </div>
          </div>

          {/* Dots */}
          <div className="absolute bottom-6 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setLightboxIdx(i); }}
                className={`h-1.5 rounded-full transition-all ${i === lightboxIdx ? "bg-white w-4" : "bg-white/30 hover:bg-white/60 w-1.5"}`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
