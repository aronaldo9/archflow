import { NextResponse } from "next/server";
import { getProjectById } from "@/lib/data";

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
