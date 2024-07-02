"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

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

interface AddToCartFormProps {
  productId: string
}

type Inputs = z.infer<typeof updateCartItemSchema>

export function AddToCartForm({ productId }: AddToCartFormProps) {
  const id = React.useId()
  const router = useRouter()

  // react-hook-form
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

  return (
    <Form {...form}>
      <form className={cn("flex flex-col space-y-4")}>
        <div className="flex w-max items-center rounded-md border">
          <button
            id={`${id}-decrement`}
            type="button"
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
            className="flex size-10 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-accent/60 active:scale-90 disabled:pointer-events-none disabled:opacity-50"
          >
            <Icons.chevronLeft className="size-3.5" aria-hidden="true" />
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
                    className="w-14 rounded-none border-x-0 border-none text-center shadow-none"
                    {...field}
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
            disabled={quantity >= 10}
            className="flex size-10 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-accent/60 active:scale-90 disabled:pointer-events-none disabled:opacity-50"
          >
            <Icons.chevronRight className="size-3.5" aria-hidden="true" />
            <span className="sr-only">Add one item</span>
          </button>
        </div>
        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <Button
            type="button"
            aria-label="Buy now"
            className="w-full"
            size="lg"
          >
            Buy now
          </Button>
          <Button
            type="submit"
            variant="secondary"
            size="lg"
            className="w-full border"
            aria-label="Add to cart"
          >
            Add to cart
          </Button>
        </div>
      </form>
    </Form>
  )
}
