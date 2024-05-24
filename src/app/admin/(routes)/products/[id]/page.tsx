import React from "react";

import { api } from "~/trpc/server";

const ProductPage = async ({ params: { id } }: { params: { id: string } }) => {
  const product = await api.product.get({ id });

  return (
    <div>
      ProductPage
      <br />
      <br />
      <p className="break-all">Product: {JSON.stringify(product) ?? "N/A"}</p>
    </div>
  );
};

export default ProductPage;
