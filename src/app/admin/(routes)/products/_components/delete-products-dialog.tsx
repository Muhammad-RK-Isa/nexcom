"use client";

import * as React from "react";
import { toast } from "sonner";
import { useRouter } from "next-nprogress-bar";

import { type TableProduct } from "~/types";
import { ReloadIcon, TrashIcon } from "@radix-ui/react-icons";
import { type Row } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { api } from "~/trpc/react";

interface DeleteProductsDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  products: Row<TableProduct>["original"][];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteProductsDialog({
  products,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteProductsDialogProps) {
  const router = useRouter();

  const { mutate, isPending } = api.products.deleteProducts.useMutation({
    onSuccess: () => {
      const message =
        products.length > 1
          ? `${products.length} products deleted`
          : "One product delted";
      toast.success(message);
      onSuccess?.();
      router.refresh();
    },
  });

  return (
    <Dialog {...props}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
            Delete ({products.length})
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your{" "}
            <span className="font-medium">{products.length}</span>
            {products.length === 1 ? "product" : "products"} from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:space-x-0">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={() => mutate(products.map(({ id }) => ({ id })))}
            disabled={isPending}
          >
            {isPending && (
              <ReloadIcon
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
