"use client";

import { type ColumnDef } from "@tanstack/react-table";
import * as React from "react";

import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { formatDate } from "~/lib/utils";

import { useRouter } from "next-nprogress-bar";
import { toast } from "sonner";
import { Icons } from "~/components/icons";
import { Badge } from "~/components/ui/badge";
import { productStatuses } from "~/schemas";
import { api } from "~/trpc/react";
import { type TableProduct } from "~/types";
import { getStatusIcon } from "../_lib/utils";
import { DeleteProductsAlertDialog } from "./delete-products-alert-dialog";

export function getColumns(): ColumnDef<TableProduct>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <div className="grid">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className=""
          />
        </div>
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ cell }) => (
        <div className="max-w-96 truncate font-medium">
          {cell.getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.original.status;

        const Icon = getStatusIcon(status);

        return (
          <Badge
            variant={status === "active" ? "secondary" : "outline"}
            className="flex w-max items-center py-1"
          >
            <Icon className="mr-1.5 size-3.5" aria-hidden="true" />
            <span className="capitalize">{status}</span>
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Price" />
      ),
    },
    {
      accessorKey: "mrp",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="MRP" />
      ),
    },
    {
      accessorKey: "inventoryQuantity",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Stock" />
      ),
      cell: ({ cell }) => {
        const stockQuantity = cell.getValue() as number;
        return (
          <Badge variant={stockQuantity > 0 ? "secondary" : "outline"}>
            {stockQuantity > 0 ? `${stockQuantity} in stock` : "Out of stock"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "allowBackorder",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Backorder" />
      ),
      cell: ({ cell }) => (
        <Badge variant={(cell.getValue() as Boolean) ? "secondary" : "outline"}>
          {(cell.getValue() as Boolean) ? "Allowed" : "Not allowed"}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue() as Date),
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Updated At" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue() as Date),
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const router = useRouter();

        const [showDeleteProductAlertDialog, setShowDeleteProductAlertDialog] =
          React.useState(false);

        const { mutate: updateProductStatus, isPending: isUpdating } =
          api.products.updateProductStatus.useMutation({
            onSuccess: () => {
              toast.success("Product status changed");
              setShowDeleteProductAlertDialog(false);
              router.refresh();
            },
            onError: (err) => {
              toast.error(err.message);
            },
          });

        return (
          <React.Fragment>
            <DeleteProductsAlertDialog
              open={showDeleteProductAlertDialog}
              onOpenChange={setShowDeleteProductAlertDialog}
              products={[row.original]}
              showTrigger={false}
              onSuccess={() => row.toggleSelected(false)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Open menu"
                  variant="ghost"
                  className="flex size-8 p-0 data-[state=open]:bg-muted"
                >
                  <Icons.ellipsisHorizontal
                    className="size-4"
                    aria-hidden="true"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onSelect={() =>
                    router.push(`/admin/products/${row.original.id}`)
                  }
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuRadioGroup
                        value={row.original.status}
                        onValueChange={(value) => {
                          const status = productStatuses.parse(value);
                          updateProductStatus({ id: row.original.id, status });
                        }}
                      >
                        {Object.values(productStatuses.Values).flatMap(
                          (status) => (
                            <DropdownMenuRadioItem
                              key={status}
                              value={status}
                              className="flex capitalize"
                              disabled={isUpdating}
                            >
                              {status}
                              {isUpdating ? (
                                <Icons.spinner className="ml-2 size-5" />
                              ) : null}
                            </DropdownMenuRadioItem>
                          ),
                        )}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => setShowDeleteProductAlertDialog(true)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </React.Fragment>
        );
      },
    },
  ];
}
