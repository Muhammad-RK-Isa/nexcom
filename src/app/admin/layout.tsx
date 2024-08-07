import React from "react"

import { ScrollArea } from "~/components/ui/scroll-area"

import { AdminHeader } from "./_components/header"
import { Sidebar } from "./_components/sidebar"

const AdminLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="relative flex flex-col lg:grid lg:h-screen lg:w-screen lg:grid-cols-[256px,1fr] lg:overflow-hidden">
      <Sidebar />
      <div className="flex w-full flex-col p-4 pb-0 lg:gap-4 lg:pb-4 lg:pl-0">
        <AdminHeader />
        <main className="size-full overflow-hidden rounded-lg lg:border lg:bg-accent/50">
          <ScrollArea className="relative h-[calc(100vh-72px)] lg:h-[calc(100vh-102px)] lg:p-4">
            {children}
          </ScrollArea>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
