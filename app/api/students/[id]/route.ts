import db from "@/lib/db";
import { createStudentSchema } from "@/lib/schemas/student";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const body = await req.json();
    const validatedData = createStudentSchema.parse(body);

    const student = await db.student.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error("PATCH /api/students/[id] error:", error);
    return NextResponse.json(
      { error: "Unable to update student" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;

    await db.student.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/students/[id] error:", error);
    return NextResponse.json(
      { error: "Unable to delete student" },
      { status: 500 }
    );
  }
}
