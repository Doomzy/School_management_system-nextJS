import { getStudentsData } from "./_actions/getStudentsData";
import { StudentListClient } from "./page.client";

export default async function Page() {
  const students = await getStudentsData();

  return <StudentListClient students={students} />;
}
