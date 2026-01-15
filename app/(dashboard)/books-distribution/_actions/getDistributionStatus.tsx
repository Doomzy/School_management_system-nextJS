"use server";

import { schoolLevelsArray } from "@/lib/constants";
import db from "@/lib/db";
import { SchoolLevel } from "@prisma/client";
import React from "react";

type BookDistributionSummary = {
  title: string;
  distributed: number;
  total: number;
};

type ClassSummary = {
  id: string;
  name: string;
  students: number;
  completed: number;
  books: BookDistributionSummary[];
};

type YearSummary = {
  id: string;
  name: string;
  totalStudents: number;
  completedStudents: number;
  classes: ClassSummary[];
};

type SchoolLevelReport = {
  id: string;
  name: string;
  icon: React.ReactNode | null;
  totalStudents: number;
  years: YearSummary[];
};

export async function getSchoolBookDistributionReport(
  academicYear: number = new Date().getFullYear()
): Promise<SchoolLevelReport[]> {
  try {
    // Step 1: Fetch all structural data in one query (years, classes, books, student counts)
    const years = await db.year.findMany({
      // where: { yearNumber: academicYear }, // optional
      include: {
        classes: {
          include: {
            _count: {
              select: { students: true },
            },
          },
          orderBy: { section: "asc" },
        },
        books: {
          select: {
            id: true,
            title: true,
            totalQuantity: true,
          },
          orderBy: { title: "asc" },
        },
      },
    });

    /**
     * STEP 2: Fetch ALL received distributions (all levels)
     */
    const allDistributions = await db.bookDistribution.findMany({
      where: {
        status: "RECEIVED",
      },
      select: {
        bookId: true,
        studentId: true,
        student: {
          select: {
            classId: true,
          },
        },
      },
    });

    /**
     * STEP 3: Group years by level
     */
    const yearsByLevel = new Map<SchoolLevel, typeof years>();
    for (const year of years) {
      const arr = yearsByLevel.get(year.level) ?? [];
      arr.push(year);
      yearsByLevel.set(year.level, arr);
    }

    /**
     * STEP 4: Pre-compute required books per year
     */
    const requiredBooksPerYear = new Map<string, string[]>();

    for (const year of years) {
      requiredBooksPerYear.set(
        year.id,
        year.books.map((b) => b.id)
      );
    }

    /**
     * STEP 5: Aggregate distributions in memory
     */
    const distributionsPerClassPerBook = new Map<string, Map<string, number>>();

    const studentBookCounts = new Map<string, Map<string, number>>();

    for (const dist of allDistributions) {
      const classId = dist.student.classId;
      const bookId = dist.bookId;
      const studentId = dist.studentId;

      // Aggregate distributed per class per book
      let classBooks = distributionsPerClassPerBook.get(classId);
      if (!classBooks) {
        classBooks = new Map();
        distributionsPerClassPerBook.set(classId, classBooks);
      }
      classBooks.set(bookId, (classBooks.get(bookId) || 0) + 1);

      // Aggregate received books per student (for completion)
      let classStudents = studentBookCounts.get(classId);
      if (!classStudents) {
        classStudents = new Map();
        studentBookCounts.set(classId, classStudents);
      }
      classStudents.set(studentId, (classStudents.get(studentId) || 0) + 1);
    }

    /**
     * STEP 6: Build final report (ALL levels, even empty)
     */
    const result: SchoolLevelReport[] = [];

    for (const lvl of schoolLevelsArray) {
      const level = lvl.value as SchoolLevel;
      const levelYears = yearsByLevel.get(level) ?? [];

      const schoolEntry: SchoolLevelReport = {
        id: level.toLowerCase(),
        name: lvl.label,
        icon: <lvl.icon />,
        totalStudents: 0,
        years: [],
      };

      // Empty level → return empty structure
      if (levelYears.length === 0) {
        result.push(schoolEntry);
        continue;
      }

      for (const year of levelYears) {
        let yearTotalStudents = 0;
        let yearCompletedStudents = 0;

        const requiredBooks = requiredBooksPerYear.get(year.id) ?? [];
        const requiredCount = requiredBooks.length;

        const classesSummary: ClassSummary[] = [];

        for (const cls of year.classes) {
          const classStudentCount = cls._count.students;
          yearTotalStudents += classStudentCount;

          const classStudentBooks = studentBookCounts.get(cls.id) ?? new Map();

          const completedInClass = Array.from(
            classStudentBooks.values()
          ).filter((count) => count === requiredCount).length;

          yearCompletedStudents += completedInClass;

          const booksSummary: BookDistributionSummary[] = year.books.map(
            (book) => {
              const classBooks = distributionsPerClassPerBook.get(cls.id);

              return {
                title: book.title,
                distributed: classBooks?.get(book.id) || 0,
                total: classStudentCount || book.totalQuantity,
              };
            }
          );

          classesSummary.push({
            id: cls.id,
            name: cls.name,
            students: classStudentCount,
            completed: completedInClass,
            books: booksSummary,
          });
        }

        schoolEntry.years.push({
          id: year.id,
          name: year.name,
          totalStudents: yearTotalStudents,
          completedStudents: yearCompletedStudents,
          classes: classesSummary,
        });

        schoolEntry.totalStudents += yearTotalStudents;
      }

      result.push(schoolEntry);
    }

    return result;
  } catch (error) {
    console.error("Failed to generate school report:", error);
    throw new Error("Failed to load distribution report");
  }
}
