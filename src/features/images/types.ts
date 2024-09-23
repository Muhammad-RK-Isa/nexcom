import type { images } from "~/server/db/schema"
import type { z } from "zod"

import type { getImageById, getTableImages } from "~/lib/api/images/queries"
import type {
  imageIdSchema,
  imageSchema,
  insertImageSchema,
  searchTableImageParamsSchema,
} from "~/lib/validations/product"

export type Image = z.infer<typeof imageSchema>
export type ImageId = z.infer<typeof imageIdSchema>
export type CreateImageInput = z.infer<typeof insertImageSchema>

// This type infers the return from getImages() - meaning it will include any joins
export type CompleteImage = Awaited<ReturnType<typeof getImageById>>
export type CompleteTableImages = Awaited<ReturnType<typeof getTableImages>>
export type TableImage = typeof images.$inferSelect

export type TableImageParams = z.infer<typeof searchTableImageParamsSchema>
