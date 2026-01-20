import db from "@/lib/db";
import { createTeacherSchema } from "@/lib/schemas/teacher";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ teacherId: string }> }
) {
  try {
    const body = await req.json();
    const validatedData = createTeacherSchema.parse(body);

    const { teacherId } = await params;

    const updatedTeacher = await db.teacher.updateMany({
      where: { id: teacherId },
      data: validatedData,
    });

    return NextResponse.json(updatedTeacher);
  } catch (error) {
    console.error("PATCH /api/teachers/[id] error:", error);

    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Invalid data provided" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Unable to update teacher" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ teacherId: string }> }
) {
  try {
    const { teacherId } = await params;

    await db.teacher.deleteMany({
      where: { id: teacherId },
    });

    return NextResponse.json({ message: "Teacher deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/teachers/[id] error:", error);
    return NextResponse.json(
      { error: "Unable to delete teacher" },
      { status: 500 }
    );
  }
}
