import db from "@/lib/db";
import { createStudentSchema } from "@/lib/schemas/student";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = createStudentSchema.parse(body);

    const student = await db.student.create({
      data: validatedData,
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error("Post /api/students error:", error);
    return NextResponse.json(
      { error: "Unable to create a new student" },
      { status: 500 }
    );
  }
}
