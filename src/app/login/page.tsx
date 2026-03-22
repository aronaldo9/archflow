"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error al iniciar sesión");
        return;
      }

      router.push(data.redirectTo);
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" aria-label="ArchFlow — ir al inicio">
          <svg width="192" height="48" viewBox="0 0 192 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <linearGradient id="lg-gold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              <linearGradient id="lg-blue" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
            </defs>
            {/* Left arch */}
            <path d="M8 38 L8 22 Q8 10 18 10 Q28 10 28 22 L28 38" stroke="url(#lg-gold)" strokeWidth="3" fill="none" strokeLinecap="round"/>
            {/* Right arch */}
            <path d="M20 38 L20 18 Q20 4 32 4 Q44 4 44 18 L44 38" stroke="url(#lg-gold)" strokeWidth="3" fill="none" strokeLinecap="round"/>
            {/* Wave lines */}
            <path d="M4 42 Q10 38 16 42 Q22 46 28 42 Q34 38 40 42 Q46 46 52 42" stroke="url(#lg-blue)" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <path d="M4 46 Q10 42 16 46 Q22 50 28 46 Q34 42 40 46 Q46 50 52 46" stroke="url(#lg-blue)" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
            {/* Text */}
            <text x="60" y="30" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="22" fill="white">Arch</text>
            <text x="101" y="30" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="22" fill="#38bdf8">Flow</text>
            <text x="60" y="44" fontFamily="system-ui, sans-serif" fontWeight="400" fontSize="9" fill="#71717a" letterSpacing="2">ARQUITECTURA</text>
          </svg>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h1 className="text-white font-semibold text-xl mb-1">Iniciar sesión</h1>
          <p className="text-zinc-500 text-sm mb-6">Accede a tu cuenta de ArchFlow</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-zinc-400 text-sm mb-1.5">Email</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@archflow.es"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-zinc-400 text-sm mb-1.5">Contraseña</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>

            {error && (
              <p role="alert" className="text-red-400 text-sm bg-red-950/40 border border-red-900/50 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-900 font-semibold text-sm py-2.5 rounded-lg transition-colors mt-2"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        <footer className="mt-5 text-center space-y-3">
          <p>
            <Link href="/" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
              ← Volver al inicio
            </Link>
          </p>
          <p className="text-zinc-600 text-xs">
            © {new Date().getFullYear()} ArchFlow · Todos los derechos reservados
          </p>
        </footer>
      </div>
    </div>
  );
}
