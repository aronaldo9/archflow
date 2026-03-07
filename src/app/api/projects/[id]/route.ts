import { NextResponse } from "next/server";
import { getProjectById, updateProject, logActivity } from "@/lib/data";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const project = await getProjectById(params.id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const project = await updateProject(params.id, {
      name: body.name,
      description: body.description || undefined,
      location: body.location || undefined,
      budget: body.budget !== undefined ? Number(body.budget) : undefined,
      startDate: body.startDate,
      endDate: body.endDate,
      clientName: body.clientName,
      status: body.status,
      phase: body.phase,
    });
    await logActivity(params.id, "project_updated", "Proyecto actualizado");
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}
