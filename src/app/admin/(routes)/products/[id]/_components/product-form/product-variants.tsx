import React from "react"
import { useFieldArray, useFormContext } from "react-hook-form"

import type { UpdateProductInput } from "~/types"
import { cn, generateId } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Label } from "~/components/ui/label"
import { Icons } from "~/components/icons"

import { ProductOptions } from "./product-options"
import ProductVariant from "./product-variant"

export const ProductVariantsForm = () => {
  const form = useFormContext<UpdateProductInput>()
  const { variants, options, price, inventoryQuantity } = form.watch()

  const { append: addVariant } = useFieldArray({
    control: form.control,
    name: "variants",
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Variants</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <ProductOptions />
          <div className="space-y-2">
            <Label>Product Variants {`(${variants.length})`}</Label>
            <div className="grid divide-y rounded-md border">
              {variants.map((variant, idx) => (
                <ProductVariant
                  key={variant.id}
                  variantId={variant.id}
                  control={form.control}
                  variantIndex={idx}
                  defaultExpanded={!variant?.title}
                />
              ))}
              <Button
                type="button"
                variant="secondary"
                size="lg"
                className={cn(variants.length && "rounded-t-none")}
                disabled={!options.length}
                onClick={() =>
                  options.length &&
                  addVariant({
                    id: generateId({ prefix: "variant" }),
                    title: "",
                    price,
                    inventoryQuantity,
                    manageInventory: true,
                    allowBackorder: false,
                    image: null,
                    options: [],
                    weight: {
                      value: undefined,
                      unit: "kg",
                    },
                    length: {
                      value: undefined,
                      unit: "m",
                    },
                    height: {
                      value: undefined,
                      unit: "m",
                    },
                    width: {
                      value: undefined,
                      unit: "m",
                    },
                  })
                }
              >
                <Icons.plus className="mr-2 size-4" />
                Add Variant
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
