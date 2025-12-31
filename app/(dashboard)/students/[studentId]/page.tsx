import { getStudentById } from "../_actions/getStudentsData";
import db from "@/lib/db";
import { StudentPageClient } from "./page.client";

export default async function Page(props: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await props.params;

  const isNewStudent = studentId === "new";

  let initialData = null;
  if (!isNewStudent) {
    initialData = await getStudentById(studentId);
    if (!initialData) {
      return <div>Student not found</div>;
    }
  }

  // Get all classes for the dropdown
  const classes = await db.class.findMany({
    include: {
      year: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return <StudentPageClient initialData={initialData} classes={classes} />;
}
