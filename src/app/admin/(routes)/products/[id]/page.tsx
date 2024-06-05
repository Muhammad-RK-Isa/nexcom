import React from "react";

import { api } from "~/trpc/server";
import { ProductFormMain } from "./_components/product-form-main";
import { notFound } from "next/navigation";

const ProductPage = async ({ params: { id } }: { params: { id: string } }) => {
  const product =
    id === "new" ? undefined : await api.products.getProductById({ id });

  if (!product && id !== "new") return notFound();

  return (
    <div className="-m-4 p-4 bg-grid-small-black/[0.1] dark:bg-grid-small-white/[0.3] lg:-m-6 lg:p-6">
      <React.Suspense>
        <ProductFormMain product={product} />
      </React.Suspense>
    </div>
  );
};

export default ProductPage;
