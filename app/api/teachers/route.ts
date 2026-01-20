import db from "@/lib/db";
import { createTeacherSchema } from "@/lib/schemas/teacher";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = createTeacherSchema.parse(body);

    const teacher = await db.teacher.create({
      data: validatedData,
    });

    return NextResponse.json(teacher);
  } catch (error) {
    console.error("Post /api/teachers error:", error);
    return NextResponse.json(
      { error: "Unable to create a new teacher" },
      { status: 500 }
    );
  }
}
