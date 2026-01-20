"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

export type TeacherTable = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  subject: {
    name: string;
  } | null;
};

export const teachersColumns: ColumnDef<TeacherTable>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => row.original.subject?.name || "N/A",
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => (
      <Link href={`/teachers/${row.original.id}`}>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </Link>
    ),
  },
];
