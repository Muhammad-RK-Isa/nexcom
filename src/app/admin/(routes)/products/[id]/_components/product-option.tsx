import React from "react";
import { type Control, useFieldArray, useFormContext } from "react-hook-form";

import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import type { UpdateProductInput } from "~/types";
import { ProductOptionValues } from "./product-option-values";
import { Badge } from "~/components/ui/badge";
import { SortableDragHandle, SortableItem } from "~/components/ui/sortable";
import { generateVariants } from "../_lib/utils";

interface ProductOptionProps {
  control: Control<UpdateProductInput>;
  optionIndex: number;
  optionId: string;
  updateVariants: () => void;
}

export const ProductOption: React.FC<ProductOptionProps> = ({
  control,
  optionIndex,
  optionId,
  updateVariants,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(true);

  const form = useFormContext<UpdateProductInput>();
  const { options } = form.watch();
  const { replace: replaceVariants, fields: variantFields } = useFieldArray({
    control,
    name: "variants",
  });

  const option = options.find((o) => o.id === optionId);

  const handleCollapse = async () => {
    const isFilled = await form.trigger(`options.${optionIndex}`, {
      shouldFocus: true,
    });
    if (isFilled) setIsExpanded(!isExpanded);
  };

  return (
    <SortableItem value={optionId} asChild>
      <div
        className={cn(
          "flex gap-4 bg-background p-6 pl-4",
          isExpanded && "pb-8",
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
                  <div className="flex items-center gap-2.5">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. Size, Color"
                        className="bg-background"
                        onChange={(e) => {
                          field.onChange(e.currentTarget.value);
                          form.clearErrors(`options.${optionIndex}.title`);
                        }}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant={"outline"}
                      size={"icon"}
                      onClick={() => {
                        const newOpts = options.filter(
                          (o) => o.id !== optionId,
                        );
                        const newVars = generateVariants({
                          options: newOpts,
                          existingVariants: variantFields,
                        });
                        replaceVariants(newVars);
                        form.setValue("options", newOpts);
                      }}
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
            <ProductOptionValues
              optionIdx={optionIndex}
              optionId={optionId}
              control={control}
              updateVariants={() => updateVariants()}
              onFinishEdit={() => handleCollapse()}
            />
          </div>
        ) : (
          <div className="flex w-full items-center">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">{option?.title}</p>
              <div className="col-span-2 flex flex-wrap items-center gap-2">
                {option?.values.map(({ value }, idx) => {
                  if (value)
                    return (
                      <Badge key={idx} variant={"secondary"} className="px-2">
                        {value}
                      </Badge>
                    );
                })}
              </div>
            </div>
            <Button
              variant={"outline"}
              size={"sm"}
              onClick={() => setIsExpanded(true)}
              className="ml-auto px-2"
            >
              <Icons.edit className="mr-2 size-4 text-muted-foreground" />
              Edit
            </Button>
          </div>
        )}
      </div>
    </SortableItem>
  );
};
