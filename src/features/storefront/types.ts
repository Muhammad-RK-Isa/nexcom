import type {
  getFilteredProducts,
  getPublicProduct,
} from "~/features/storefront/api/queries"

export type PublicProduct = Awaited<ReturnType<typeof getPublicProduct>>

export type FilteredProducts = Awaited<ReturnType<typeof getFilteredProducts>>
export type FilteredProduct = FilteredProducts["data"][number]
