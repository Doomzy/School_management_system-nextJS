import db from "@/lib/db";
import { createClassSchema } from "@/lib/schemas/class";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = createClassSchema.parse(body);

    const years = await db.class.create({
      data: validatedData,
    });

    return NextResponse.json(years);
  } catch (error) {
    console.error("Post /api/classes error:", error);
    return NextResponse.json(
      { error: "Unable to create a new class" },
      { status: 500 }
    );
  }
}
