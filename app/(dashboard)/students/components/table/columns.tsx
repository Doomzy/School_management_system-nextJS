"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { schoolLevelsArray } from "@/lib/constants";

export type StudentTable = {
  id: string;
  firstName: string;
  lastName: string;
  gender: string | null;
  enrollmentNo: string;
  class: {
    name: string;
    year: {
      yearNumber: number;
      level: string;
    };
  };
  guardianName: string | null;
  guardianPhone: string | null;
};

export const studentsColumns: ColumnDef<StudentTable>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    accessorKey: "enrollmentNo",
    header: "Enrollment No.",
  },
  {
    header: "Level",
    cell: ({ row }) =>
      schoolLevelsArray.find(
        (level) => level.value == row.original.class.year.level
      )?.label || row.original.class.year.level,
  },
  {
    accessorKey: "class",
    header: "Class",
    cell: ({ row }) =>
      row.original.class.name +
      " (Year " +
      row.original.class.year.yearNumber +
      ")",
  },
  {
    accessorKey: "guardianName",
    header: "Guardian Name",
  },
  {
    accessorKey: "guardianPhone",
    header: "Guardian Phone",
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => (
      <Link href={`/students/${row.original.id}`}>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </Link>
    ),
  },
];
