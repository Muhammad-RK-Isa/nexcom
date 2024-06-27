"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouter } from "next-nprogress-bar"

import { APP_TITLE } from "~/lib/constants"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "~/components/ui/sheet"
import { Icons } from "~/components/icons"
import { ThemeSelect } from "~/components/theme-select"

import { adminNavLinks } from "../_lib/utils"

export const MobileSidebar = () => {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="-ml-2 size-8 lg:hidden"
        >
          <Icons.panelLeft className="size-4" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex h-full flex-col justify-between border-r-border/40 bg-background dark:bg-card sm:max-w-xs"
      >
        <nav className="grid gap-4">
          <SheetClose asChild>
            <Link href="/">
              <Icons.nextjsfull className="mb-4 h-5 px-2.5 text-primary" />
              <span className="sr-only">{APP_TITLE}</span>
            </Link>
          </SheetClose>
          {adminNavLinks.map(({ title, icon: Icon, path, active }, idx) => (
            <SheetClose key={idx} asChild>
              <button
                onClick={() => router.push(path)}
                disabled={!active}
                className={cn(
                  "flex items-center gap-4 px-2.5 py-1.5 hover:text-foreground disabled:text-muted-foreground/50",
                  path === pathname
                    ? "rounded-lg bg-accent text-foreground"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="size-5" />
                {title}
              </button>
            </SheetClose>
          ))}
          <Link
            href="/admin/settings"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Icons.settings className="size-5" />
            Settings
          </Link>
        </nav>
        <ThemeSelect />
      </SheetContent>
    </Sheet>
  )
}
