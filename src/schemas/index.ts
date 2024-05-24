import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { pgProductStatuses, products } from "~/server/db/schema";

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
        "Password must be at least 6 characters long and include at least one letter and one digit",
      ),
    confirm: z.string(),
  })
  .refine((values) => values.password === values.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .regex(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/, "Invalid password"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Invalid token"),
  password: z.string().min(8, "Password is too short").max(255),
});

export const otpSchema = z.object({
  code: z.string().length(6),
});

export const verifyEmailSchema = otpSchema.extend({
  email: z.string().email(),
});

export const resendEmailVerificationCodeSchema = z.object({
  email: z.string().email(),
});

// Product schema

export const getProductSchema = z.object({
  id: z.string(),
});

export const createProductSchema = createInsertSchema(products).extend({
  tags: z.string().array(),
});
