import type {
  getEditableProduct,
  getTableProducts,
} from "~/features/admin/api/queries"
import type { z } from "zod"

import type { searchTableProductParamsSchema } from "~/lib/validations/product"

export type EditableProduct = Awaited<ReturnType<typeof getEditableProduct>>

export type TableProducts = Awaited<ReturnType<typeof getTableProducts>>
export type TableProduct = TableProducts["data"][number]

export type TableProductsParams = z.infer<typeof searchTableProductParamsSchema>
