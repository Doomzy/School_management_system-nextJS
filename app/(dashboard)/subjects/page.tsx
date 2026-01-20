import { getSubjectsData } from "./_actions/getSubjectsData";
import { SubjectListClient } from "./page.client";

export default async function Page() {
  const subjects = await getSubjectsData();

  return <SubjectListClient subjects={subjects} />;
}
