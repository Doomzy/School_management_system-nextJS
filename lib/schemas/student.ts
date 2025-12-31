import z from "zod";

export const createStudentSchema = z.object({
  classId: z.string().min(1, "Class is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().optional(),
  enrollmentNo: z.string().min(1, "Enrollment number is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  guardianName: z.string().min(1, "Guardian name is required"),
  guardianPhone: z.string().min(1, "Guardian phone is required"),
  address: z.string().min(1, "Address is required"),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
