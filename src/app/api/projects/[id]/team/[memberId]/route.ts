import { NextResponse } from "next/server";
import { deleteTeamMember, logActivity } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string; memberId: string } }
) {
  try {
    await deleteTeamMember(params.memberId);
    await logActivity(params.id, "team_member_removed", "Miembro eliminado del equipo");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to remove team member" }, { status: 500 });
  }
}
