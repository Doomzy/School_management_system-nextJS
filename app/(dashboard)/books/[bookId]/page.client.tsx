"use client";

import { BookForm } from "./components/book-form";
import type { Book } from "@prisma/client";

interface BookPageClientProps {
  initialData: Book | null;
}

export function BookPageClient({ initialData }: BookPageClientProps) {
  return (
    <div className="min-h-screen p-6">
      <BookForm initialData={initialData} />
    </div>
  );
}
