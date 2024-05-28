import { type SQL } from "drizzle-orm";
import { type z } from "zod";
import {
  type getTableProducts,
  type getProducts,
} from "~/lib/api/products/queries";

import type {
  createUserSchema,
  forgotPasswordSchema,
  insertProductSchema,
  otpSchema,
  productIdSchema,
  resendEmailVerificationCodeSchema,
  resetPasswordSchema,
  searchProductParamsSchema,
  signInSchema,
  updateProductSchema,
  updateProductStatusSchema,
  updateProductsStatusSchema,
} from "~/schemas";
import type { UserRole, products, users } from "~/server/db/schema";

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

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

// This type infers the return from getProducts() - meaning it will include any joins
export type CompleteProduct = Awaited<ReturnType<typeof getProducts>>[number];
export type CompleteTableProducts = Awaited<
  ReturnType<typeof getTableProducts>
>;
export type TableProduct = typeof products.$inferSelect;

export type TableProductsParams = z.infer<typeof searchProductParamsSchema>;
