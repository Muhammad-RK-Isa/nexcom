"use client";

import { DownloadIcon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";

import { Button, buttonVariants } from "~/components/ui/button";
import { exportTableToCSV } from "~/lib/export";
import { DeleteProductsDialog } from "./delete-products-dialog";
import type { TableProduct } from "~/types";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { Icons } from "~/components/icons";

interface TasksTableToolbarActionsProps {
  table: Table<TableProduct>;
}

export function TasksTableToolbarActions({
  table,
}: TasksTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteProductsDialog
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
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "tasks",
            excludeColumns: ["select", "actions"],
          })
        }
      >
        <DownloadIcon className="mr-2 size-4" aria-hidden="true" />
        Export
      </Button>
      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  );
}
