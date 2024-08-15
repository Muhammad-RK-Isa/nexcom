import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc"

import {
  createProduct,
  deleteProduct,
  deleteProducts,
  updateProductsStatus,
  updateProductStatus,
} from "~/lib/api/products/mutations"
import {
  getProductById,
  getProductBySlug,
  getProducts,
  getTableProducts,
} from "~/lib/api/products/queries"
import {
  insertProductSchema,
  productIdSchema,
  productIdsSchema,
  productSlugSchema,
  searchProductParamsSchema,
  searchTableProductParamsSchema,
  updateProductsStatusSchema,
  updateProductStatusSchema,
} from "~/lib/validations/product"

export const productsRouter = createTRPCRouter({
  getProducts: publicProcedure
    .input(searchProductParamsSchema)
    .query(async ({ input }) => getProducts(input)),
  getTableProducts: adminProcedure
    .input(searchTableProductParamsSchema)
    .query(async ({ input }) => getTableProducts(input)),
  getProductById: adminProcedure
    .input(productIdSchema)
    .query(async ({ input }) => getProductById(input)),
  getProductBySlug: publicProcedure
    .input(productSlugSchema)
    .query(async ({ input }) => getProductBySlug(input)),
  createProduct: adminProcedure
    .input(insertProductSchema)
    .mutation(async ({ input }) => createProduct(input)),
  updateProductStatus: adminProcedure
    .input(updateProductStatusSchema)
    .mutation(async ({ input }) => updateProductStatus(input)),
  updateProductsStatus: adminProcedure
    .input(updateProductsStatusSchema)
    .mutation(async ({ input }) => updateProductsStatus(input)),
  deleteProduct: adminProcedure
    .input(productIdSchema)
    .mutation(async ({ input }) => deleteProduct(input)),
  deleteProducts: adminProcedure
    .input(productIdsSchema)
    .mutation(async ({ input }) => deleteProducts(input)),
})
