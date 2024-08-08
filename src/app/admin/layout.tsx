import React from "react"

import { AdminHeader } from "./_components/header"
import { Sidebar } from "./_components/sidebar"

const AdminLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="relative flex min-h-screen flex-col md:grid md:grid-cols-[54px,1fr]">
      <div>
        <Sidebar />
      </div>
      <div className="flex w-full flex-col">
        <AdminHeader />
        <main className="p-4">{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout
