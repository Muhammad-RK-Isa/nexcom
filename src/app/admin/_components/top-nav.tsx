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

const TopNav = async () => {
  const user = await currentUser()

  const avatarFallback =
    user?.name
      ?.split(" ")
      .slice(0, 2)
      .map((word) => word.substring(0, 1))
      .join("") ?? ""

  return (
    <nav className="fixed inset-x-0 top-0 z-30 flex h-[54px] items-center gap-4 border-b bg-background p-4 md:inset-x-auto md:w-[calc(100%-53px)]">
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
    </nav>
  )
}

export default TopNav
