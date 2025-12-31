"use client";

import { ExpandableTableColumn } from "@/components/extendable-table";
import { CellAction } from "./cell-action";
import { ColumnDef } from "@tanstack/react-table";

export type Class = {
  id: string;
  yearId: string;
  section: string;
  name: string;
  capacity: number;
  roomNumber: string | null;
  students: Student[];
};

export const classColumns: ColumnDef<Class>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "section",
    header: "Section",
  },
  {
    accessorKey: "roomNumber",
    header: "Room Number",
  },
  {
    accessorKey: "capacity",
    header: "Capacity",
    cell: ({ row }) =>
      `${row.original.students.length}/${row.original.capacity}`,
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

export type Student = {
  firstName: string;
  lastName: string;
  phone: string | null;
};

export const studentColumns: ColumnDef<Student>[] = [
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
];
