import { getBooksData } from "./_actions/getAllBooks";
import { BooksListClient } from "./page.client";

export default async function Page() {
  const books = await getBooksData();

  return <BooksListClient books={books} />;
}
