"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

import type { CompleteProduct } from "~/types"
import { cn } from "~/lib/utils"
import { updateCartItemSchema } from "~/lib/validations/cart"
import { Button } from "~/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Icons } from "~/components/icons"
import { api } from "~/trpc/react"

interface AddToCartFormProps {
  productId: string
  variantId?: string
  cartQuantity?: number
  variantRequired?: boolean
  options?: CompleteProduct["options"]
}

type Inputs = z.infer<typeof updateCartItemSchema>

export function AddToCartForm({
  productId,
  variantId,
  cartQuantity,
  variantRequired = false,
  options,
}: AddToCartFormProps) {
  const router = useRouter()
  const id = React.useId()

  const form = useForm<Inputs>({
    resolver: zodResolver(updateCartItemSchema),
    defaultValues: {
      quantity: 1,
    },
  })

  const { quantity } = form.watch()

  const increaseQuantity = () => {
    if (quantity < 10) {
      form.setValue("quantity", quantity + 1)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      form.setValue("quantity", quantity - 1)
    }
  }

  const { mutate: addToCart, isPending } = api.carts.addToCart.useMutation({
    onSuccess: () => {
      toast.success("Product added to cart")
      router.refresh()
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const onAddToCart = (values: Inputs) => {
    if (variantRequired) {
      if (!options || options.length === 0) return ""

      const opts = options
        .map(({ title }) => title.charAt(0).toUpperCase() + title.slice(1))
        .join(", ")
        .replace(/, ([^,]*)$/, " & $1")

      toast.info(`Please select ${opts} to proceed.`)
      return
    }
    addToCart({
      productId,
      variantId: variantId ?? null,
      quantity: values.quantity,
    })
  }

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col space-y-4 lg:space-y-6")}
        onSubmit={form.handleSubmit(onAddToCart)}
      >
        <div className="flex items-center space-x-4">
          <div className="flex w-max items-center rounded-md border">
            <button
              id={`${id}-decrement`}
              type="button"
              onClick={decreaseQuantity}
              disabled={quantity <= 1 || isPending}
              className="flex size-9 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring active:scale-90 disabled:pointer-events-none disabled:opacity-30 lg:size-12"
            >
              <Icons.chevronLeft
                className="size-3.5 lg:size-4"
                aria-hidden="true"
              />
              <span className="sr-only">Remove one item</span>
            </button>
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="sr-only">Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      className="h-9 w-14 rounded-none border-x-0 border-none text-center shadow-none"
                      {...field}
                      disabled={isPending}
                      onBlur={(e) => {
                        const value = parseInt(e.target.value)
                        if (value > 10) {
                          form.setValue("quantity", 10)
                        } else if (value < 1) {
                          form.setValue("quantity", 1)
                        } else {
                          form.setValue("quantity", 1)
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button
              id={`${id}-increment`}
              type="button"
              onClick={increaseQuantity}
              disabled={quantity >= 10 || isPending}
              className="flex size-9 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring active:scale-90 disabled:pointer-events-none disabled:opacity-30 lg:size-12"
            >
              <Icons.chevronRight
                className="size-3.5 lg:size-4"
                aria-hidden="true"
              />
              <span className="sr-only">Add one item</span>
            </button>
          </div>
          {cartQuantity ? (
            <div className="inline-flex items-center gap-2 text-sm text-emerald-500">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-400"></span>
              </span>
              {cartQuantity + ` item${cartQuantity > 1 ? "s" : ""}`} in cart
            </div>
          ) : null}
        </div>
        <div className="flex flex-col items-center space-y-2 sm:space-y-3">
          <Button
            type="submit"
            variant="secondary"
            size="lg"
            className="w-full border dark:border-primary/10 lg:h-12"
            disabled={isPending}
            loading={isPending}
          >
            Add to cart
          </Button>
          <Button
            type="button"
            aria-label="Buy now"
            className="w-full lg:h-12"
            size="lg"
            disabled={isPending}
          >
            Buy now
          </Button>
        </div>
      </form>
    </Form>
  )
}
