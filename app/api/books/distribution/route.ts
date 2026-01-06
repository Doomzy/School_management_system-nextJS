import db from "@/lib/db";
import { booksDistributionSchema } from "@/lib/schemas/book-distribution";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = booksDistributionSchema.parse(body);

    const bookDistributions = await db.$transaction(
      validatedData.map((b_dist) =>
        db.bookDistribution.upsert({
          where: {
            studentId_bookId: {
              bookId: b_dist.bookId,
              studentId: b_dist.studentId,
            },
          },
          update: { status: b_dist.status },
          create: b_dist,
        })
      )
    );

    return NextResponse.json(bookDistributions);
  } catch (error) {
    console.error("Post /api/book/distribution error:", error);
    return NextResponse.json(
      { error: "Unable to distribute the book/s" },
      { status: 500 }
    );
  }
}
