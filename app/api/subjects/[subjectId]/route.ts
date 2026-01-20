import db from "@/lib/db";
import { createSubjectSchema } from "@/lib/schemas/subject";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ subjectId: string }> }
) {
  try {
    const body = await req.json();
    const validatedData = createSubjectSchema.parse(body);

    const { subjectId } = await params;

    const updatedSubject = await db.subject.updateMany({
      where: { id: subjectId },
      data: validatedData,
    });

    return NextResponse.json(updatedSubject);
  } catch (error) {
    console.error("PATCH /api/subjects/[id] error:", error);

    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Invalid data provided" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Unable to update subject" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ subjectId: string }> }
) {
  try {
    const { subjectId } = await params;

    await db.subject.deleteMany({
      where: { id: subjectId },
    });

    return NextResponse.json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/subjects/[id] error:", error);
    return NextResponse.json(
      { error: "Unable to delete subject" },
      { status: 500 }
    );
  }
}
