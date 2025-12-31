import db from "@/lib/db";
import { SchoolLevel } from "@prisma/client";

export async function getYearClasses({
  yearId,
  level,
}: {
  yearId: number;
  level: SchoolLevel;
}) {
  try {
    const classes = await db.year.findFirst({
      where: {
        yearNumber: yearId,
        level: level,
      },
      include: { classes: { include: { students: true } } },
    });

    return classes;
  } catch (_error) {}
}
