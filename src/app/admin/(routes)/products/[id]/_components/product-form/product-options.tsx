import React from "react"
import { useFieldArray, useFormContext } from "react-hook-form"

import type { UpdateProductInput } from "~/types"
import { cn, generateId } from "~/lib/utils"
import { Button, buttonVariants } from "~/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card"
import { Label } from "~/components/ui/label"
import { Sortable } from "~/components/ui/sortable"
import { Icons } from "~/components/icons"

import { ProductOption } from "./product-option"

export const ProductOptions = () => {
  const form = useFormContext<UpdateProductInput>()

  const { append: addOption } = useFieldArray({
    control: form.control,
    name: "options",
  })

  const { options } = form.watch()

  return (
    <div className="space-y-2">
      <Label>
        Product Options
        <HoverCard openDelay={100}>
          <HoverCardTrigger
            className={cn(
              buttonVariants({
                variant: "secondary",
                size: "icon",
                className:
                  "ml-2 size-4 rounded-full text-xs text-muted-foreground",
              })
            )}
          >
            {"?"}
          </HoverCardTrigger>
          <HoverCardContent className="text-xs">
            Options are used to define the color, size, etc. of the product.
          </HoverCardContent>
        </HoverCard>
      </Label>
      <div className="grid divide-y rounded-md border">
        {options.length > 0 ? (
          <Sortable
            value={options}
            onValueChange={(opts) => {
              const newOptions = opts.map((option) => ({
                ...option,
                rank: opts.findIndex((o) => o.id === option.id) + 1,
              }))
              form.setValue("options", newOptions)
            }}
            overlay={
              <div className="h-[102px] w-full rounded-md border bg-secondary/40 shadow-sm drop-shadow-sm backdrop-blur-sm" />
            }
          >
            <div className="grid divide-y overflow-hidden rounded-t-md">
              {options.map((option, idx) => (
                <ProductOption
                  key={option.id}
                  control={form.control}
                  optionIndex={idx}
                  optionId={option.id}
                  defaultExpanded={!option.title}
                />
              ))}
            </div>
          </Sortable>
        ) : null}
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className={cn(options.length && "rounded-t-none")}
          onClick={() => {
            const newOptionId = generateId({ prefix: "opt" })
            addOption({
              id: newOptionId,
              title: "",
              rank: options.length + 1,
              values: [
                {
                  id: generateId({ prefix: "optval" }),
                  value: "",
                  rank: 1,
                  optionId: newOptionId,
                },
              ],
            })
          }}
        >
          <Icons.plus className="mr-2 size-4" />
          Add {options.length > 0 ? "another option" : "an option"}
        </Button>
      </div>
    </div>
  )
}
