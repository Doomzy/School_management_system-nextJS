"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type Book = {
  id: string;
  title: string;
  author: string | null;
  isbn: string | null;
  subject: string | null;
  publisher: string | null;
  edition: string | null;
  totalQuantity: number;
  availableQty: number;
  issuedQty: number;
  level: string;
};

export const booksColumns: ColumnDef<Book>[] = [
  {
    header: "Book Details",
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-medium text-gray-900">
          {row.original.title}
        </p>
        <p className="text-sm text-gray-500">{row.original.author}</p>
        <p className="text-xs text-gray-400 mt-1">ISBN: {row.original.isbn}</p>
      </div>
    ),
  },
  {
    header: "Level/Subject",
    cell: ({ row }) => (
      <div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-1">
          {row.original.level}
        </span>
        <p className="text-sm text-gray-600 mt-1">{row.original.subject}</p>
      </div>
    ),
  },
  {
    header: "Inventory",
    cell: ({ row }) => (
      <div className="text-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-gray-500">Total:</span>
          <span className="font-medium">{row.original.totalQuantity}</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-green-600">Available:</span>
          <span className="font-medium">{row.original.availableQty}</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-yellow-600">Issued:</span>
          <span className="font-medium">{row.original.issuedQty}</span>
        </div>
      </div>
    ),
  },
  {
    header: "Availability",
    cell: ({ row }) => {
      const percentage =
        (row.original.availableQty / row.original.totalQuantity) * 100;
      const barColor =
        percentage >= 50
          ? "bg-green-500"
          : percentage >= 20
          ? "bg-yellow-500"
          : "bg-red-500";
      return (
        <>
          <div>{percentage}%</div>
          <div className="max-w-32 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${barColor}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
