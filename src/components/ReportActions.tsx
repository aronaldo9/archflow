"use client";

export default function ReportActions() {
  return (
    <div className="print:hidden fixed top-4 right-4 z-50 flex gap-2">
      <button
        onClick={() => window.print()}
        className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-zinc-800 transition-colors shadow-lg"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Imprimir / Guardar PDF
      </button>
      <button
        onClick={() => window.close()}
        className="text-zinc-400 hover:text-white border border-zinc-700 px-3 py-2 rounded-lg text-sm hover:bg-zinc-800 transition-colors"
      >
        Cerrar
      </button>
    </div>
  );
}
