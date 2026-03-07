import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { createDocument, logActivity } from "@/lib/data";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const fileName = `${Date.now()}-${safeName}`;
    await writeFile(path.join(uploadDir, fileName), buffer);

    const document = await createDocument(params.id, {
      name: file.name,
      fileUrl: `/uploads/${fileName}`,
    });

    const type = /\.(svg|jpg|jpeg|png|gif|webp)$/i.test(file.name) ? "image_uploaded" : "document_uploaded";
    await logActivity(params.id, type, `Archivo subido: ${file.name}`);
    return NextResponse.json(document, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to upload document" }, { status: 500 });
  }
}
