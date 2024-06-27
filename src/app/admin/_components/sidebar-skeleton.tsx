import React from "react"

import { Skeleton } from "~/components/ui/skeleton"

export const SidebarSkeleton = () => {
  return (
    <aside className="sticky left-0 top-0 hidden h-screen max-h-screen w-[280px] gap-2 overflow-x-hidden border-r bg-background dark:bg-card md:flex md:flex-col">
      <div className="flex h-14 items-center gap-2 border-b px-4 text-xl font-semibold uppercase lg:h-[60px] lg:px-7">
        <Skeleton className="h-7 w-[88.1px]" />
        <Skeleton className="-mr-4 ml-auto size-7" />
      </div>
      <div className="flex flex-1 flex-col py-3">
        <nav className="grid items-start gap-1 px-2 text-sm font-medium lg:px-4">
          {Array(5)
            .fill(0)
            .map((_, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all"
              >
                <Skeleton className="size-5 rounded-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
        </nav>
        <div className="mt-auto flex items-center gap-1 p-4">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="ml-auto size-8 rounded-full" />
        </div>
      </div>
    </aside>
  )
}
