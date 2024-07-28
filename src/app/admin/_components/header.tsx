"use client"

import React from "react"
import { signOut, useSession } from "next-auth/react"

import { useSidebar } from "~/lib/hooks/use-sidebar"
import { cn } from "~/lib/utils"
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
import { Icons } from "~/components/icons"

import { Breadcrumbs } from "./breadcrumbs"
import { MobileSidebar } from "./mobile-sidebar"

export const AdminHeader = () => {
  const { data } = useSession()
  const { isOpen, onOpen } = useSidebar()

  const user = data?.user

  const avatarFallback =
    user?.name
      ?.split(" ")
      .slice(0, 2)
      .map((word) => word.substring(0, 1))
      .join("") ?? ""

  return (
    <header className="sticky left-0 top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4 backdrop-blur-sm dark:bg-card lg:h-[60px] lg:px-6">
      <MobileSidebar />
      <Button
        size="icon"
        variant="ghost"
        onClick={onOpen}
        className={cn("group -ml-2 hidden", isOpen ? "lg:hidden" : "lg:flex")}
      >
        <Icons.panelLeftOpen className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
        <span className="sr-only">Open side panel</span>
      </Button>
      <Breadcrumbs />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto size-7 rounded-full"
          >
            <Avatar className="size-full">
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
          <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
