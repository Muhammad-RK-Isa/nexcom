import React from "react";

import { api } from "~/trpc/server";
import { ProductFormMain } from "./_components/product-form-main";
import { notFound } from "next/navigation";

const ProductPage = async ({ params: { id } }: { params: { id: string } }) => {
  const product =
    id === "new" ? undefined : await api.products.getProductById({ id });

  if (!product && id !== "new") return notFound();

  return (
    <React.Suspense>
      {/* <ProductFormMain product={product} /> */}
      <>Nothing to show here</>
    </React.Suspense>
  );
};

export default ProductPage;
