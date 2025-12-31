import db from "@/lib/db";

export async function getStudentsData() {
  try {
    const students = await db.student.findMany({
      include: {
        class: {
          include: {
            year: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return students;
  } catch (_error) {
    console.error("Error fetching students:", _error);
    return [];
  }
}

export async function getStudentById(studentId: string) {
  try {
    const student = await db.student.findUnique({
      where: { id: studentId },
      include: {
        class: {
          include: {
            year: true,
          },
        },
      },
    });

    return student;
  } catch (_error) {
    console.error("Error fetching student:", _error);
    return null;
  }
}
