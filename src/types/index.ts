import { type SQL } from "drizzle-orm";
import type { ClientUploadedFileData } from "uploadthing/types";
import { type z } from "zod";
import type { getImageById, getTableImages } from "~/lib/api/images/queries";
import {
  type getProductById,
  type getTableProducts,
} from "~/lib/api/products/queries";

import type {
  imageIdSchema,
  imageSchema,
  insertImageSchema,
  insertProductSchema,
  optionValueSchema,
  productIdSchema,
  productOptionSchema,
  productVariantSchema,
  searchImageParamsSchema,
  searchProductParamsSchema,
  updateProductSchema,
  updateProductStatusSchema,
  updateProductsStatusSchema,
} from "~/schema";
import type {
  createUserSchema,
  forgotPasswordSchema,
  otpSchema,
  resendEmailVerificationCodeSchema,
  resetPasswordSchema,
  signInSchema,
} from "~/server/db/schema/users";

import type { UserRole, images, products, users } from "~/server/db/schema";

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export interface UploadedFile<T = unknown> extends ClientUploadedFileData<T> {}

export type Image = z.infer<typeof imageSchema>;

export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export interface DataTableFilterField<TData> {
  label: string;
  value: keyof TData;
  placeholder?: string;
  options?: Option[];
}

export interface DataTableFilterOption<TData> {
  id: string;
  label: string;
  value: keyof TData;
  options: Option[];
  filterValues?: string[];
  filterOperator?: string;
  isMulti?: boolean;
}

export type DrizzleWhere<T> =
  | SQL<unknown>
  | ((aliases: T) => SQL<T> | undefined)
  | undefined;

// Types: User
export type UserRole = z.infer<typeof UserRole>;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type OTPInput = z.infer<typeof otpSchema>;
export type ResendEmailVerificationCode = z.infer<
  typeof resendEmailVerificationCodeSchema
>;

// Types: Product
export type ProductId = z.infer<typeof productIdSchema>;
export type CreateProductInput = z.infer<typeof insertProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type UpdateProductStatusInput = z.infer<
  typeof updateProductStatusSchema
>;
export type UpdateProductsStatusInput = z.infer<
  typeof updateProductsStatusSchema
>;
export type ProductOption = z.infer<typeof productOptionSchema>;
export type ProductVariant = z.infer<typeof productVariantSchema>;
export type ProductOptionValue = z.infer<typeof optionValueSchema>;

// This type infers the return from getProducts() - meaning it will include any joins
export type CompleteProduct = Awaited<ReturnType<typeof getProductById>>;
export type CompleteTableProducts = Awaited<
  ReturnType<typeof getTableProducts>
>;
export type TableProduct = typeof products.$inferSelect;

export type TableProductsParams = z.infer<typeof searchProductParamsSchema>;

// Types: Image
export type ImageId = z.infer<typeof imageIdSchema>;
export type CreateImageInput = z.infer<typeof insertImageSchema>;

// This type infers the return from getImages() - meaning it will include any joins
export type CompleteImage = Awaited<ReturnType<typeof getImageById>>;
export type CompleteTableImages = Awaited<ReturnType<typeof getTableImages>>;
export type TableImage = typeof images.$inferSelect;

export type TableImageParams = z.infer<typeof searchImageParamsSchema>;
