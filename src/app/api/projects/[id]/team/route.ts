import { NextResponse } from "next/server";
import { createTeamMember, logActivity } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    if (!body.name || !body.role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const member = await createTeamMember(params.id, {
      name: body.name,
      role: body.role,
      email: body.email || undefined,
      phone: body.phone || undefined,
    });
    await logActivity(params.id, "team_member_added", `Miembro añadido: ${member.name} (${member.role})`);
    return NextResponse.json(member, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to add team member" }, { status: 500 });
  }
}
