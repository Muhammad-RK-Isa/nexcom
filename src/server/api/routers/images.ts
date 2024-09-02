import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc"
import { images } from "~/server/db/schema"
import { utapi } from "~/server/uploadthing"
import { eq } from "drizzle-orm"

import {
  getAllImages,
  getImageById,
  getTableImages,
} from "~/lib/api/images/queries"
import {
  imageIdSchema,
  imageIdsSchema,
  insertImageSchema,
  insertImagesSchema,
  searchTableImageParamsSchema,
} from "~/lib/validations/product"

export const imagesRouter = createTRPCRouter({
  getImageById: publicProcedure
    .input(imageIdSchema)
    .query(async ({ input }) => {
      return getImageById(input)
    }),
  getAllImages: publicProcedure.query(async () => {
    return getAllImages()
  }),
  getTableImages: adminProcedure
    .input(searchTableImageParamsSchema)
    .query(async ({ input }) => {
      return getTableImages(input)
    }),
  insertImage: adminProcedure
    .input(insertImageSchema)
    .mutation(async ({ input, ctx }) => {
      const [r] = await ctx.db.insert(images).values(input).returning()
      return r
    }),
  insertImages: adminProcedure
    .input(insertImagesSchema)
    .mutation(async ({ input, ctx }) => {
      const imageRows = await Promise.all(
        input.map(async (image) => {
          const [r] = await ctx.db.insert(images).values(image).returning()
          return r
        })
      )
      return imageRows
    }),
  deleteImages: adminProcedure
    .input(imageIdsSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.db.transaction(async (tx) => {
        const res = await utapi.deleteFiles(input.map(({ id }) => id))
        if (res.success) {
          for (const i of input) {
            await tx.delete(images).where(eq(images.id, i.id))
          }
        }
        return res
      })
    }),
})
