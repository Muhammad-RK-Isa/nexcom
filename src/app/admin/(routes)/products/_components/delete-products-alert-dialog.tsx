"use client";

import * as React from "react";
import { toast } from "sonner";
import { useRouter } from "next-nprogress-bar";

import { type TableProduct } from "~/types";
import { ReloadIcon } from "@radix-ui/react-icons";
import { type Row } from "@tanstack/react-table";
import { Button, buttonVariants } from "~/components/ui/button";
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
import { api } from "~/trpc/react";
import { Icons } from "~/components/icons";
import { cn } from "~/lib/utils";

interface DeleteProductsAlertDialogProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialog> {
  products: Row<TableProduct>["original"][];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteProductsAlertDialog({
  products,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteProductsAlertDialogProps) {
  const router = useRouter();

  const { mutate, isPending } = api.products.deleteProducts.useMutation({
    onSuccess: () => {
      const message =
        products.length > 1
          ? `${products.length} products deleted`
          : "One product deleted";
      toast.success(message);
      onSuccess?.();
      router.refresh();
    },
  });

  return (
    <AlertDialog {...props}>
      {showTrigger ? (
        <AlertDialogTrigger
          className={cn(buttonVariants({ variant: "destructive", size: "sm" }))}
        >
          <Icons.trash className="mr-2 size-4" aria-hidden="true" />
          Delete ({products.length})
        </AlertDialogTrigger>
      ) : null}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <span className="font-medium">{products.length}</span>
            {products.length === 1 ? " product" : " products"}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:space-x-0">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={() => mutate(products.map(({ id }) => ({ id })))}
            loading={isPending}
            loadingText="Deleting"
            disabled={isPending}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
