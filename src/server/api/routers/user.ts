import { genSaltSync, hashSync } from "bcrypt-ts";

import { createUserSchema } from "~/schemas";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { users } from "~/server/db/schema";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db.query.users.findFirst({
        where: (t, { eq }) => eq(t.email, input.email),
      });

      if (existingUser) throw new Error("Existing account. Please, sign in.");

      const salt = genSaltSync(10);
      const hashedPassword = hashSync(input.password, salt);

      await ctx.db.insert(users).values({
        name: input.name,
        email: input.email,
        hashedPassword,
      });
    }),
  get: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.users.findFirst({
      where: (t, { eq }) => eq(t.id, ctx.session.user.id),
    });
  }),
});
