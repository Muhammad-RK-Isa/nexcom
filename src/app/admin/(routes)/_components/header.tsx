import React from "react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

import { Breadcrumbs } from "~/components/breadcrumbs";
import { currentUser } from "~/lib/auth/utils";
import { AdminMobileSidebar } from "./mobile-sidebar";
import { DropdownItemLogout } from "./dropdown-item-logout";

export const AdminHeader = async () => {
  const user = await currentUser();

  const avatarFallback =
    user?.name
      ?.split(" ")
      .slice(0, 2)
      .map((word) => word.substring(0, 1))
      .join("") ?? "";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <React.Suspense>
        <AdminMobileSidebar />
      </React.Suspense>
      <React.Suspense>
        <Breadcrumbs />
      </React.Suspense>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="ml-auto rounded-full">
            <Avatar className="size-8">
              <AvatarImage src={user?.image ?? ""} alt="User avater" />
              <AvatarFallback className="text-xs">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <h4 className="text-sm font-medium">{user?.name}</h4>
            <p className="text-xs font-normal text-muted-foreground">
              {user?.email}
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>Profile</DropdownMenuItem>
          <DropdownMenuItem disabled>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <React.Suspense>
            <DropdownItemLogout />
          </React.Suspense>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
