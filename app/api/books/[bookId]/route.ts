import cloudinary from "@/lib/cloudinary";
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

    const book = await db.book.update({
      where: { id: bookId },
      data: validatedData,
    });

    return NextResponse.json(book);
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
    const book = await db.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    await db.book.delete({
      where: { id: bookId },
    });

    if (book.coverImagePublicId) {
      await cloudinary.uploader.destroy(book.coverImagePublicId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/books/[bookId] error:", error);
    return NextResponse.json(
      { error: "Unable to delete book" },
      { status: 500 }
    );
  }
}
