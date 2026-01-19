import { getTeachersData } from "./_actions/getTeachersData";
import { TeacherListClient } from "./page.client";

export default async function Page() {
  const teachers = await getTeachersData();

  return <TeacherListClient teachers={teachers} />;
}
