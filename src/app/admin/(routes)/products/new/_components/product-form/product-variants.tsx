import React from "react"
import Image from "next/image"
import { useFieldArray, useFormContext } from "react-hook-form"

import type { CreateProductInput } from "~/types"
import { cn, generateId } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Label } from "~/components/ui/label"
import { Icons } from "~/components/icons"
import { ImageSelectModal } from "~/components/image-select-modal"

import { ProductOptions } from "./product-options"
import ProductVariant from "./product-variant"

export const ProductVariantsForm = () => {
  const form = useFormContext<CreateProductInput>()
  const { variants, options } = form.watch()

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
                  key={idx}
                  control={form.control}
                  variantIndex={idx}
                  defaultExpanded={!variant.title}
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
                    title: "",
                    price: 0,
                    inventoryQuantity: 0,
                    manageInventory: true,
                    allowBackorder: false,
                    image: null,
                    options: [],
                    weight: {
                      value: 0,
                      unit: "kg",
                    },
                    width: {
                      value: 0,
                      unit: "m",
                    },
                    height: {
                      value: 0,
                      unit: "m",
                    },
                    length: {
                      value: 0,
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
