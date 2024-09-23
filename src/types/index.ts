import type { products, productVariants } from "~/server/db/schema"
import { type SQL } from "drizzle-orm"
import type { ClientUploadedFileData } from "uploadthing/types"
import { type z } from "zod"

import type {
  filterProductParamsSchema,
  insertProductSchema,
  optionValueSchema,
  productIdSchema,
  productOptionSchema,
  productSlugSchema,
  productVariantSchema,
  updateProductSchema,
  updateProductsStatusSchema,
  updateProductStatusSchema,
} from "~/lib/validations/product"

export interface SearchParams {
  [key: string]: string | string[] | undefined
}

export interface UploadedFile<T = unknown> extends ClientUploadedFileData<T> {}

export interface Option {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
  withCount?: boolean
}

export interface DataTableFilterField<TData> {
  label: string
  value: keyof TData
  placeholder?: string
  options?: Option[]
}

export interface DataTableFilterOption<TData> {
  id: string
  label: string
  value: keyof TData
  options: Option[]
  filterValues?: string[]
  filterOperator?: string
  isMulti?: boolean
}

export type DrizzleWhere<T> =
  | SQL<unknown>
  | ((aliases: T) => SQL<T> | undefined)
  | undefined

// Types: Product
export type ProductId = z.infer<typeof productIdSchema>
export type ProductSlug = z.infer<typeof productSlugSchema>
export type InsertProductInput = z.infer<typeof insertProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type UpdateProductStatusInput = z.infer<typeof updateProductStatusSchema>
export type UpdateProductsStatusInput = z.infer<
  typeof updateProductsStatusSchema
>
export type ProductOption = z.infer<typeof productOptionSchema>
export type ProductVariant = z.infer<typeof productVariantSchema>
export type ProductOptionValue = z.infer<typeof optionValueSchema>

export type ProductEntity = typeof products.$inferSelect
export type ProductVariantEntity = typeof productVariants.$inferSelect

export type FilterProductParams = z.infer<typeof filterProductParamsSchema>
