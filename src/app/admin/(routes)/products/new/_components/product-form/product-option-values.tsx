import React from "react"
import { useFieldArray, useFormContext, type Control } from "react-hook-form"

import type { UpdateProductInput } from "~/types"
import { generateId } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
  Sortable,
  SortableDragHandle,
  SortableItem,
} from "~/components/ui/sortable"
import { Icons } from "~/components/icons"

interface ProductOptionValuesProps {
  optionIdx: number
  optionId?: string
  control: Control<UpdateProductInput>
  onFinishEditing: () => void
}

export const ProductOptionValues: React.FC<ProductOptionValuesProps> = ({
  optionIdx,
  optionId = "",
  control,
  onFinishEditing,
}) => {
  const form = useFormContext<UpdateProductInput>()

  const { options } = form.watch()

  const { append, remove } = useFieldArray({
    control,
    name: `options.${optionIdx}.values`,
  })

  const optionValues = options.find((o) => o.id === optionId)?.values ?? []

  return (
    <Sortable
      value={optionValues}
      onValueChange={(optVals) => {
        const newOptVals = optVals.map((optVal) => ({
          ...optVal,
          rank: optVals.findIndex((o) => o.id === optVal.id) + 1,
        }))
        form.setValue(`options.${optionIdx}.values`, newOptVals)
        form.trigger(`options.${optionIdx}.values`)
      }}
    >
      <div className="-ml-11 grid gap-2 md:-ml-8">
        <Label className="mb-2 ml-11">Option values</Label>
        {options
          .find((o) => o.id === optionId)
          ?.values.map((item, k) => (
            <SortableItem key={item.id} value={item.id} asChild>
              <div className="flex gap-2">
                <SortableDragHandle
                  type="button"
                  variant={"ghost"}
                  size={"icon"}
                >
                  <Icons.gripVertical className="size-4 text-muted-foreground" />
                </SortableDragHandle>
                <div className="flex-1 items-center gap-2">
                  <FormField
                    key={item.id}
                    control={control}
                    name={`options.${optionIdx}.values.${k}.value`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              className="bg-background"
                              onChange={(e) => {
                                field.onChange(e.currentTarget.value)
                                form.clearErrors(
                                  `options.${optionIdx}.values.${k}.value`
                                )
                              }}
                            />
                            {optionValues.length > 1 ? (
                              <Button
                                type={"button"}
                                variant={"tone"}
                                size={"icon"}
                                onClick={() => remove(k)}
                                className="absolute right-0 top-0"
                                aria-hidden="true"
                              >
                                <Icons.trash className="size-4" />
                                <span className="sr-only">
                                  Remove option value
                                </span>
                              </Button>
                            ) : null}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </SortableItem>
          ))}
        <div className="flex items-center justify-between space-x-2 pl-11">
          <Button
            type="button"
            size={"sm"}
            variant={"outline"}
            onClick={() => {
              append({
                id: generateId({ prefix: "optval" }),
                value: "",
                rank: optionValues.length + 1,
                optionId,
              })
              form.clearErrors(`options.${optionIdx}.values`)
            }}
            className="flex-1"
          >
            <Icons.plus className="mr-2 size-4" />
            Add {optionValues.length > 0 ? "another" : "a"} value
          </Button>
          <Button
            type="button"
            size={"sm"}
            variant={"outline"}
            onClick={() => onFinishEditing()}
          >
            <Icons.check className="mr-1.5 size-4" />
            Done
          </Button>
        </div>
        {form.getFieldState(`options.${optionIdx}.values`).error?.message ? (
          <p className="-mt-2 text-[0.8rem] font-medium text-destructive">
            {form.getFieldState(`options.${optionIdx}.values`).error?.message}
          </p>
        ) : null}
      </div>
    </Sortable>
  )
}
