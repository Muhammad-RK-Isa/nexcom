import React from "react";

import { ProductsTableProvider } from "./_components/products-table-provider";
import type { SearchParams } from "~/types";
import { searchProductParamsSchema } from "~/schema";
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
            columnCount={10}
            searchableColumnCount={1}
            filterableColumnCount={2}
            cellWidths={[
              "1.5rem",
              "10rem",
              "5rem",
              "4.5rem",
              "4.5rem",
              "5.5rem",
              "6rem",
              "6.5rem",
              "6.5rem",
              "2.5rem",
            ]}
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
