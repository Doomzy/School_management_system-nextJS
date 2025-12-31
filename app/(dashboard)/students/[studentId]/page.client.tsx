"use client";

import { StudentForm } from "./components/student-form";
import type { Class, Student } from "@prisma/client";

interface StudentPageClientProps {
  initialData: (Student & { class: Class }) | null;
  classes: (Class & { year: { level: string; yearNumber: number } })[];
}

export function StudentPageClient({
  initialData,
  classes,
}: StudentPageClientProps) {
  return (
    <div className="min-h-screen p-6">
      <StudentForm initialData={initialData} classes={classes} />
    </div>
  );
}
