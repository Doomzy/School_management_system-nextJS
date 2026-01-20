import db from "@/lib/db";
import { createSubjectSchema } from "@/lib/schemas/subject";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = createSubjectSchema.parse(body);

    const subject = await db.subject.create({
      data: validatedData,
    });

    return NextResponse.json(subject);
  } catch (error) {
    console.error("Post /api/subjects error:", error);
    return NextResponse.json(
      { error: "Unable to create a new subject" },
      { status: 500 }
    );
  }
}
