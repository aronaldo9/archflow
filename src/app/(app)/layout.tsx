import AppShell from "@/components/AppShell";
import { getSession } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  const user = session
    ? { name: session.name, email: session.email, role: session.role }
    : null;

  return <AppShell user={user}>{children}</AppShell>;
}
