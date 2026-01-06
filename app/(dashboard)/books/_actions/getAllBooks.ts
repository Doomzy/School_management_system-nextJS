import db from "@/lib/db";

export async function getBooksData() {
  try {
    const books = await db.book.findMany({
      include: {
        year: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return books;
  } catch (_error) {
    console.error("Error fetching books:", _error);
    return [];
  }
}

export async function getBookById(bookId: string) {
  try {
    const book = await db.book.findUnique({
      where: { id: bookId },
    });

    return book;
  } catch (_error) {
    console.error("Error fetching book:", _error);
    return null;
  }
}

export async function getYearsData() {
  try {
    const years = await db.year.findMany({
      orderBy: {
        level: "asc",
      },
    });

    return years;
  } catch (_error) {
    console.error("Error fetching years:", _error);
    return [];
  }
}
