import React from "react";

import { AdminHeader } from "./_components/header";
import { AdminSidebar } from "./_components/sidebar";

const AdminLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="relative grid min-h-screen w-full bg-muted/40 dark:bg-background md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <React.Suspense>
        <AdminSidebar />
      </React.Suspense>
      <div className="grid grid-cols-1">
        <div className="flex flex-col">
          <AdminHeader />
          <main className="p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
