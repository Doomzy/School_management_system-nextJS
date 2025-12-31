import db from "@/lib/db";
import { updateYearSchema } from "@/lib/schemas/year";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validatedData = updateYearSchema.parse(body);

    // Check if year exists
    const year = await db.year.findUnique({
      where: { id },
    });

    if (!year) {
      return NextResponse.json({ error: "Year not found" }, { status: 404 });
    }

    // If updating level or yearNumber, check for uniqueness
    if (validatedData.level || validatedData.yearNumber) {
      const newLevel = validatedData.level || year.level;
      const newYearNumber = validatedData.yearNumber || year.yearNumber;

      const existingYear = await db.year.findUnique({
        where: {
          level_yearNumber: {
            level: newLevel,
            yearNumber: newYearNumber,
          },
        },
      });

      if (existingYear && existingYear.id !== id) {
        return NextResponse.json(
          {
            error: `Year ${newYearNumber} already exists for ${newLevel}`,
          },
          { status: 400 }
        );
      }
    }

    const updatedYear = await db.year.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(updatedYear);
  } catch (error) {
    console.error("PATCH /api/years/[id] error:", error);
    return NextResponse.json(
      { error: "Unable to update year" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const { id } = await params;

    // Check if year exists
    const year = await db.year.findUnique({
      where: { id },
      include: { classes: true },
    });

    if (!year) {
      return NextResponse.json({ error: "Year not found" }, { status: 404 });
    }

    // Delete the year (cascade will delete related classes and students)
    await db.year.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Year deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/years/[id] error:", error);
    return NextResponse.json(
      { error: "Unable to delete year" },
      { status: 500 }
    );
  }
}
