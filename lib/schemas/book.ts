import { z } from "zod";

export const createBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().optional().nullable(),
  isbn: z.string().optional().nullable(),
  subjectId: z
    .string("Please select a subject")
    .min(1, "Please select a subject"),
  publisher: z.string().optional().nullable(),
  publishedYear: z.number().int().optional().nullable(),
  edition: z.string().optional().nullable(),
  totalQuantity: z.number().int().min(0, "Total quantity must be at least 0"),
  availableQty: z
    .number()
    .int()
    .min(0, "Available quantity must be at least 0"),
  issuedQty: z.number().int().min(0, "Issued quantity must be at least 0"),
  description: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  coverImagePublicId: z.string().optional().nullable(),
  yearId: z
    .string("Please select a level/year")
    .min(1, "Please select a level/year"),
});

export type CreateBookInput = z.infer<typeof createBookSchema>;
