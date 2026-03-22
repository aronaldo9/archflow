"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface User {
  name: string;
  email: string;
  role: string;
}

export default function AppShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User | null;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-900 font-[family-name:var(--font-geist-sans)]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header user={user} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
