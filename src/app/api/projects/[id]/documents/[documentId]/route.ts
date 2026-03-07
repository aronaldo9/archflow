import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { findDocumentById, deleteDocument, logActivity } from "@/lib/data";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string; documentId: string } }
) {
  try {
    const doc = await findDocumentById(params.documentId);
    if (!doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    try {
      const filePath = path.join(process.cwd(), "public", doc.fileUrl);
      await unlink(filePath);
    } catch {
      // File may already be missing — proceed with DB deletion
    }

    await deleteDocument(params.documentId);
    await logActivity(params.id, "document_deleted", `Archivo eliminado: ${doc.name}`);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
  }
}
