import type {
  createUserSchema,
  forgotPasswordSchema,
  otpSchema,
  resendEmailVerificationCodeSchema,
  resetPasswordSchema,
  signInSchema,
  UserRole,
  users,
} from "~/server/db/schema"
import type { z } from "zod"

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
