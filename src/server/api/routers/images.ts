import {
  getAllImages,
  getImageById,
  getTableImages,
} from "~/lib/api/images/queries";
import {
  imageIdSchema,
  imageIdsSchema,
  insertImageSchema,
  searchImageParamsSchema,
} from "~/schema";
import { adminProcedure, publicProcedure } from "~/server/api/trpc";
import { createTRPCRouter } from "~/server/api/trpc";
import { images } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { utapi } from "~/server/uploadthing";

export const imagesRouter = createTRPCRouter({
  getImageById: publicProcedure
    .input(imageIdSchema)
    .query(async ({ input }) => {
      return getImageById(input);
    }),
  getAllImages: publicProcedure.query(async () => {
    return getAllImages();
  }),
  getTableImages: adminProcedure
    .input(searchImageParamsSchema)
    .query(async ({ input }) => {
      return getTableImages(input);
    }),
  createImage: publicProcedure
    .input(insertImageSchema)
    .mutation(async ({ input, ctx }) => {
      const image = await ctx.db.insert(images).values(input);
      return image;
    }),
  deleteImages: adminProcedure
    .input(imageIdsSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.db.transaction(async (tx) => {
        const res = await utapi.deleteFiles(input.map(({ id }) => id));
        if (res.success) {
          for (const i of input) {
            await tx.delete(images).where(eq(images.id, i.id));
          }
        }
        return res;
      });
    }),
});
