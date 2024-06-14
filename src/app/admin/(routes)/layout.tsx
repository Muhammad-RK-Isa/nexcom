import React from "react";

import { AdminHeader } from "./_components/header";
import { AdminSidebar } from "./_components/sidebar";

const AdminLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="relative flex min-h-screen w-full bg-muted/40 dark:bg-background">
      <React.Suspense>
        <AdminSidebar />
      </React.Suspense>
      <div className="flex w-full flex-col">
        <React.Suspense>
          <AdminHeader />
        </React.Suspense>
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
