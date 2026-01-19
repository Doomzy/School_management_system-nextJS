import z from "zod";

export const createTeacherSchema = z.object({
  subjectId: z.string().min(1, "Subject is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email().or(z.literal("")),
  phone: z.string().optional(),
});

export type CreateTeacherInput = z.infer<typeof createTeacherSchema>;
