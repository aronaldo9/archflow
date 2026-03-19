import { NextResponse } from "next/server";
import { deleteExpense, logActivity } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string; expenseId: string } }
) {
  try {
    await deleteExpense(params.expenseId);
    await logActivity(params.id, "expense_deleted", "Gasto eliminado");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete expense" }, { status: 500 });
  }
}
