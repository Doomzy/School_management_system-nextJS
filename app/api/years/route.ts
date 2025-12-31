import db from "@/lib/db";
import { createYearSchema } from "@/lib/schemas/year";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = createYearSchema.parse(body);

    // Check if year with same level and yearNumber already exists
    const existingYear = await db.year.findUnique({
      where: {
        level_yearNumber: {
          level: validatedData.level,
          yearNumber: validatedData.yearNumber,
        },
      },
    });

    if (existingYear) {
      return NextResponse.json(
        {
          error: `Year ${validatedData.yearNumber} already exists for ${validatedData.level}`,
        },
        { status: 400 }
      );
    }

    const year = await db.year.create({
      data: validatedData,
    });

    return NextResponse.json(year);
  } catch (error) {
    console.error("Post /api/years error:", error);
    return NextResponse.json(
      { error: "Unable to create a new year" },
      { status: 500 }
    );
  }
}
