import * as React from "react"
import { flexRender, type Table as TanstackTable } from "@tanstack/react-table"
import { useRouter } from "next-nprogress-bar"

import { cn } from "~/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { DataTablePagination } from "~/components/data-table/data-table-pagination"

interface DataTableProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The table instance returned from useDataTable hook with pagination, sorting, filtering, etc.
   * @type TanstackTable<TData>
   */
  table: TanstackTable<TData>

  /**
   * The floating bar to render at the bottom of the table on row selection.
   * @default null
   * @type React.ReactNode | null
   * @example floatingBar={<TasksTableFloatingBar table={table} />}
   */
  floatingBar?: React.ReactNode | null

  /**
   * The route to link to when a row is clicked.
   * @example rowLinkRoute="/admin/products"
   * @type string
   */
  rowLinkBasePath?: string

  /**
   * The key to use to identify the row in the table.
   * @default "id"
   * @example rowIdentifierKey="id"
   * @type string
   */
  rowIdentifierKey?: keyof TData

  /**
   * The key to use to identify the row in the table.
   * @default "title"
   * @example rowLinkCell="title"
   * @type string
   */
  rowLinkCell?: keyof TData
}

export function DataTable<TData>({
  table,
  floatingBar = null,
  children,
  className,
  rowLinkBasePath,
  rowIdentifierKey,
  rowLinkCell,
  ...props
}: DataTableProps<TData>) {
  const router = useRouter()
  return (
    <div className={cn("w-full space-y-2.5", className)} {...props}>
      {children}
      <div className="overflow-hidden rounded-md border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        rowLinkCell === cell.column.id
                          ? "cursor-pointer"
                          : "cursor-default"
                      )}
                      onClick={() => {
                        if (rowLinkCell !== cell.column.id) {
                          return
                        } else if (
                          table.getIsSomeRowsSelected() ||
                          table.getIsAllRowsSelected()
                        ) {
                          row.toggleSelected(!row.getIsSelected())
                        } else if (rowLinkBasePath && rowIdentifierKey) {
                          router.push(
                            `${rowLinkBasePath}/${row.original[rowIdentifierKey as keyof TData]}`
                          )
                        }
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} />
        {table.getFilteredSelectedRowModel().rows.length > 0 && floatingBar}
      </div>
    </div>
  )
}
