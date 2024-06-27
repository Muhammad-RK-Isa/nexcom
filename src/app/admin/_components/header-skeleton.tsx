import React from "react"

import { Skeleton } from "~/components/ui/skeleton"

export const HeaderSkeleton = () => {
  return (
    <div className="flex h-14 items-center gap-4 border-b bg-background px-4 dark:bg-card lg:h-[60px] lg:px-6">
      <Skeleton className="size-8 rounded-full md:hidden" />
      <Skeleton className="ml-auto size-8 rounded-full" />
    </div>
  )
}
