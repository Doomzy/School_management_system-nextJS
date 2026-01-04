"use client";

import { BookForm } from "./components/book-form";
import type { Book } from "@prisma/client";
import type { Year } from "@prisma/client";

interface BookPageClientProps {
  initialData: Book | null;
  years: Year[];
}

export function BookPageClient({ initialData, years }: BookPageClientProps) {
  return (
    <div className="min-h-screen p-6">
      <BookForm initialData={initialData} years={years} />
    </div>
  );
}
