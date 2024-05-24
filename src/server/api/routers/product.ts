import { createProductSchema, getProductSchema } from "~/schemas";
import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";
import { products } from "~/server/db/schema";

export const productRouter = createTRPCRouter({
  get: adminProcedure.input(getProductSchema).query(
    async ({ ctx, input }) =>
      await ctx.db.query.products.findFirst({
        where: (t, { eq }) => eq(t.id, input.id),
      }),
  ),
  create: adminProcedure
    .input(createProductSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(products).values(input);
    }),
});
