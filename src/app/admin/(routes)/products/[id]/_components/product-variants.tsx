import React from "react";
import { useFormContext } from "react-hook-form";

import type { UpdateProductInput } from "~/types";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";
import { ProductOptions } from "./product-options";

export const ProductVariants = () => {
  const form = useFormContext<UpdateProductInput>();

  const { variants } = form.watch();

  const hasVariantFieldValue = React.useMemo(() => {
    return variants.some(
      ({ optionValues, createdAt }) =>
        optionValues?.some(({ value }) => !!value) || !!createdAt,
    );
  }, [variants]);

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
                    optionValues?.some(({ value }) => !!value) || !!createdAt;
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
                                  className="px-2"
                                >
                                  {value}
                                </Badge>
                              );
                          })}
                        </div>
                        <FormField
                          control={form.control}
                          name={`variants.${variantIndex}.price`}
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
                          name={`variants.${variantIndex}.inventoryQuantity`}
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
