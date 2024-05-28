import React from "react";
import { DataTableSkeleton } from "~/components/skeletons/data-table-skeleton";

const Loading = () => {
  return (
    <DataTableSkeleton
      columnCount={10}
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
    />
  );
};

export default Loading;
