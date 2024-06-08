import {
  getAllImages,
  getImageById,
  getTableImages,
} from "~/lib/api/images/queries";
import {
  imageIdSchema,
  insertImageSchema,
  searchImageParamsSchema,
} from "~/server/db/schema/images";
import { adminProcedure, publicProcedure } from "~/server/api/trpc";
import { createTRPCRouter } from "~/server/api/trpc";
import { images } from "~/server/db/schema";

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
});
