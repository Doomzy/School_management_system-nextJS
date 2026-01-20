import db from "@/lib/db";

export async function getSubjectsData() {
  try {
    const subjects = await db.subject.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return subjects;
  } catch (_error) {
    console.error("Error fetching subjects:", _error);
    return [];
  }
}

export async function getSubjectById(subjectId: string) {
  try {
    const subject = await db.subject.findUnique({
      where: { id: subjectId },
    });

    return subject;
  } catch (_error) {
    console.error("Error fetching subject:", _error);
    return null;
  }
}
