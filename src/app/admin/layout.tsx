import React from "react"

import { AdminHeader } from "./_components/header"
import { HeaderSkeleton } from "./_components/header-skeleton"
import { Sidebar } from "./_components/sidebar"
import { SidebarSkeleton } from "./_components/sidebar-skeleton"

const AdminLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="relative flex min-h-screen w-full bg-muted/40 dark:bg-background">
      <React.Suspense fallback={<SidebarSkeleton />}>
        <Sidebar />
      </React.Suspense>
      <div className="flex w-full flex-col">
        <React.Suspense fallback={<HeaderSkeleton />}>
          <AdminHeader />
        </React.Suspense>
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout
