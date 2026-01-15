"use server";

import { schoolLevelsArray } from "@/lib/constants";
import db from "@/lib/db";
import { SchoolLevel } from "@prisma/client";

type BookDistributionSummary = {
  title: string;
  distributed: number;
  total: number;
};

type ClassSummary = {
  id: string;
  name: string;
  students: number; // current enrolled students
  completed: number; // students who received ALL required books
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
  level: SchoolLevel = "ELEMENTARY",
  academicYear: number = new Date().getFullYear()
): Promise<SchoolLevelReport[]> {
  try {
    // Step 1: Fetch all structural data in one query (years, classes, books, student counts)
    const years = await db.year.findMany({
      where: {
        level,
        //yearNumber: academicYear,
      },
      orderBy: { yearNumber: "asc" },
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

    if (years.length === 0) {
      return [];
    }

    // Step 2: Fetch ALL received book distributions for the entire level in ONE query
    const allDistributions = await db.bookDistribution.findMany({
      where: {
        status: "RECEIVED",
        book: {
          year: { level },
        },
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

    // Step 3: Pre-compute required books per year (Map<yearId, bookIds[]>)
    const requiredBooksPerYear = new Map<string, string[]>();
    const bookTitles = new Map<string, string>(); // bookId -> title
    const bookTotals = new Map<string, number>(); // bookId -> totalQuantity (fallback)

    for (const year of years) {
      const bookIds = year.books.map((b) => b.id);
      requiredBooksPerYear.set(year.id, bookIds);

      for (const book of year.books) {
        bookTitles.set(book.id, book.title);
        bookTotals.set(book.id, book.totalQuantity);
      }
    }

    // Step 4: Process distributions in-memory (fast, no DB calls)
    // Maps for aggregations:
    const distributionsPerClassPerBook = new Map<string, Map<string, number>>(); // classId -> bookId -> count
    const studentBookCounts = new Map<string, Map<string, number>>(); // classId -> studentId -> receivedBooksCount

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

    // Step 5: Build the report structure
    const result: SchoolLevelReport[] = [];
    const currentLevel = schoolLevelsArray.find((lvl) => lvl.value === level);
    const schoolEntry: SchoolLevelReport = {
      id: level.toLowerCase(),
      name: currentLevel?.label || level,
      icon: currentLevel ? <currentLevel.icon /> : null,
      totalStudents: 0,
      years: [],
    };

    for (const year of years) {
      let yearTotalStudents = 0;
      let yearCompletedStudents = 0;

      const requiredBooks = requiredBooksPerYear.get(year.id) || [];
      const requiredCount = requiredBooks.length;

      const classesSummary: ClassSummary[] = [];

      for (const cls of year.classes) {
        const classStudentCount = cls._count.students;
        yearTotalStudents += classStudentCount;

        // Completion per class
        const classStudentBooks = studentBookCounts.get(cls.id) || new Map();
        const completedInClass = Array.from(classStudentBooks.values()).filter(
          (count) => count === requiredCount
        ).length;

        yearCompletedStudents += completedInClass;

        // Books summary per class
        const booksSummary: BookDistributionSummary[] = year.books.map(
          (book) => {
            const classBooks = distributionsPerClassPerBook.get(cls.id);
            const distributed = classBooks?.get(book.id) || 0;

            return {
              title: book.title,
              distributed,
              total: classStudentCount || book.totalQuantity, // fallback to inventory total
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
    return result;
  } catch (error) {
    console.error("Failed to generate school report:", error);
    throw new Error("Failed to load distribution report");
  }
}
