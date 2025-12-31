import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ChevronRightCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ExpandableTableColumn<T> {
  id: string;
  header: string;
  accessor: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface ExpandableTableProps<T, K> {
  data: T[];
  columns: ExpandableTableColumn<T>[];
  expandedRows: string[];
  onRowToggle: (rowId: string) => void;
  getRowId: (row: T) => string;
  getSubRows?: (row: T) => K[] | undefined;
  subColumns?: ExpandableTableColumn<K>[];
  extraRowRenderer?: () => React.ReactNode;
}

export function ExpandableTable<T, K = any>({
  data,
  columns,
  expandedRows,
  onRowToggle,
  getRowId,
  getSubRows,
  subColumns,
  extraRowRenderer,
}: ExpandableTableProps<T, K>) {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.id}
                className={cn("font-medium", column.headerClassName)}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => {
            const rowId = getRowId(row);
            const isExpanded = expandedRows.includes(rowId);
            const subRows = getSubRows?.(row);

            return (
              <Collapsible key={rowId} asChild>
                <>
                  <CollapsibleTrigger
                    className="cursor-pointer"
                    onClick={() => onRowToggle(rowId)}
                    asChild
                  >
                    <TableRow>
                      {columns.map((column, index) => (
                        <TableCell key={`${rowId}-${column.id}`}>
                          <div
                            className={cn(
                              column.className,
                              index === 0 && "flex items-center gap-2"
                            )}
                          >
                            {index === 0 && (
                              <ChevronRightCircle
                                className={cn(
                                  "h-5 w-5 transition-transform",
                                  isExpanded ? "rotate-90" : ""
                                )}
                              />
                            )}
                            {column.accessor(row)}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  </CollapsibleTrigger>
                  {subRows && subColumns && (
                    <CollapsibleContent asChild>
                      <>
                        {subRows.map((subRow, subIndex) => (
                          <TableRow
                            key={`${rowId}-sub-${subIndex}`}
                            className="bg-muted/50 hover:bg-muted"
                          >
                            {subColumns.map((column) => (
                              <TableCell
                                key={`${rowId}-${column.id}-sub-${subIndex}`}
                                className={cn(column.className)}
                              >
                                {column.accessor(subRow)}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </>
                    </CollapsibleContent>
                  )}
                </>
              </Collapsible>
            );
          })}
          {extraRowRenderer && (
            <TableRow className="mt-2 font-bold hover:bg-muted">
              {extraRowRenderer()}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
