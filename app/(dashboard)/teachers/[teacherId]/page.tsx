import db from "@/lib/db";
import { TeacherPageClient } from "./page.client";
import { getTeacherById } from "../_actions/getTeachersData";

export default async function Page(props: {
  params: Promise<{ teacherId: string }>;
}) {
  const { teacherId } = await props.params;

  const isNewTeacher = teacherId === "new";

  let initialData = null;
  if (!isNewTeacher) {
    initialData = await getTeacherById(teacherId);
    if (!initialData) {
      return <div>Teacher not found</div>;
    }
  }

  // Get all subjects for the dropdown
  const subjects = await db.subject.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return <TeacherPageClient initialData={initialData} subjects={subjects} />;
}
