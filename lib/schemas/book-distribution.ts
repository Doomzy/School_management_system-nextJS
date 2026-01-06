import { DistributionStatus } from "@prisma/client";
import { z } from "zod";

export const createBookDistributionSchema = z.object({
  studentId: z.string().min(1),
  bookId: z.string().min(1),
  status: z.nativeEnum(DistributionStatus),
});

export const booksDistributionSchema = z.array(createBookDistributionSchema);

export type CreateBooksDistributionInput = z.infer<
  typeof booksDistributionSchema
>;
