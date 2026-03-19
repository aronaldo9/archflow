import { NextResponse } from "next/server";
import { createMilestone, logActivity } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    if (!body.title || !body.dueDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const milestone = await createMilestone(params.id, {
      title: body.title,
      dueDate: body.dueDate,
    });
    await logActivity(params.id, "milestone_added", `Hito añadido: ${milestone.title}`);
    return NextResponse.json(milestone, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create milestone" }, { status: 500 });
  }
}
