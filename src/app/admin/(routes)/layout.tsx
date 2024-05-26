import React from "react";

import { AdminHeader } from "./_components/header";
import { AdminSidebar } from "./_components/sidebar";

const AdminLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <React.Suspense>
        <AdminSidebar />
      </React.Suspense>
      <div className="relative flex flex-col sm:gap-4 sm:pb-4 sm:pl-14">
        <div className="sticky top-0 z-30 flex w-full flex-col py-4">
          <AdminHeader />
        </div>
        <main className="flex-1 p-4 sm:px-6 sm:py-0">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
