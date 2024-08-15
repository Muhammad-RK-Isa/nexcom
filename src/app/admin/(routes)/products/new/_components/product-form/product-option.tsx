import React from "react"
import { useFormContext, type Control } from "react-hook-form"

import type { CreateProductInput } from "~/types"
import { cn } from "~/lib/utils"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { SortableDragHandle, SortableItem } from "~/components/ui/sortable"
import { Icons } from "~/components/icons"

import { ProductOptionValues } from "./product-option-values"

interface ProductOptionProps {
  control: Control<CreateProductInput>
  optionIndex: number
  optionId: string
  defaultExpanded?: boolean
}

export const ProductOption: React.FC<ProductOptionProps> = ({
  control,
  optionIndex,
  optionId,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)

  const form = useFormContext<CreateProductInput>()
  const { options } = form.watch()

  const option = options.find((o) => o.id === optionId)

  const handleCollapse = async () => {
    const isFilled = await form.trigger(`options.${optionIndex}`, {
      shouldFocus: true,
    })
    if (isFilled) setIsExpanded(!isExpanded)
  }

  return (
    <SortableItem value={optionId} asChild>
      <div
        className={cn(
          "flex gap-4 overflow-auto bg-background p-6 pl-4",
          isExpanded && "pb-8"
        )}
      >
        <SortableDragHandle type="button" variant={"ghost"} size={"icon"}>
          <Icons.gripVertical className="size-4 text-muted-foreground" />
        </SortableDragHandle>
        {isExpanded ? (
          <div className="flex flex-1 flex-col gap-6">
            <FormField
              control={control}
              name={`options.${optionIndex}.title`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Option name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        placeholder="e.g. Size, Color"
                        className="bg-background"
                        onChange={(e) => {
                          field.onChange(e.currentTarget.value)
                          form.clearErrors(`options.${optionIndex}.title`)
                        }}
                      />
                      <Button
                        type="button"
                        variant={"tone"}
                        size={"icon"}
                        onClick={() => {
                          const newOpts = options.filter(
                            (o) => o.id !== optionId
                          )
                          form.setValue("options", newOpts)
                        }}
                        className="absolute right-0 top-0"
                        aria-hidden="true"
                      >
                        <Icons.trash className="size-4" />
                        <span className="sr-only">Remove option</span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ProductOptionValues
              optionIdx={optionIndex}
              optionId={optionId}
              control={control}
              onFinishEditing={() => handleCollapse()}
            />
          </div>
        ) : (
          <div className="flex w-full items-center">
            <div className="flex flex-col gap-2">
              <p className="font-medium">{option?.title}</p>
              <div className="col-span-2 flex flex-wrap items-center gap-1.5">
                {option?.values.map(({ value }, idx) => {
                  if (value)
                    return (
                      <Badge key={idx} variant={"secondary"} className="px-2">
                        {value}
                      </Badge>
                    )
                })}
              </div>
            </div>
            <Button
              variant={"outline"}
              size={"sm"}
              onClick={() => setIsExpanded(true)}
              className="ml-auto px-2"
            >
              <Icons.edit className="mr-2 size-3.5 text-muted-foreground" />
              Edit
            </Button>
          </div>
        )}
      </div>
    </SortableItem>
  )
}
