import db from "@/lib/db";
import { createBookSchema } from "@/lib/schemas/book";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = createBookSchema.parse(body);

    const book = await db.book.create({
      data: validatedData,
    });

    return NextResponse.json(book);
  } catch (error) {
    console.error("Post /api/book error:", error);
    return NextResponse.json(
      { error: "Unable to create a new book" },
      { status: 500 }
    );
  }
}
