import { and, eq, inArray, ne } from "drizzle-orm";

import { db } from "~/server/db";
import {
  productOptionValues,
  productOptions,
  productVariants,
  products,
  variantsOptionValues,
} from "~/server/db/schema";
import type {
  CreateProductInput,
  ProductId,
  ProductOptionValue,
  UpdateProductInput,
  UpdateProductStatusInput,
  UpdateProductsStatusInput,
} from "~/types";

export const createProduct = async (product: CreateProductInput) => {
  try {
    const [existingRow] = await db
      .select()
      .from(products)
      .where(eq(products.title, product.title));
    if (existingRow) throw new Error("Existing product");

    const p = await db.transaction(async (tx) => {
      const [productRecord] = await tx
        .insert(products)
        .values({
          ...product,
          weight: product.weight.value,
          weightUnit: product.weight.unit,
          length: product.length?.value,
          lengthUnit: product.length?.unit,
          height: product.height?.value,
          heightUnit: product.height?.unit,
        })
        .returning();

      if (productRecord) {
        for (const option of product.options) {
          const [newOption] = await tx
            .insert(productOptions)
            .values({
              title: option.title,
              id: option.id,
              rank: option.rank,
              productId: productRecord.id,
            })
            .returning();

          if (newOption)
            for (const value of option.values) {
              await tx.insert(productOptionValues).values({
                ...value,
                optionId: newOption.id,
              });
            }
        }

        for (const variant of product.variants) {
          const [variantRecord] = await tx
            .insert(productVariants)
            .values({
              id: variant.id,
              price: variant.price,
              inventoryQuantity: variant.inventoryQuantity,
              productImageId: variant.productImageId,
              productId: productRecord.id,
            })
            .returning();

          if (variantRecord && variant.optionValues) {
            for (const optionValue of variant.optionValues) {
              await tx.insert(variantsOptionValues).values({
                variantId: variantRecord.id,
                optionValueId: optionValue.id,
              });
            }
          }
        }
        return productRecord;
      }
    });
    return { product: p };
  } catch (err) {
    throw err;
  }
};

export const updateProduct = async (product: UpdateProductInput) => {
  try {
    const [existingRow] = await db
      .select()
      .from(products)
      .where(
        and(eq(products.title, product.title), ne(products.id, product.id!)),
      );

    if (existingRow) throw new Error("Existing product");

    const p = await db.transaction(async (tx) => {
      await tx
        .update(products)
        .set({
          ...product,
          weight: product.weight.value,
          weightUnit: product.weight.unit,
          length: product.length?.value,
          lengthUnit: product.length?.unit,
          height: product.height?.value,
          heightUnit: product.height?.unit,
        })
        .where(eq(products.id, product.id));

      const productRecord = await tx.query.products.findFirst({
        where: (t, { eq }) => eq(t.id, product.id),
        with: {
          options: true,
          variants: true,
        },
      });

      const optionValueRecords = await tx.query.productOptionValues.findMany({
        where: (t, { inArray }) =>
          inArray(t.optionId, [
            ...(productRecord?.options.map(({ id }) => id) ?? "null"),
          ]),
        with: {
          option: true,
        },
      });

      if (productRecord) {
        const updatableOptions = product.options.filter(({ id }) =>
          productRecord.options.some((o) => o.id === id),
        );

        const updatableOptionValues = new Set<ProductOptionValue>();
        product.options.map(({ values }) => {
          values.map((v) => {
            optionValueRecords.some(({ id }) => v.id === id) &&
              updatableOptionValues.add(v);
          });
        });

        if (
          updatableOptions.length === product.options.length &&
          updatableOptionValues.size === optionValueRecords.length
        ) {
          console.log("✅ Updatable. Updating...");
          for (const option of updatableOptions) {
            await tx
              .update(productOptions)
              .set({
                title: option.title,
                rank: option.rank,
                productId: productRecord.id,
              })
              .where(eq(productOptions.id, option.id))
              .returning();
          }

          for (const optVal of updatableOptionValues) {
            await tx
              .update(productOptionValues)
              .set(optVal)
              .where(eq(productOptionValues.id, optVal.id));
          }

          for (const variant of product.variants) {
            await tx
              .update(productVariants)
              .set({
                price: variant.price,
                inventoryQuantity: variant.inventoryQuantity,
                productImageId: variant.productImageId,
                productId: variant.productId,
              })
              .where(eq(productVariants.id, variant.id!));
          }
          return;
        }

        console.log("❌ Not Updatable. Recreating everything...");
        await tx.delete(productOptions).where(
          inArray(
            productOptions.id,
            productRecord.options.map(({ id }) => id),
          ),
        );

        await tx.delete(productOptionValues).where(
          inArray(
            productOptionValues.id,
            optionValueRecords.map(({ id }) => id),
          ),
        );

        await tx
          .delete(productVariants)
          .where(eq(productVariants.productId, productRecord.id));

        for (const option of product.options) {
          const [newOption] = await tx
            .insert(productOptions)
            .values({
              title: option.title,
              id: option.id,
              rank: option.rank,
              productId: productRecord.id,
            })
            .returning();

          if (newOption)
            for (const value of option.values) {
              await tx.insert(productOptionValues).values({
                ...value,
                optionId: newOption.id,
              });
            }
        }

        for (const variant of product.variants) {
          const [variantRecord] = await tx
            .insert(productVariants)
            .values({
              id: variant.id,
              price: variant.price,
              inventoryQuantity: variant.inventoryQuantity,
              productImageId: variant.productImageId,
              productId: productRecord.id,
            })
            .returning();

          if (variantRecord && variant.optionValues) {
            for (const optionValue of variant.optionValues) {
              await tx.insert(variantsOptionValues).values({
                variantId: variantRecord.id,
                optionValueId: optionValue.id,
              });
            }
          }
        }
        return productRecord;
      }
    });
    return p;
  } catch (err) {
    throw err;
  }
};

export const updateProductStatus = async ({
  id,
  status,
}: UpdateProductStatusInput) => {
  try {
    const [p] = await db
      .update(products)
      .set({ status })
      .where(eq(products.id, id))
      .returning();
    return p;
  } catch (err) {
    throw err;
  }
};

export const updateProductsStatus = async ({
  status,
  productIds,
}: UpdateProductsStatusInput) => {
  if (productIds.length < 1)
    throw new Error(
      "At least one product must be selected to perform this action",
    );
  try {
    const result = await db
      .update(products)
      .set({ status })
      .where(
        inArray(
          products.id,
          productIds.map(({ id }) => id),
        ),
      );
    return result;
  } catch (err) {
    throw err;
  }
};

export const deleteProduct = async ({ id }: ProductId) => {
  try {
    const [p] = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning();
    return p;
  } catch (err) {
    throw err;
  }
};

export const deleteProducts = async (ids: ProductId[]) => {
  const productIdArray = ids.map(({ id }) => id);
  try {
    const rows = await db
      .delete(products)
      .where(inArray(products.id, productIdArray))
      .returning();
    return rows;
  } catch (error) {
    throw error;
  }
};
