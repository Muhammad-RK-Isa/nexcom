import React from "react"

import { Sidebar } from "./_components/sidebar"
import TopNav from "./_components/top-nav"

const AdminLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="relative flex min-h-screen flex-col md:grid md:grid-cols-[54px,1fr]">
      <Sidebar />
      <div className="grid grid-rows-[54px,1fr] md:col-start-2">
        <TopNav />
        <div className="row-start-2 min-h-[calc(100vh-54px)] w-screen bg-accent/50 p-4 dark:bg-background md:w-[calc(100vw-54px)]">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
