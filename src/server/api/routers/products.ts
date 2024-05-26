import {
  createProduct,
  deleteProduct,
  deleteProducts,
  updateProduct,
  updateProductStatus,
  updateProductsStatus,
} from "~/lib/api/products/mutations";
import {
  getProductById,
  getProducts,
  getTableProducts,
} from "~/lib/api/products/queries";
import {
  insertProductSchema,
  productIdSchema,
  productIdsSchema,
  searchProductParamsSchema,
  updateProductSchema,
  updateProductStatusSchema,
  updateProductsStatusSchema,
} from "~/schemas";
import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";

export const productsRouter = createTRPCRouter({
  getProducts: adminProcedure.query(async () => getProducts()),
  getTableProducts: adminProcedure
    .input(searchProductParamsSchema)
    .query(async ({ input }) => getTableProducts(input)),
  getProductById: adminProcedure
    .input(productIdSchema)
    .query(async ({ input }) => getProductById(input)),
  createProduct: adminProcedure
    .input(insertProductSchema)
    .mutation(async ({ input }) => createProduct(input)),
  updateProduct: adminProcedure
    .input(updateProductSchema)
    .mutation(async ({ input }) => updateProduct(input)),
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
});
