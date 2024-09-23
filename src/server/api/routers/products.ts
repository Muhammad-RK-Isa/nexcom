import { unstable_noStore as noStore } from "next/cache"
import { TRPCError } from "@trpc/server"
import { createProduct, updateProduct } from "~/features/admin/api/mutations"
import {
  getEditableProduct,
  getTableProducts,
} from "~/features/admin/api/queries"
import {
  getFilteredProducts,
  getPublicProduct,
} from "~/features/storefront/api/queries"
import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc"
import { products } from "~/server/db/schema"
import { eq, inArray } from "drizzle-orm"

import {
  filterProductParamsSchema,
  insertProductSchema,
  productIdSchema,
  productIdsSchema,
  productSlugSchema,
  searchTableProductParamsSchema,
  updateProductSchema,
  updateProductsStatusSchema,
  updateProductStatusSchema,
} from "~/lib/validations/product"

export const productsRouter = createTRPCRouter({
  getFilteredProducts: publicProcedure
    .input(filterProductParamsSchema)
    .query(async ({ input }) => getFilteredProducts(input)),
  /**
   * Get a list of products. Various filters can be applied to the list. [Admin only]
   * @param input.page - Page number
   * @param input.per_page - Number of products per page
   * @param input.sort - Sort column and order (e.g. "title.desc")
   * @param input.title - Filter products by title
   * @param input.status - Filter products by status
   * @param input.operator - Logical operator to use for filtering (and or or)
   * @param input.from - Filter products by createdAt date
   * @param input.to - Filter products by createdAt date
   * @returns TableProducts
   */
  getTableProducts: adminProcedure
    .input(searchTableProductParamsSchema)
    .query(async ({ input }) => getTableProducts(input)),
  /**
   * Get a product by id. This will return the product with all its images, options and variants. [Admin only]
   * @param input.id - Product id
   * @returns EditableProduct
   */
  getEditableProduct: adminProcedure
    .input(productIdSchema)
    .query(async ({ input }) => getEditableProduct(input)),
  /**
   * Get a product by slug. This will return the product with all its images, options and variants.
   * @param input.slug - Product slug
   * @returns PublicProduct
   */
  getPublicProduct: publicProcedure
    .input(productSlugSchema)
    .query(async ({ input }) => getPublicProduct(input)),
  /**
   * Get the metadata of a product by id. This will return the product metaTitle as title, description and the image with the highest rank.
   * @param input.id - Product id
   * @returns ProductMetadata
   */
  getProductMetadataById: adminProcedure
    .input(productIdSchema)
    .query(async ({ input, ctx }) => {
      const product = await ctx.db.query.products.findFirst({
        where: eq(products.id, input.id),
        columns: {
          title: true,
          metaTitle: true,
          description: true,
        },
        with: {
          productImages: {
            with: {
              image: true,
            },
          },
        },
      })

      if (!product) throw new TRPCError({ code: "NOT_FOUND" })

      return {
        title: product.metaTitle ?? product.title,
        description: product?.description,
        image: product?.productImages.find((img) => img.rank === 0)?.image,
      }
    }),
  /**
   * Get the metadata of a product by slug. This will return the product metaTitle as title, description and the image with the highest rank.
   * @param input.slug - Product slug
   * @returns ProductMetadata
   */
  getProductMetadataBySlug: publicProcedure
    .input(productSlugSchema)
    .query(async ({ input, ctx }) => {
      const product = await ctx.db.query.products.findFirst({
        where: eq(products.slug, input.slug),
        columns: {
          title: true,
          metaTitle: true,
          description: true,
        },
        with: {
          productImages: {
            with: {
              image: true,
            },
          },
        },
      })

      if (!product) throw new TRPCError({ code: "NOT_FOUND" })

      return {
        title: product.metaTitle ?? product.title,
        description: product.description,
        image: product.productImages.find((img) => img.rank === 0)?.image,
      }
    }),
  /**
   * Update a product. This will update the product with all its images, options and variants. [Admin only]
   * @param input.id - Product id
   * @param input.title - Product title
   * @param input.slug - Product slug
   * @param input.description - Product description
   * @param input.price - Product price
   * @param input.mrp - Product mrp
   * @param input.manageInventory - Product manageInventory
   * @param input.allowBackorder - Product allowBackorder
   * @param input.inventoryQuantity - Product inventoryQuantity
   * @param input.weight - Product weight
   * @param input.length - Product length
   * @param input.height - Product height
   * @param input.width - Product width
   * @param input.status - Product status
   * @param input.options - Product options
   * @param input.variants - Product variants
   * @param input.images - Product images
   * @param input.originCountry - Product originCountry
   * @param input.content - Product content
   * @param input.metaTitle - Product metaTitle
   * @param input.material - Product material
   * @returns Product
   */
  updateProduct: adminProcedure
    .input(updateProductSchema)
    .mutation(async ({ input }) => updateProduct(input)),
  /**
   * Create a product. This will create the product with all its images, options and variants. [Admin only]
   * @param input.title - Product title
   * @param input.slug - Product slug
   * @param input.description - Product description
   * @param input.price - Product price
   * @param input.mrp - Product mrp
   * @param input.manageInventory - Product manageInventory
   * @param input.allowBackorder - Product allowBackorder
   * @param input.inventoryQuantity - Product inventoryQuantity
   * @param input.weight - Product weight
   * @param input.length - Product length
   * @param input.height - Product height
   * @param input.width - Product width
   * @param input.status - Product status
   * @param input.options - Product options
   * @param input.variants - Product variants
   * @param input.images - Product images
   * @param input.originCountry - Product originCountry
   * @param input.content - Product content
   * @param input.metaTitle - Product metaTitle
   * @param input.material - Product material
   * @returns Product
   */
  createProduct: adminProcedure
    .input(insertProductSchema)
    .mutation(async ({ input }) => createProduct(input)),
  updateProductStatus: adminProcedure
    .input(updateProductStatusSchema)
    .mutation(async ({ input, ctx }) => {
      noStore()
      const [p] = await ctx.db
        .update(products)
        .set({ status: input.status })
        .where(eq(products.id, input.id))
        .returning()
      return p
    }),
  updateProductsStatus: adminProcedure
    .input(updateProductsStatusSchema)
    .mutation(async ({ input, ctx }) => {
      noStore()
      if (input.productIds.length < 1)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "At least one product must be selected to perform this action",
        })
      const r = await ctx.db
        .update(products)
        .set({ status: input.status })
        .where(
          inArray(
            products.id,
            input.productIds.map(({ id }) => id)
          )
        )
        .returning({
          id: products.id,
          status: products.status,
        })
      return r
    }),
  deleteProduct: adminProcedure
    .input(productIdSchema)
    .mutation(async ({ input, ctx }) => {
      noStore()
      const [p] = await ctx.db
        .delete(products)
        .where(eq(products.id, input.id))
        .returning()
      if (!p)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid product id",
        })
      return p
    }),
  deleteProducts: adminProcedure
    .input(productIdsSchema)
    .mutation(async ({ input, ctx }) => {
      noStore()
      if (input.length < 1)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "At least one product must be selected to perform this action",
        })
      const productIdArray = input.map(({ id }) => id)
      const rows = await ctx.db
        .delete(products)
        .where(inArray(products.id, productIdArray))
        .returning()
      return rows
    }),
})
