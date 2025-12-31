import db from "@/lib/db";
import { Year } from "@prisma/client";

interface YearsGroupedByLevel extends Year {
  students_count: number;
}

export async function getLevelsData() {
  try {
    const years = await db.year.findMany({
      include: { classes: { include: { students: true } } },
    });

    const groupedByLevel = years.reduce<Record<string, YearsGroupedByLevel[]>>(
      (acc, year) => {
        const key = year.level;
        const count = year.classes.reduce(
          (a, cl) => (a += cl.students.length),
          0
        );
        if (!acc[key]) acc[key] = [];
        acc[key].push({ ...year, students_count: count });
        return acc;
      },
      {}
    );

    return groupedByLevel;
  } catch (_error) {
    console.log(_error);
    return {};
  }
}
