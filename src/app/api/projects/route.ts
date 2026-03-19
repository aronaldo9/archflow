import { NextResponse } from "next/server";
import { getAllProjects, createProject } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = await getAllProjects();
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.code || !body.clientName || !body.startDate || !body.endDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const project = await createProject({
      name: body.name,
      code: body.code,
      description: body.description || undefined,
      status: body.status ?? "planning",
      phase: body.phase ?? "concept",
      type: body.type ?? "administrative",
      location: body.location || undefined,
      budget: Number(body.budget) || 0,
      startDate: body.startDate,
      endDate: body.endDate,
      clientName: body.clientName,
      clientEmail: body.clientEmail || undefined,
      clientPhone: body.clientPhone || undefined,
      tags: body.tags || undefined,
    });

    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
