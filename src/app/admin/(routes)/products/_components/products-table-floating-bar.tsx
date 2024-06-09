import * as React from "react";

import { SelectTrigger } from "@radix-ui/react-select";
import { type Table } from "@tanstack/react-table";
import { toast } from "sonner";

import { exportTableToCSV } from "~/lib/export";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Kbd } from "~/components/kbd";
import type { TableProduct } from "~/types";
import { productStatuses } from "~/schema";
import { api } from "~/trpc/react";
import { useRouter } from "next-nprogress-bar";
import { Icons } from "~/components/icons";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

interface ProductsTableFloatingBarProps {
  table: Table<TableProduct>;
}

export function ProductsTableFloatingBar({
  table,
}: ProductsTableFloatingBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;

  const router = useRouter();

  const [showDeleteProductAlertDialog, setShowDeleteProductAlertDialog] =
    React.useState(false);
  const [isExporting, startExport] = React.useTransition();

  const { mutate: updateProductsStatus, isPending: isUpdating } =
    api.products.updateProductsStatus.useMutation({
      onSuccess: () => {
        const message =
          rows.length > 1
            ? `${rows.length} products updated`
            : "One product updated";
        toast.success(message);
        router.refresh();
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });

  const { mutate: deleteProducts, isPending: isDeleting } =
    api.products.deleteProducts.useMutation({
      onSuccess: () => {
        const message =
          rows.length > 1
            ? `${rows.length} products deleted`
            : "One product deleted";
        toast.success(message);
        table.toggleAllRowsSelected(false);
        setShowDeleteProductAlertDialog(false);
        router.refresh();
      },
    });

  // Clear selection on Escape key press
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        table.toggleAllRowsSelected(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [table]);

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 mx-auto w-fit px-4">
      <div className="w-full overflow-x-auto">
        <div className="mx-auto flex w-fit items-center gap-2 rounded-md border bg-card p-2 shadow-2xl">
          <div className="flex h-7 items-center rounded-md border border-dashed pl-2.5 pr-1">
            <span className="whitespace-nowrap text-xs">
              {rows.length} selected
            </span>
            <Separator orientation="vertical" className="ml-2 mr-1" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-5 hover:border"
                  onClick={() => table.toggleAllRowsSelected(false)}
                >
                  <Icons.multiply
                    className="size-3.5 shrink-0"
                    aria-hidden="true"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="flex items-center border bg-accent px-2 py-1 font-semibold text-foreground dark:bg-zinc-900">
                <p className="mr-2">Clear selection</p>
                <Kbd abbrTitle="Escape" variant="outline">
                  Esc
                </Kbd>
              </TooltipContent>
            </Tooltip>
          </div>
          <Separator orientation="vertical" className="hidden h-5 sm:block" />
          <div className="flex items-center gap-1.5">
            <Select
              onValueChange={(value: TableProduct["status"]) => {
                updateProductsStatus({
                  productIds: rows.map((row) => ({ id: row.original.id })),
                  status: value,
                });
              }}
            >
              <Tooltip delayDuration={250}>
                <SelectTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="size-7 border data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <Icons.spinner
                          className="size-3.5"
                          aria-hidden="true"
                        />
                      ) : (
                        <Icons.checkCircle
                          className="size-3.5"
                          aria-hidden="true"
                        />
                      )}
                    </Button>
                  </TooltipTrigger>
                </SelectTrigger>
                <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
                  <p>Update status</p>
                </TooltipContent>
              </Tooltip>
              <SelectContent align="center">
                <SelectGroup>
                  {Object.values(productStatuses.Values).map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="capitalize"
                    >
                      {status}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Tooltip delayDuration={250}>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="size-7 border"
                  onClick={() => {
                    startExport(() => {
                      exportTableToCSV(table, {
                        excludeColumns: ["select", "actions"],
                        onlySelected: true,
                        filename: "products",
                      });
                    });
                  }}
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <Icons.spinner className="size-3.5" aria-hidden="true" />
                  ) : (
                    <Icons.download className="size-3.5" aria-hidden="true" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
                <p>Export Products</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip delayDuration={250}>
              <TooltipTrigger asChild>
                <AlertDialog
                  open={showDeleteProductAlertDialog}
                  onOpenChange={setShowDeleteProductAlertDialog}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="size-7 border"
                      disabled={isDeleting}
                    >
                      <Icons.trash className="size-3.5" aria-hidden="true" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete{" "}
                        <span className="font-medium">{rows.length}</span>
                        {rows.length === 1 ? " product" : " products"}.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 sm:space-x-0">
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <Button
                        variant="destructive"
                        onClick={() =>
                          deleteProducts(
                            rows.map((row) => ({ id: row.original.id })),
                          )
                        }
                        loading={isDeleting}
                        disabled={isDeleting}
                      >
                        Delete
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TooltipTrigger>
              <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
                <p>Delete Products</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
