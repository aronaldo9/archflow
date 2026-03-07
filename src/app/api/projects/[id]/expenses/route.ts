import { NextResponse } from "next/server";
import { createExpense, logActivity } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    if (!body.description || body.amount === undefined || !body.date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const expense = await createExpense(params.id, {
      description: body.description,
      amount: Number(body.amount),
      category: body.category ?? "other",
      date: body.date,
    });
    await logActivity(
      params.id,
      "expense_added",
      `Gasto registrado: ${expense.description} (${formatCurrency(expense.amount)})`
    );
    return NextResponse.json(expense, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create expense" }, { status: 500 });
  }
}
