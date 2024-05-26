import React from "react";

import { ProductsTableProvider } from "./_components/products-table-provider";
import { DateRangePicker } from "~/components/date-range-picker";
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
      <DateRangePicker
        triggerSize="sm"
        triggerClassName="ml-auto w-56 sm:w-60"
        align="end"
        dateRange={
          search.from && search.to
            ? { from: new Date(search.from), to: new Date(search.to) }
            : undefined
        }
      />
      <React.Suspense
        fallback={
          <DataTableSkeleton
            columnCount={5}
            searchableColumnCount={1}
            filterableColumnCount={2}
            cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
            shrinkZero
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
