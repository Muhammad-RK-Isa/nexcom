import React from "react"

import { ScrollArea } from "~/components/ui/scroll-area"

import { AdminHeader } from "./_components/header"
import { Sidebar } from "./_components/sidebar"

const AdminLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="relative flex flex-col lg:grid lg:h-screen lg:w-screen lg:grid-cols-[256px,1fr] lg:overflow-hidden">
      <Sidebar />
      <div className="flex w-full flex-col gap-4 p-4 pl-0">
        <AdminHeader />
        <main className="h-full">
          <ScrollArea className="h-full w-full rounded-lg border bg-accent/50 p-4">
            {children}
          </ScrollArea>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
