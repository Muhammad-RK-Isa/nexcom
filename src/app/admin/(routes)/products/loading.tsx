import React from "react";
import { DataTableSkeleton } from "~/components/skeletons/data-table-skeleton";

const Loading = () => {
  return (
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
  );
};

export default Loading;
