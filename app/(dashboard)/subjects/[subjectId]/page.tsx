import { getSubjectById } from "../_actions/getSubjectsData";
import { SubjectPage } from "./page.client";

export default async function Page(props: {
  params: Promise<{ subjectId: string }>;
}) {
  const { subjectId } = await props.params;

  const isNewSubject = subjectId === "new";

  let initialData = null;
  if (!isNewSubject) {
    initialData = await getSubjectById(subjectId);
    if (!initialData) {
      return <div>Subject not found</div>;
    }
  }

  return <SubjectPage initialData={initialData} />;
}
