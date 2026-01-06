"use server";

import db from "@/lib/db";
import {
  SchoolLevel,
  Class,
  Student,
  Year,
  Book,
  DistributionStatus,
} from "@prisma/client";

export interface ClassWithStudentsCount extends Class {
  students: (Student & {
    bookDistributions: { bookId: string; status: DistributionStatus }[];
  })[];
  year: Year & { books: Book[] };
}

export async function getClassesByLevel(selectedLevel: SchoolLevel) {
  const classes: ClassWithStudentsCount[] = await db.class.findMany({
    where: { year: { level: selectedLevel } },
    include: {
      year: { include: { books: true } },
      students: { include: { bookDistributions: true } },
    },
  });
  return classes || [];
}
