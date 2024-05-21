import { type SQL } from "drizzle-orm";
import { type z } from "zod";

import type {
  forgotPasswordSchema,
  otpSchema,
  resendEmailVerificationCodeSchema,
  resetPasswordSchema,
  signInSchema,
  createUserSchema,
} from "~/schemas";
import type { UserRole, users } from "~/server/db/schema";

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
