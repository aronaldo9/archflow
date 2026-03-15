"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <button
      onClick={handleLogout}
      className={className ?? "text-zinc-500 hover:text-zinc-300 text-sm transition-colors"}
    >
      Cerrar sesión
    </button>
  );
}
