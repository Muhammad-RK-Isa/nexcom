"use client"

import React from "react"
import Link from "next/link"

import { APP_TITLE, Paths } from "~/lib/constants"
import { cn } from "~/lib/utils"
import { ThemeSelect } from "~/components/theme-select"

import { adminNavLinks } from "../_lib/utils"

export const Sidebar = () => {
  return (
    <aside className="hidden space-y-4 p-4 lg:flex lg:flex-col">
      <div className="flex h-14 items-center rounded-lg border bg-muted/50 p-6 text-xl font-semibold uppercase">
        <Link href={Paths.Storefront}>
          <span className="text-clip bg-primary/60 bg-[linear-gradient(90deg,transparent_25%,rgba(255,255,255,.5)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-clip-text bg-no-repeat text-transparent transition-[background-position_0s_ease] hover:animate-shine dark:bg-primary/40">
            {APP_TITLE}
          </span>
        </Link>
      </div>
      <div className="flex flex-1 flex-col rounded-lg border bg-muted/50 p-6">
        <nav className="grid items-start gap-2">
          {adminNavLinks.map(({ title, icon: Icon, path }, idx) => (
            <Link
              key={idx}
              href={path}
              className={cn("group flex items-center gap-2 p-2")}
            >
              <Icon className="size-5 text-muted-foreground transition-colors group-hover:text-foreground" />
              {title}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex items-center justify-between p-4 pb-2">
          <ThemeSelect />
        </div>
      </div>
    </aside>
  )
}
