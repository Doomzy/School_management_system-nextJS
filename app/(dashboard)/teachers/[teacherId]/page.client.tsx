"use client";

import { TeacherForm } from "./components/teacher-form";
import type { Teacher, Subject } from "@prisma/client";

interface TeacherPageClientProps {
  initialData: (Teacher & { subject: Subject | null }) | null;
  subjects: Subject[];
}

export function TeacherPageClient({
  initialData,
  subjects,
}: TeacherPageClientProps) {
  return (
    <div className="min-h-screen p-6">
      <TeacherForm initialData={initialData} subjects={subjects} />
    </div>
  );
}
