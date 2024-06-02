import React from "react";
import { type Control, useFieldArray, useFormContext } from "react-hook-form";

import type { UpdateProductInput } from "~/types";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Icons } from "~/components/icons";
import { Label } from "~/components/ui/label";
import { cn, generateId } from "~/lib/utils";
import { generateVariants } from "../_lib/utils";
import { Badge } from "~/components/ui/badge";

export const ProductVariantsForm = () => {
  const form = useFormContext<UpdateProductInput>();

  const {
    fields: optionFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "product_options",
  });

  const { fields: variantFields, replace: replaceVariants } = useFieldArray({
    control: form.control,
    name: "product_variants",
  });

  const { price, inventoryQuantity, product_variants, product_options } =
    form.watch();

  const updateVariants = React.useCallback(() => {
    const newVariants = generateVariants({
      options: product_options,
      existingVariants: product_variants,
      price,
      inventoryQuantity,
    });
    replaceVariants(newVariants);
  }, [
    inventoryQuantity,
    product_options,
    product_variants,
    replaceVariants,
    price,
  ]);

  React.useEffect(() => {
    const newVariants = generateVariants({ options: product_options });
    replaceVariants(newVariants);
  }, [replaceVariants, product_options]);

  const hasVariantFieldValue = React.useMemo(() => {
    return variantFields.some(({ optionValues }) =>
      optionValues?.some(({ value }) => !!value),
    );
  }, [variantFields]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Variants</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {optionFields && optionFields.length > 0 ? (
            <div className="grid rounded-lg border bg-muted/50">
              {optionFields.map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  className={cn(
                    "flex gap-4 p-6 pb-8 pl-4",
                    optionFields.at(-1) !== option && "border-b",
                  )}
                >
                  <Button
                    type="button"
                    variant={"ghost"}
                    size={"icon"}
                    className="mt-8 cursor-grab"
                  >
                    <Icons.gripVertical className="size-4" />
                  </Button>
                  <div className="flex flex-1 flex-col gap-10">
                    <FormField
                      control={form.control}
                      name={`product_options.${optionIndex}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Option name</FormLabel>
                          <div className="flex items-center gap-2.5">
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="e.g. Size, Color"
                                className="bg-background"
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant={"outline"}
                              size={"icon"}
                              onClick={() => remove(optionIndex)}
                              aria-hidden="true"
                            >
                              <Icons.trash className="size-4" />
                              <span className="sr-only">Remove option</span>
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <OptionValues
                      optionIdx={optionIndex}
                      optionId={option.id}
                      control={form.control}
                      updateVariants={updateVariants}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          <Button
            type="button"
            variant={"outline"}
            onClick={() => {
              const newOptionId = generateId({ prefix: "opt" });
              append({
                id: newOptionId,
                title: "",
                rank: optionFields.length + 1,
                values: [
                  {
                    id: generateId({ prefix: "optval" }),
                    value: "",
                    rank: 1,
                    optionId: newOptionId,
                  },
                ],
              });
            }}
          >
            <Icons.plus className="mr-2 size-4" />
            Add {optionFields.length > 0 ? "another option" : "an option"}
          </Button>
          {hasVariantFieldValue ? (
            <div className="grid overflow-hidden rounded-lg border">
              <div className="grid grid-cols-4 gap-2 border-b bg-muted/50 px-6 py-4 text-sm font-medium">
                <p className="col-span-2">Variant</p>
                <p>Price</p>
                <p>Available</p>
              </div>
              <div className="grid divide-y rounded-lg">
                {variantFields.map(({ optionValues }, variantIndex) => {
                  const hasValue = optionValues?.some(({ value }) => !!value);
                  if (hasValue)
                    return (
                      <div
                        key={variantIndex}
                        className="grid grid-cols-4 gap-2 p-6"
                      >
                        <div className="col-span-2 flex flex-wrap items-center gap-2">
                          {optionValues?.map(({ value }, idx) => {
                            if (value)
                              return (
                                <Badge
                                  key={idx}
                                  variant={"secondary"}
                                  className="px-2 text-sm"
                                >
                                  {value}
                                </Badge>
                              );
                          })}
                        </div>
                        <FormField
                          control={form.control}
                          name={`product_variants.${variantIndex}.price`}
                          render={({ field, fieldState }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  inputMode="numeric"
                                  placeholder="Enter price"
                                  className={cn(
                                    "bg-background",
                                    fieldState.error &&
                                      "border-destructive focus-visible:ring-destructive",
                                  )}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`product_variants.${variantIndex}.inventoryQuantity`}
                          render={({ field, fieldState }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  className={cn(
                                    "bg-background",
                                    fieldState.error &&
                                      "border-destructive focus-visible:ring-destructive",
                                  )}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};

export const OptionValues = ({
  optionIdx,
  optionId = "",
  control,
  updateVariants,
}: {
  optionIdx: number;
  optionId?: string;
  control: Control<UpdateProductInput>;
  updateVariants: () => void;
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `product_options.${optionIdx}.values`,
  });

  return (
    <div className="grid gap-4">
      <Label>Option values</Label>
      {fields.map((item, k) => (
        <FormField
          key={item.id}
          control={control}
          name={`product_options.${optionIdx}.values.${k}.value`}
          render={({ field }) => (
            <FormItem className="w-full">
              <div className="flex items-center gap-2.5">
                <FormControl>
                  <Input
                    {...field}
                    className="bg-background"
                    onChange={(e) => {
                      field.onChange(e.currentTarget.value);
                      updateVariants();
                    }}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant={"outline"}
                  size={"icon"}
                  onClick={() => {
                    remove(k);
                    updateVariants();
                  }}
                  aria-hidden="true"
                >
                  <Icons.trash className="size-4" />
                  <span className="sr-only">Remove option value</span>
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
      <Button
        type="button"
        variant={"outline"}
        onClick={() => {
          append({
            id: generateId({ prefix: "optval" }),
            value: "",
            rank: fields.length + 1,
            optionId,
          });
          updateVariants();
        }}
      >
        <Icons.plus className="mr-2 size-4" />
        Add Option Value
      </Button>
    </div>
  );
};
