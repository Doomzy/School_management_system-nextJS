"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

interface DataTableProps<TData, TValue = any> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  disablePagination?: boolean;
  /** When true, clicking a row will highlight it (single select). */
  highlightOnClick?: boolean;
  /** Optional function to derive a stable id for each row. Falls back to TanStack row.id. */
  getRowId?: (row: TData) => string;
  /** Controlled selected row id. If provided, component is controlled for selection. */
  selectedRowId?: string | null;
  /** Called when selected row changes (for controlled usage) or on internal change. */
  onSelectedRowIdChange?: (id: string | null) => void;
  pageSizeOptions?: number[];
  enableSorting?: boolean;
  enableGlobalFilter?: boolean;
  onRowClick?: (row: TData) => void;
}

export function DataTable<TData, TValue = any>({
  columns,
  data,
  disablePagination = false,
  highlightOnClick = false,
  getRowId,
  selectedRowId: controlledSelectedRowId,
  onSelectedRowIdChange,
  pageSizeOptions = [10, 25, 50],
  enableSorting = true,
  enableGlobalFilter = true,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [internalSelectedRowId, setInternalSelectedRowId] = React.useState<
    string | null
  >(null);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: disablePagination
      ? undefined
      : getPaginationRowModel(),
    debugTable: false,
    // keep sorting toggle when disabled by prop
    enableSorting: enableSorting,
  });

  return (
    <div className="rounded-md border bg-card">
      <div className="flex items-center justify-between gap-2 p-2">
        {enableGlobalFilter && (
          <div className="flex items-center gap-2 w-full max-w-md">
            <Input
              placeholder="Search..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-full"
            />
          </div>
        )}

        {!disablePagination && (
          <div className="flex items-center gap-2">
            <Select onValueChange={(v) => table.setPageSize(Number(v))}>
              <SelectTrigger size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((o) => (
                  <SelectItem key={o} value={String(o)}>
                    {o} / page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();
                return (
                  <TableHead
                    key={header.id}
                    className="select-none"
                    onClick={
                      canSort
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {enableSorting && (
                        <span className="opacity-70">
                          {header.column.getIsSorted() ? (
                            header.column.getIsSorted() === "asc" ? (
                              <span>▲</span>
                            ) : (
                              <span>▼</span>
                            )
                          ) : (
                            <ArrowUpDown className="size-4 opacity-60" />
                          )}
                        </span>
                      )}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => {
              const rowId = getRowId ? getRowId(row.original) : String(row.id);
              const selected = controlledSelectedRowId ?? internalSelectedRowId;

              return (
                <TableRow
                  key={row.id}
                  className={`cursor-pointer ${
                    selected === rowId ? "bg-accent hover:bg-accent/60" : ""
                  }`}
                  onClick={() => {
                    if (highlightOnClick) {
                      if (onSelectedRowIdChange) onSelectedRowIdChange(rowId);
                      else setInternalSelectedRowId(rowId);
                    }

                    if (onRowClick) onRowClick(row.original);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No results.
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {!disablePagination && (
        <div className="flex items-center justify-between gap-2 px-2 py-3">
          <div className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="text-sm text-muted-foreground">
            {table.getRowModel().rows.length} rows
          </div>
        </div>
      )}
    </div>
  );
}

/*
Usage example:

import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"

type Person = { id: string; name: string; email: string }

const columns: ColumnDef<Person>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
]

<DataTable columns={columns} data={people} onRowClick={(r) => console.log(r)} />

*/
