import { NextResponse } from "next/server";
import { updateMilestone, deleteMilestone, logActivity } from "@/lib/data";

export async function PUT(
  request: Request,
  { params }: { params: { id: string; milestoneId: string } }
) {
  try {
    const body = await request.json();
    const milestone = await updateMilestone(params.milestoneId, {
      title: body.title,
      dueDate: body.dueDate,
      completed: body.completed,
    });
    if (body.completed === true) {
      await logActivity(params.id, "milestone_completed", `Hito completado: ${milestone.title}`);
    } else if (body.completed === false) {
      await logActivity(params.id, "milestone_updated", `Hito reabierto: ${milestone.title}`);
    } else {
      await logActivity(params.id, "milestone_updated", `Hito editado: ${milestone.title}`);
    }
    return NextResponse.json(milestone);
  } catch {
    return NextResponse.json({ error: "Failed to update milestone" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string; milestoneId: string } }
) {
  try {
    const milestone = await deleteMilestone(params.milestoneId);
    await logActivity(params.id, "milestone_deleted", `Hito eliminado: ${milestone.title}`);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete milestone" }, { status: 500 });
  }
}
