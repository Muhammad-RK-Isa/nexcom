"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { type Table } from "@tanstack/react-table"

import type { TableProduct } from "~/types"
import { exportTableToCSV } from "~/lib/export"
import { cn } from "~/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog"
import { Button, buttonVariants } from "~/components/ui/button"
import { DateRangePicker } from "~/components/date-range-picker"
import { Icons } from "~/components/icons"

import { DeleteProductsAlertDialog } from "./delete-products-alert-dialog"

interface ProductsTableToolbarActionsProps {
  table: Table<TableProduct>
}

export function ProductsTableToolbarActions({
  table,
}: ProductsTableToolbarActionsProps) {
  const searchParams = useSearchParams()

  const search = {
    from: searchParams.get("from"),
    to: searchParams.get("to"),
  }

  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteProductsAlertDialog
          products={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <Link
        href="/admin/products/new"
        className={cn(buttonVariants({ variant: "default", size: "sm" }))}
      >
        <Icons.plus className="mr-2 size-4" />
        Add new
      </Link>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Icons.upload className="mr-2 size-4" aria-hidden="true" />
            Export
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Export products?</AlertDialogTitle>
            <AlertDialogDescription>
              Export products to CSV file
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                exportTableToCSV(table, {
                  filename: "products",
                  excludeColumns: ["select", "actions"],
                })
              }
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DateRangePicker
        triggerSize="sm"
        triggerClassName="ml-auto w-56 sm:w-60"
        align="end"
        dateRange={
          search.from && search.to
            ? { from: new Date(search.from), to: new Date(search.to) }
            : undefined
        }
      />
    </div>
  )
}
