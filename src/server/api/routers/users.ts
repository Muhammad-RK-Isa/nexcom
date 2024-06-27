import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc"
import { users } from "~/server/db/schema"
import { createUserSchema } from "~/server/db/schema/users"
import { genSaltSync, hashSync } from "bcrypt-ts"

export const usersRouter = createTRPCRouter({
  create: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db.query.users.findFirst({
        where: (t, { eq }) => eq(t.email, input.email),
      })

      if (existingUser) throw new Error("Existing account. Please, sign in.")

      const salt = genSaltSync(10)
      const hashedPassword = hashSync(input.password, salt)

      await ctx.db.insert(users).values({
        name: input.name,
        email: input.email,
        hashedPassword,
      })
    }),
  get: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.users.findFirst({
      where: (t, { eq }) => eq(t.id, ctx.session.user.id),
    })
  }),
})
