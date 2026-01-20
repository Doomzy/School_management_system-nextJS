import db from "@/lib/db";

export async function getTeachersData() {
  try {
    const teachers = await db.teacher.findMany({
      include: {
        subject: { select: { name: true } },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return teachers;
  } catch (_error) {
    console.error("Error fetching teachers:", _error);
    return [];
  }
}

export async function getTeacherById(teacherId: string) {
  try {
    const teacher = await db.teacher.findUnique({
      where: { id: teacherId },
      include: {
        subject: true,
      },
    });

    return teacher;
  } catch (_error) {
    console.error("Error fetching teacher:", _error);
    return null;
  }
}
