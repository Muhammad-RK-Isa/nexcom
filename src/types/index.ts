import type {
  images,
  products,
  productVariants,
  UserRole,
  users,
} from "~/server/db/schema"
import type {
  createUserSchema,
  forgotPasswordSchema,
  otpSchema,
  resendEmailVerificationCodeSchema,
  resetPasswordSchema,
  signInSchema,
} from "~/server/db/schema/users"
import { type SQL } from "drizzle-orm"
import type { ClientUploadedFileData } from "uploadthing/types"
import { type z } from "zod"

import type { getImageById, getTableImages } from "~/lib/api/images/queries"
import {
  type getEditableProduct,
  type getFilteredProducts,
  type getPublicProduct,
  type getTableProducts,
} from "~/lib/api/products/queries"
import type {
  cartItemSchema,
  cartLineItemSchema,
  checkoutItemSchema,
} from "~/lib/validations/cart"
import type {
  filterProductParamsSchema,
  imageIdSchema,
  imageSchema,
  insertImageSchema,
  insertProductSchema,
  optionValueSchema,
  productIdSchema,
  productOptionSchema,
  productSlugSchema,
  productVariantSchema,
  searchTableImageParamsSchema,
  searchTableProductParamsSchema,
  updateProductSchema,
  updateProductsStatusSchema,
  updateProductStatusSchema,
} from "~/lib/validations/product"

export interface SearchParams {
  [key: string]: string | string[] | undefined
}

export interface UploadedFile<T = unknown> extends ClientUploadedFileData<T> {}

export type Image = z.infer<typeof imageSchema>

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

// Types: User
export type UserRole = z.infer<typeof UserRole>

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type CreateUserInput = z.infer<typeof createUserSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type OTPInput = z.infer<typeof otpSchema>
export type ResendEmailVerificationCode = z.infer<
  typeof resendEmailVerificationCodeSchema
>

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
export type EditableProduct = Awaited<ReturnType<typeof getEditableProduct>>
export type PublicProduct = Awaited<ReturnType<typeof getPublicProduct>>

export type FilteredProducts = Awaited<ReturnType<typeof getFilteredProducts>>
export type FilteredProduct = FilteredProducts["data"][number]

export type TableProducts = Awaited<ReturnType<typeof getTableProducts>>
export type TableProduct = TableProducts["data"][number]

export type FilterProductParams = z.infer<typeof filterProductParamsSchema>
export type TableProductsParams = z.infer<typeof searchTableProductParamsSchema>

// Types: Image
export type ImageId = z.infer<typeof imageIdSchema>
export type CreateImageInput = z.infer<typeof insertImageSchema>

// This type infers the return from getImages() - meaning it will include any joins
export type CompleteImage = Awaited<ReturnType<typeof getImageById>>
export type CompleteTableImages = Awaited<ReturnType<typeof getTableImages>>
export type TableImage = typeof images.$inferSelect

export type TableImageParams = z.infer<typeof searchTableImageParamsSchema>

// Types: Cart
export type CartItem = z.infer<typeof cartItemSchema>
export type CheckoutItem = z.infer<typeof checkoutItemSchema>
export type CartLineItem = z.infer<typeof cartLineItemSchema>
