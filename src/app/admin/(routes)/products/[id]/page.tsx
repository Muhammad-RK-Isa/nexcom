import React from "react";

import { api } from "~/trpc/server";
import { ProductFormMain } from "./_components/product-form-main";
import { notFound } from "next/navigation";
import { ProductFormSkeleton } from "./_components/product-form-skeleton";

const ProductPage = async ({ params: { id } }: { params: { id: string } }) => {
  const product =
    id === "new" ? null : await api.products.getProductById({ id });

  if (!product && id !== "new") return notFound();

  return (
    <div className="-m-4 bg-fixed p-4 lg:-m-6 lg:p-6">
      <React.Suspense fallback={<ProductFormSkeleton />}>
        <ProductFormMain product={product} />
      </React.Suspense>
    </div>
  );
};

export default ProductPage;
