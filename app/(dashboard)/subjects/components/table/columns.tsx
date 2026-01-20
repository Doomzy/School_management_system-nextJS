"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

export type SubjectTable = {
  id: string;
  name: string;
  code: string | null;
  description: string | null;
  color: string | null;
};

export const subjectsColumns: ColumnDef<SubjectTable>[] = [
  {
    accessorKey: "name",
    header: "Subject Name",
  },
  {
    accessorKey: "code",
    header: "Subject Code",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => (
      <span
        className="w-10 h-6 rounded-lg flex"
        style={{ backgroundColor: row.original.color || "#3b82f6" }}
      ></span>
    ),
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => (
      <Link href={`/subjects/${row.original.id}`}>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </Link>
    ),
  },
];
