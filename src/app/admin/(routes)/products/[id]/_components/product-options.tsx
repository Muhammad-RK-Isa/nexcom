import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { generateId } from "~/lib/utils";
import type { UpdateProductInput } from "~/types";
import { generateVariants } from "../_lib/utils";
import { Sortable } from "~/components/ui/sortable";
import { ProductOption } from "./product-option";

export const ProductOptions = () => {
  const form = useFormContext<UpdateProductInput>();

  const { append: addOption } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const { replace: replaceVariants, fields: variantFields } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const { price, inventoryQuantity, options } = form.watch();

  const updateVariants = React.useCallback(() => {
    const newVariants = generateVariants({
      options,
      existingVariants: variantFields,
      price,
      inventoryQuantity,
    });
    replaceVariants(newVariants);
  }, [inventoryQuantity, options, variantFields, replaceVariants, price]);

  return (
    <div className="grid divide-y overflow-hidden rounded-md border">
      {options.length > 0 ? (
        <Sortable
          value={options}
          onValueChange={(opts) => {
            const newOptions = opts.map((option) => ({
              ...option,
              rank: opts.findIndex((o) => o.id === option.id) + 1,
            }));
            form.setValue("options", newOptions);
            updateVariants();
          }}
        >
          <div className="grid divide-y">
            {options.map((option, idx) => (
              <ProductOption
                key={option.id}
                control={form.control}
                optionIndex={idx}
                optionId={option.id}
                updateVariants={() => updateVariants()}
              />
            ))}
          </div>
        </Sortable>
      ) : null}
      <Button
        type="button"
        variant={"link"}
        className="rounded-none bg-muted/40 py-6"
        onClick={() => {
          const newOptionId = generateId({ prefix: "opt" });
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
          });
          updateVariants();
        }}
      >
        <Icons.plus className="mr-2 size-4" />
        Add {options.length > 0 ? "another option" : "an option"}
      </Button>
    </div>
  );
};
