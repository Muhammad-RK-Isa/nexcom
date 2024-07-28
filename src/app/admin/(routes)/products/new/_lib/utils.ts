import { isEqual } from "lodash"

import type { ProductOption, ProductVariant } from "~/types"
import { generateId } from "~/lib/utils"

interface VariantCombo {
  optionId: string
  valueId: string
  value: string
  rank: number
}

interface GenerateVariantsProps {
  options: ProductOption[]
  price?: number
  inventoryQuantity?: number
  existingVariants?: ProductVariant[]
}
