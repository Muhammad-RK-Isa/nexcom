import React from "react"
import { useFieldArray, useFormContext } from "react-hook-form"

import type { UpdateProductInput } from "~/types"
import { generateId } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Sortable } from "~/components/ui/sortable"
import { Icons } from "~/components/icons"

import { generateVariants } from "../_lib/utils"
import { ProductOption } from "./product-option"

export const ProductOptions = () => {
  const form = useFormContext<UpdateProductInput>()

  const { append: addOption } = useFieldArray({
    control: form.control,
    name: "options",
  })

  const { price, inventoryQuantity, options, variants } = form.watch()

  const updateVariants = React.useCallback(() => {
    const newVariants = generateVariants({
      options,
      existingVariants: variants,
      price,
      inventoryQuantity,
    })
    form.setValue("variants", newVariants, { shouldDirty: true })
    form.register("variants")
  }, [inventoryQuantity, options, variants, form, price])

  return (
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
                updateVariants={() => updateVariants()}
                defaultExpanded={!option.title}
              />
            ))}
          </div>
        </Sortable>
      ) : null}
      <Button
        type="button"
        variant={"link"}
        className="rounded-t-none bg-muted/40 py-6"
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
          updateVariants()
        }}
      >
        <Icons.plus className="mr-2 size-4" />
        Add {options.length > 0 ? "another option" : "an option"}
      </Button>
    </div>
  )
}
