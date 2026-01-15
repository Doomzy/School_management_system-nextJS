"use server";

import db from "@/lib/db";

interface ShortageAlert {
  bookTitle: string;
  available: number;
  pendingStudents: number;
  projectedShortage: number;
  urgency: number; // Percentage of demand that can be met (0-100)
}

interface ProblemSummary {
  totalMissingStudents: number;
  totalMissingBooks: number;
  criticalShortageBooks: number;
}

interface DistributionProblems {
  problemSummary: ProblemSummary;
  shortageAlerts: ShortageAlert[];
}

export async function getDistributionProblems(): Promise<DistributionProblems> {
  try {
    // Get all books with their distribution counts
    const books = await db.book.findMany({
      include: {
        bookDistributions: {
          where: {
            status: "PENDING",
          },
        },
        year: true,
      },
    });

    const shortageAlerts: ShortageAlert[] = [];
    let totalMissingBooks = 0;
    let criticalShortageBooks = 0;

    // Analyze each book for shortages
    books.forEach((book) => {
      const pendingStudents = book.bookDistributions.length;
      const available = book.availableQty;
      const projectedShortage = Math.max(0, pendingStudents - available);

      // Only include books with actual shortages
      if (projectedShortage > 0) {
        totalMissingBooks += projectedShortage;

        // Check if this is a critical shortage (available < 10 and has pending students)
        if (available < 10 && pendingStudents > 0) {
          criticalShortageBooks++;
        }

        // Calculate urgency as percentage of demand that can be met
        // 0% = no books available, 100% = all demand can be met
        const urgency =
          pendingStudents > 0
            ? Math.round((available / pendingStudents) * 100)
            : 100;

        shortageAlerts.push({
          bookTitle: book.title,
          available,
          pendingStudents,
          projectedShortage,
          urgency,
        });
      }
    });

    // Sort alerts by urgency (lowest percentage first = most critical) and then by projected shortage (descending)
    shortageAlerts.sort((a, b) => {
      if (a.urgency !== b.urgency) {
        return a.urgency - b.urgency; // Lower percentage = more urgent
      }
      return b.projectedShortage - a.projectedShortage;
    });

    // Count total students with pending distributions who can't get books
    const totalMissingStudents = shortageAlerts.reduce(
      (sum, alert) => sum + alert.projectedShortage,
      0
    );

    const problemSummary: ProblemSummary = {
      totalMissingStudents,
      totalMissingBooks,
      criticalShortageBooks,
    };

    return {
      problemSummary,
      shortageAlerts,
    };
  } catch (error) {
    console.error("Error fetching distribution problems:", error);
    throw new Error("Failed to fetch distribution problems");
  }
}
