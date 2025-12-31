import db from "@/lib/db";
import { createClassSchema } from "@/lib/schemas/class";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ classId: string }> }
) {
  try {
    const body = await req.json();
    const validatedData = createClassSchema.parse(body);

    const { classId } = await params;

    const updatedClass = await db.class.updateMany({
      where: { id: classId },
      data: validatedData,
    });

    return NextResponse.json(updatedClass);
  } catch (error) {
    console.error("PATCH /api/classes/[id] error:", error);

    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Invalid data provided" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Unable to update class" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ classId: string }> }
) {
  try {
    const { classId } = await params;

    await db.class.deleteMany({
      where: { id: classId },
    });

    return NextResponse.json({ message: "Class deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/classes/[id] error:", error);
    return NextResponse.json(
      { error: "Unable to delete class" },
      { status: 500 }
    );
  }
}
