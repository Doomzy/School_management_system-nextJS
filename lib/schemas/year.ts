import z from "zod";
import { SchoolLevel } from "@prisma/client";

export const createYearSchema = z.object({
  yearNumber: z.number().min(1).max(12),
  name: z.string().min(1, "Year name is required"),
  level: z.nativeEnum(SchoolLevel),
});

export const updateYearSchema = z.object({
  yearNumber: z.number().min(1).max(12).optional(),
  name: z.string().min(1, "Year name is required").optional(),
  level: z.nativeEnum(SchoolLevel).optional(),
});
