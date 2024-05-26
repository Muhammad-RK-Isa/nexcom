"use client";

import * as React from "react";
import type {
  CompleteTableProducts,
  DataTableFilterField,
  TableProduct,
} from "~/types";

import { DataTableAdvancedToolbar } from "~/components/data-table/advanced/data-table-advanced-toolbar";
import { DataTable } from "~/components/data-table/data-table";
import { DataTableToolbar } from "~/components/data-table/data-table-toolbar";
import { useDataTable } from "~/lib/hooks/use-data-table";

import { productStatuses } from "~/schemas";
import { getStatusIcon } from "../_lib/utils";
import { getColumns } from "./products-table-columns";
import { ProductsTableFloatingBar } from "./products-table-floating-bar";
import { useProductsTable } from "./products-table-provider";
import { TasksTableToolbarActions } from "./products-table-toolbar-actions";

interface ProductsTableProps {
  tableProducts: CompleteTableProducts;
}

export function ProductsTable({ tableProducts }: ProductsTableProps) {
  // Feature flags for showcasing some additional features. Feel free to remove them.
  const { featureFlags } = useProductsTable();

  const { data, pageCount } = tableProducts;

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getColumns(), []);

  /**
   * This component can render either a faceted filter or a search filter based on the `options` prop.
   *
   * @prop options - An array of objects, each representing a filter option. If provided, a faceted filter is rendered. If not, a search filter is rendered.
   *
   * Each `option` object has the following properties:
   * @prop {string} label - The label for the filter option.
   * @prop {string} value - The value for the filter option.
   * @prop {React.ReactNode} [icon] - An optional icon to display next to the label.
   * @prop {boolean} [withCount] - An optional boolean to display the count of the filter option.
   */
  const filterFields: DataTableFilterField<TableProduct>[] = [
    {
      label: "Title",
      value: "title",
      placeholder: "Filter titles...",
    },
    {
      label: "Status",
      value: "status",
      options: Object.values(productStatuses.Values).map((status) => ({
        label: status[0]?.toUpperCase() + status.slice(1),
        value: status,
        icon: getStatusIcon(status),
        withCount: true,
      })),
    },
  ];

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
    enableAdvancedFilter: featureFlags.includes("advancedFilter"),
    defaultPerPage: 10,
    defaultSort: "createdAt.desc",
  });

  return (
    <DataTable
      table={table}
      floatingBar={
        featureFlags.includes("floatingBar") ? (
          <ProductsTableFloatingBar table={table} />
        ) : null
      }
    >
      {featureFlags.includes("advancedFilter") ? (
        <DataTableAdvancedToolbar table={table} filterFields={filterFields}>
          <TasksTableToolbarActions table={table} />
        </DataTableAdvancedToolbar>
      ) : (
        <DataTableToolbar table={table} filterFields={filterFields}>
          <TasksTableToolbarActions table={table} />
        </DataTableToolbar>
      )}
    </DataTable>
  );
}
