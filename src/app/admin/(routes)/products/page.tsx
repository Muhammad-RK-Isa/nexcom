import React from "react";

import { ProductsTableProvider } from "./_components/products-table-provider";
import type { SearchParams } from "~/types";
import { searchProductParamsSchema } from "~/schemas";
import { DataTableSkeleton } from "~/components/skeletons/data-table-skeleton";
import { ProductsTable } from "./_components/products-table";
import { api } from "~/trpc/server";

interface ProductsPageProps {
  searchParams: SearchParams;
}

const ProductsPage: React.FC<ProductsPageProps> = async ({ searchParams }) => {
  const search = searchProductParamsSchema.parse(searchParams);

  const tableProducts = await api.products.getTableProducts(search);

  return (
    <ProductsTableProvider>
      <React.Suspense
        fallback={
          <DataTableSkeleton
            columnCount={8}
            searchableColumnCount={1}
            filterableColumnCount={2}
            cellWidths={[
              "2.5rem",
              "30rem",
              "7rem",
              "7rem",
              "7rem",
              "7rem",
              "9rem",
              "9rem",
              "9rem",
              "4rem",
            ]}
            shrinkZero
            showToolbarToggles
          />
        }
      >
        {/**
         * Passing promises and consuming them using React.use for triggering the suspense fallback.
         * @see https://react.dev/reference/react/use
         */}
        <ProductsTable tableProducts={tableProducts} />
      </React.Suspense>
    </ProductsTableProvider>
  );
};

export default ProductsPage;
