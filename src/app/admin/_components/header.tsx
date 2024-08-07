import React from "react"

import { currentUser } from "~/lib/auth/utils"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Skeleton } from "~/components/ui/skeleton"

import { Breadcrumbs } from "./breadcrumbs"
import DropddownSignOutItem from "./dropdown-sign-out-item"
import { MobileSidebar } from "./mobile-sidebar"

export const AdminHeader = async () => {
  const user = await currentUser()

  const avatarFallback =
    user?.name
      ?.split(" ")
      .slice(0, 2)
      .map((word) => word.substring(0, 1))
      .join("") ?? ""

  return (
    <header className="z-50 flex h-14 items-center gap-4 rounded-lg border bg-accent/50 p-6 px-4 backdrop-blur-sm lg:px-6">
      <MobileSidebar />
      <React.Suspense>
        <Breadcrumbs />
      </React.Suspense>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto size-7 rounded-full"
          >
            <Avatar className="size-full border">
              <AvatarImage src={user?.image ?? ""} alt="User avater" />
              <AvatarFallback className="text-sm">
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
          <React.Suspense fallback={<Skeleton className="h-5 w-[129px]" />}>
            <DropddownSignOutItem />
          </React.Suspense>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
