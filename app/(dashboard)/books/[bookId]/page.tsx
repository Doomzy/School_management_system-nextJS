import { getBookById, getYearsData } from "../_actions/getAllBooks";
import { BookPageClient } from "./page.client";

export default async function Page(props: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await props.params;

  const isBookStudent = bookId === "new";

  let initialData = null;
  if (!isBookStudent) {
    initialData = await getBookById(bookId);
    if (!initialData) {
      return <div>Book not found</div>;
    }
  }

  const years = await getYearsData();

  return <BookPageClient initialData={initialData} years={years} />;
}
