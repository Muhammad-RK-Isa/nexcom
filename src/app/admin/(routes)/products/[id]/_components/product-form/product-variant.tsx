import React from "react"
import Image from "next/image"
import { ImageSelectModal } from "~/features/images/components/image-select-modal"
import { useFieldArray, useFormContext, type Control } from "react-hook-form"

import type { UpdateProductInput } from "~/types"
import { cn } from "~/lib/utils"
import { sizeUnits, weightUnits } from "~/lib/validations/product"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion"
import { Badge } from "~/components/ui/badge"
import { Button, buttonVariants } from "~/components/ui/button"
import { Checkbox } from "~/components/ui/checkbox"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card"
import { Input } from "~/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Icons } from "~/components/icons"

interface ProductVariantProps {
  control: Control<UpdateProductInput>
  variantId: string
  variantIndex: number
  defaultExpanded?: boolean
}

const ProductVariant: React.FC<ProductVariantProps> = ({
  control,
  variantId,
  variantIndex,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)

  const form = useFormContext<UpdateProductInput>()

  const options = form.watch("options")
  const variant = form.getValues("variants").find((v) => v.id === variantId)

  const { remove: removeVariant } = useFieldArray({
    control,
    name: "variants",
  })

  const handleCollapse = async () => {
    const isFilled = await form.trigger(`variants.${variantIndex}`, {
      shouldFocus: true,
    })
    if (isFilled) setIsExpanded(!isExpanded)
  }

  return (
    <div className="flex gap-4 px-6 py-6 pl-4">
      {isExpanded ? (
        <div className="flex w-full flex-col space-y-4">
          <Accordion
            type="single"
            collapsible
            defaultValue="general"
            className="w-full overflow-hidden rounded-md border bg-accent/50"
          >
            <AccordionItem value="general" className="px-4">
              <AccordionTrigger className="font-medium hover:no-underline sm:text-base">
                General
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 px-px sm:grid-cols-2">
                  <FormField
                    control={control}
                    name={`variants.${variantIndex}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Variant name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            placeholder="Black / XL"
                            className="bg-background"
                            onChange={(e) => {
                              field.onChange(e.currentTarget.value)
                              form.clearErrors(`variants.${variantIndex}.title`)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`variants.${variantIndex}.image`}
                    render={({ field }) => (
                      <FormItem className="row-span-2">
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                          <ImageSelectModal
                            {...field}
                            multiple={false}
                            value={field.value ? [field.value] : []}
                            onValueChange={(v) =>
                              field.onChange(v[0] ?? undefined)
                            }
                            trigger={
                              <button
                                type="button"
                                className="relative flex size-full h-[calc(100%-28px)] min-h-40 items-center justify-center rounded-md border border-dashed bg-background shadow-sm drop-shadow-sm transition-colors hover:border-primary sm:min-h-min"
                              >
                                {field.value ? (
                                  <Image
                                    src={field.value.url}
                                    alt="Product image"
                                    fill
                                    className="rounded-md object-cover object-top"
                                  />
                                ) : (
                                  <Icons.imagePlus className="size-8 text-muted-foreground/80" />
                                )}
                              </button>
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`variants.${variantIndex}.price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`variants.${variantIndex}.material`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Material</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            placeholder="100% Cotton"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {options.map((option, idx) => {
                    const nonEmptyValues = option.values.filter((v) => v)
                    if (nonEmptyValues.length)
                      return (
                        <FormField
                          key={idx}
                          control={form.control}
                          name={`variants.${variantIndex}.options.${idx}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{option.title}</FormLabel>
                              <Select
                                value={field.value?.[option.id] || undefined}
                                onValueChange={(v) => {
                                  field.onChange({ [option.id]: v })
                                  form.clearErrors(
                                    `variants.${variantIndex}.options.${idx}`
                                  )
                                }}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-background">
                                    <SelectValue
                                      placeholder={`Select ${option.title}`}
                                    />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {nonEmptyValues.map((v) => (
                                    <SelectItem key={v.id} value={v.id}>
                                      {v.value}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="stock-inventory" className="px-4">
              <AccordionTrigger className="font-medium hover:no-underline sm:text-base">
                Stock & Inventory
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 px-px sm:grid-cols-2">
                  <FormField
                    name={`variants.${variantIndex}.manageInventory`}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border bg-background pl-4 shadow-sm transition-all hover:bg-accent hover:text-accent-foreground sm:col-span-2">
                        <FormControl>
                          <Checkbox
                            defaultChecked={form.getValues("manageInventory")}
                            checked={field.value}
                            onCheckedChange={(v) => {
                              field.onChange(v)
                              if (Boolean(!v)) {
                                form.setValue("inventoryQuantity", 0)
                                form.setValue("allowBackorder", false)
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="flex w-full cursor-pointer items-center p-4 pl-0">
                          Manage inventory
                          <FormMessage />
                          <HoverCard openDelay={100}>
                            <HoverCardTrigger
                              className={cn(
                                buttonVariants({
                                  variant: "secondary",
                                  size: "icon",
                                  className:
                                    "ml-auto size-4 rounded-full text-xs text-muted-foreground",
                                })
                              )}
                            >
                              {"?"}
                            </HoverCardTrigger>
                            <HoverCardContent className="text-xs">
                              If checked the inventory will be managed
                              automatically when a order is fulfilled or
                              cancelled.
                            </HoverCardContent>
                          </HoverCard>
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  {form.getValues(
                    `variants.${variantIndex}.manageInventory`
                  ) ? (
                    <>
                      <FormField
                        name={`variants.${variantIndex}.allowBackorder`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border pl-4 shadow-sm transition-all hover:bg-accent hover:text-accent-foreground sm:col-span-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                defaultChecked={form.getValues(
                                  "allowBackorder"
                                )}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="w-full cursor-pointer p-4 pl-0">
                              Continue selling when out of stock
                              <FormMessage />
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        name={`variants.${variantIndex}.inventoryQuantity`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <div className="grid grid-cols-2 gap-4">
                              <Input {...field} type="number" />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  ) : null}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping" className="border-b-0 px-4">
              <AccordionTrigger className="font-medium hover:no-underline sm:text-base">
                Shipping
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 px-px sm:grid-cols-2">
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center space-x-2.5">
                      <FormField
                        name={`variants.${variantIndex}.weight.value`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight</FormLabel>
                            <Input
                              {...field}
                              value={field.value ?? undefined}
                              type="number"
                              inputMode="numeric"
                            />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name={`variants.${variantIndex}.weight.unit`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              {...field}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a unit" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.values(weightUnits.Values).map(
                                  (u, idx) => (
                                    <SelectItem key={idx} value={u}>
                                      {u}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {form.getFieldState("weight").error ? (
                      <p className="text-[0.8rem] font-medium text-destructive">
                        {
                          form.getFieldState(
                            `variants.${variantIndex}.weight.value`
                          ).error?.message
                        }
                        <br />
                        {
                          form.getFieldState(
                            `variants.${variantIndex}.weight.unit`
                          ).error?.message
                        }
                      </p>
                    ) : null}
                  </div>
                  <div className="gap2.5 flex flex-col">
                    <div className="flex items-center space-x-2.5">
                      <FormField
                        name="height.value"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Height</FormLabel>
                            <Input
                              {...field}
                              type="number"
                              inputMode="numeric"
                              value={field.value ?? undefined}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name={`variants.${variantIndex}.height.unit`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              {...field}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a unit" />
                                </SelectTrigger>
                              </FormControl>
                              <FormMessage />
                              <SelectContent>
                                {Object.values(sizeUnits.Values).map(
                                  (u, idx) => (
                                    <SelectItem key={idx} value={u}>
                                      {u}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {form.getFieldState("height").error ? (
                      <p className="text-[0.8rem] font-medium text-destructive">
                        {
                          form.getFieldState(
                            `variants.${variantIndex}.height.value`
                          ).error?.message
                        }
                        <br />
                        {
                          form.getFieldState(
                            `variants.${variantIndex}.height.unit`
                          ).error?.message
                        }
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center space-x-2.5">
                      <FormField
                        name={`variants.${variantIndex}.length.value`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Length</FormLabel>
                            <Input
                              {...field}
                              type="number"
                              value={field.value ?? undefined}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name={`variants.${variantIndex}.length.unit`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              {...field}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a unit" />
                                </SelectTrigger>
                              </FormControl>
                              <FormMessage />
                              <SelectContent>
                                {Object.values(sizeUnits.Values).map(
                                  (u, idx) => (
                                    <SelectItem key={idx} value={u}>
                                      {u}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {form.getFieldState(`variants.${variantIndex}.length`)
                      .error ? (
                      <p className="text-[0.8rem] font-medium text-destructive">
                        {
                          form.getFieldState(
                            `variants.${variantIndex}.length.value`
                          ).error?.message
                        }
                        <br />
                        {
                          form.getFieldState(
                            `variants.${variantIndex}.length.unit`
                          ).error?.message
                        }
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center space-x-2.5">
                      <FormField
                        name={`variants.${variantIndex}.width.value`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Width</FormLabel>
                            <Input
                              {...field}
                              type="number"
                              value={field.value ?? undefined}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name={`variants.${variantIndex}.width.unit`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <Select
                              {...field}
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a unit" />
                                </SelectTrigger>
                              </FormControl>
                              <FormMessage />
                              <SelectContent>
                                {Object.values(sizeUnits.Values).map(
                                  (u, idx) => (
                                    <SelectItem key={idx} value={u}>
                                      {u}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {form.getFieldState(`variants.${variantIndex}.width`)
                      .error ? (
                      <p className="text-[0.8rem] font-medium text-destructive">
                        {
                          form.getFieldState(
                            `variants.${variantIndex}.width.value`
                          ).error?.message
                        }
                        <br />
                        {
                          form.getFieldState(
                            `variants.${variantIndex}.width.unit`
                          ).error?.message
                        }
                      </p>
                    ) : null}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="flex w-full flex-row-reverse items-center gap-2">
            <Button size="sm" type="button" onClick={() => handleCollapse()}>
              Done
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="px-2"
              onClick={() => removeVariant(variantIndex)}
            >
              <Icons.trash className="mr-2 size-4" />
              Delete
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex w-full items-center space-x-2">
          <div className="flex flex-1 items-center space-x-4 text-sm">
            <FormField
              control={control}
              name={`variants.${variantIndex}.image`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageSelectModal
                      {...field}
                      multiple={false}
                      value={field.value ? [field.value] : []}
                      onValueChange={(v) => field.onChange(v[0] ?? undefined)}
                      trigger={
                        <button
                          type="button"
                          className="relative flex size-10 items-center justify-center rounded-md border border-dashed border-muted-foreground/50 transition-colors hover:border-primary"
                        >
                          {field.value ? (
                            <Image
                              src={field.value.url}
                              alt="Product image"
                              fill
                              className="rounded-md object-cover"
                            />
                          ) : (
                            <Icons.image className="size-6 text-muted-foreground" />
                          )}
                        </button>
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Badge
              variant={variant?.title ? "secondary" : "outline"}
              className="font-medium"
            >
              {variant?.title || "No title"}
            </Badge>
            <span>{variant?.inventoryQuantity} in stock</span>
          </div>
          <Button
            size="sm"
            type="button"
            variant="outline"
            className="px-2"
            onClick={() => setIsExpanded(true)}
          >
            <Icons.edit className="mr-2 size-3.5" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            type="button"
            className="px-2"
            onClick={() => removeVariant(variantIndex)}
          >
            <Icons.trash className="size-3.5" />
            <span className="sr-only">Delete variant {variant?.title}</span>
          </Button>
        </div>
      )}
    </div>
  )
}

export default ProductVariant
