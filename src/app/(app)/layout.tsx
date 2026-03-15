import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { getSession } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  const user = session
    ? { name: session.name, email: session.email, role: session.role }
    : null;

  return (
    <div className="min-h-screen bg-zinc-900 font-[family-name:var(--font-geist-sans)]">
      <Sidebar />
      <div className="pl-64 flex flex-col min-h-screen">
        <Header user={user} />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
