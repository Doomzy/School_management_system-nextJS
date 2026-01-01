import cloudinary from "@/lib/cloudinary";
import db from "@/lib/db";
import { createBookSchema } from "@/lib/schemas/book";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let imagePublicId: string | null = null;

  try {
    const body = await req.json();
    const validatedData = createBookSchema.parse(body);
    imagePublicId = validatedData.coverImagePublicId || null;

    const book = await db.book.create({
      data: validatedData,
    });

    return NextResponse.json(book);
  } catch (error) {
    if (imagePublicId) {
      try {
        await cloudinary.uploader.destroy(imagePublicId);
        console.log("Cleaned up orphaned image:", imagePublicId);
      } catch (cleanupError) {
        console.error("Failed to cleanup image:", cleanupError);
      }
    }

    console.error("Post /api/book error:", error);
    return NextResponse.json(
      { error: "Unable to create a new book" },
      { status: 500 }
    );
  }
}
