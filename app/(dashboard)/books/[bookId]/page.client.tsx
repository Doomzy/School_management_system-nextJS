"use client";

import { BookForm } from "./components/book-form";
import type { Book, Subject } from "@prisma/client";
import type { Year } from "@prisma/client";

interface BookPageClientProps {
  initialData: Book | null;
  years: Year[];
  subjects: Subject[];
}

export function BookPageClient({
  initialData,
  years,
  subjects,
}: BookPageClientProps) {
  return (
    <div className="min-h-screen p-6">
      <BookForm initialData={initialData} years={years} subjects={subjects} />
    </div>
  );
}
