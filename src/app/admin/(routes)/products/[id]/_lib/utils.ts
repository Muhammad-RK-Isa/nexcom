import { isEqual } from "lodash";

import { generateId } from "~/lib/utils";
import type { ProductOption, ProductVariant } from "~/types";

interface VariantCombo {
  optionId: string;
  valueId: string;
  value: string;
  rank: number;
}

interface GenerateVariantsProps {
  options: ProductOption[];
  price?: number;
  inventoryQuantity?: number;
  existingVariants?: ProductVariant[];
}
export const generateVariants = ({
  options,
  price,
  inventoryQuantity,
  existingVariants,
}: GenerateVariantsProps): ProductVariant[] => {
  if (options.length === 0) return [];

  const combinations = (
    opts: ProductOption[],
    prefix: VariantCombo[] = [],
  ): VariantCombo[][] => {
    if (opts.length === 0) return [prefix];
    const [first, ...rest] = opts;
    return first!.values.flatMap((value) =>
      combinations(rest, [
        ...prefix,
        {
          optionId: first?.id ?? "",
          valueId: value.id ?? "",
          value: value.value,
          rank: value.rank,
        },
      ]),
    );
  };

  const variantCombos = combinations(options);

  return variantCombos.map((combo) => {
    const optionValues = combo.map(({ valueId, optionId, value, rank }) => ({
      id: valueId,
      value,
      rank,
      optionId,
    }));
    const ev = existingVariants?.find(({ optionValues: optVals }) =>
      isEqual(
        optionValues.map(({ optionId, value }) => ({ optionId, value })),
        optVals?.map(({ optionId, value }) => ({ optionId, value })),
      ),
    );

    return {
      id: ev?.id ?? generateId({ prefix: "variant" }),
      price: ev?.price ?? price ?? 0,
      inventoryQuantity: ev?.inventoryQuantity ?? inventoryQuantity ?? 0,
      optionValues,
      image: ev?.image ?? null,
    };
  });
};
