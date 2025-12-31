import z from "zod";

export const createClassSchema = z.object({
  yearId: z.string().min(1),
  section: z.string(),
  name: z.string().min(1, "Class name is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  roomNumber: z.string().optional(),
});
