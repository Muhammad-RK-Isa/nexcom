import { relations } from "drizzle-orm"
import {
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core"
import { z } from "zod"

import { generateId } from "~/lib/utils"

import { accounts } from "./accounts"

export const pgUserRolesEnum = pgEnum("userRole", [
  "viewer",
  "customer",
  "admin",
])

export const UserRole = z.enum(pgUserRolesEnum.enumValues)

export const users = pgTable(
  "user",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => generateId({ prefix: "user" })),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: varchar("image", { length: 255 }),
    role: pgUserRolesEnum("role").default("customer").notNull(),
    hashedPassword: varchar("hashed_password"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      mode: "date",
      precision: 3,
    }).$onUpdate(() => new Date()),
  },
  (t) => ({
    emailIdx: uniqueIndex("user_email_idx").on(t.email),
  })
)

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}))

export const createUserSchema = z
  .object({
    name: z.string().refine((value) => value.length >= 1, {
      message: "Please enter your full name",
    }),
    email: z.string().email({ message: "Please enter a valid email" }),
    password: z
      .string()
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
        "Password must be at least 6 characters long and include at least one letter and one digit"
      ),
    confirm: z.string(),
  })
  .refine((values) => values.password === values.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  })

export const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .regex(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/, "Invalid password"),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Invalid token"),
  password: z.string().min(8, "Password is too short").max(255),
})

export const otpSchema = z.object({
  code: z.string().length(6),
})

export const verifyEmailSchema = otpSchema.extend({
  email: z.string().email(),
})

export const resendEmailVerificationCodeSchema = z.object({
  email: z.string().email(),
})
