import React from "react"
import Image from "next/image"
import { useFormContext } from "react-hook-form"

import { cn } from "~/lib/utils"
import { Badge } from "~/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { FormControl, FormField, FormItem } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Icons } from "~/components/icons"
import { ImageSelectModal } from "~/components/image-select-modal"
import type { UpdateProductInput } from "~/types"

import { ProductOptions } from "./product-options"

export const ProductVariantsForm = () => {
  const form = useFormContext<UpdateProductInput>()
  const { variants } = form.watch()

  const hasVariantFieldValue = React.useMemo(() => {
    return variants.some(
      ({ optionValues, createdAt }) =>
        optionValues?.some(({ value }) => !!value) || !!createdAt
    )
  }, [variants])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Variants</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <ProductOptions />
          {hasVariantFieldValue ? (
            <div className="grid overflow-hidden rounded-lg border">
              <div className="grid grid-cols-4 gap-2 border-b bg-muted/50 px-6 py-4 text-sm font-medium">
                <p className="col-span-2">Variant</p>
                <p>Price</p>
                <p>Available</p>
              </div>
              <div className="grid divide-y rounded-lg">
                {variants.map(({ optionValues, createdAt }, variantIndex) => {
                  const hasValue =
                    optionValues?.some(({ value }) => !!value) || !!createdAt
                  if (hasValue)
                    return (
                      <div
                        key={variantIndex}
                        className="grid gap-4 p-6 md:grid-cols-4"
                      >
                        <div className="col-span-2 flex items-center gap-4">
                          <FormField
                            control={form.control}
                            name={`variants.${variantIndex}.image`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <ImageSelectModal
                                    onValueChange={(images) =>
                                      field.onChange(
                                        images.length > 0 ? images[0] : null
                                      )
                                    }
                                    value={field.value ? [field.value] : []}
                                    multiple={false}
                                    trigger={
                                      <button
                                        type="button"
                                        className="relative flex size-12 items-center justify-center rounded-md border border-dashed border-primary/40 p-px text-muted-foreground hover:border-primary"
                                      >
                                        {field.value ? (
                                          <div className="relative size-full">
                                            <Image
                                              src={field.value.url}
                                              alt={field.value.name}
                                              fill
                                              className="rounded-md object-cover"
                                            />
                                          </div>
                                        ) : (
                                          <Icons.imagePlus className="size-6" />
                                        )}
                                      </button>
                                    }
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <div className="flex flex-wrap items-center gap-1.5">
                            {optionValues?.map(({ value }, idx) => {
                              if (value)
                                return (
                                  <Badge
                                    key={idx}
                                    variant={"secondary"}
                                    className="px-2"
                                  >
                                    {value}
                                  </Badge>
                                )
                            })}
                          </div>
                        </div>
                        <FormField
                          control={form.control}
                          name={`variants.${variantIndex}.price`}
                          render={({ field, fieldState }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={form.getValues(
                                    `variants.${variantIndex}.price`
                                  )}
                                  type="number"
                                  inputMode="numeric"
                                  placeholder="Enter price"
                                  className={cn(
                                    "bg-background",
                                    fieldState.error &&
                                      "border-destructive focus-visible:ring-destructive"
                                  )}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`variants.${variantIndex}.inventoryQuantity`}
                          render={({ field, fieldState }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={form.getValues(
                                    `variants.${variantIndex}.inventoryQuantity`
                                  )}
                                  type="number"
                                  className={cn(
                                    "bg-background",
                                    fieldState.error &&
                                      "border-destructive focus-visible:ring-destructive"
                                  )}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    )
                })}
              </div>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
