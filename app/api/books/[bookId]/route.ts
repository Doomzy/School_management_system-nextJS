import db from "@/lib/db";
import { createBookSchema } from "@/lib/schemas/book";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  props: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await props.params;
    const body = await req.json();
    const validatedData = createBookSchema.parse(body);

    const student = await db.book.update({
      where: { id: bookId },
      data: validatedData,
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error("PATCH /api/books/[bookId] error:", error);
    return NextResponse.json(
      { error: "Unable to update book" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await props.params;

    await db.book.delete({
      where: { id: bookId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/books/[bookId] error:", error);
    return NextResponse.json(
      { error: "Unable to delete book" },
      { status: 500 }
    );
  }
}
