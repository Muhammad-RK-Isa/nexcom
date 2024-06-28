import React from "react"
import Link from "next/link"

import { cn } from "~/lib/utils"

import { Icons } from "./icons"
import { ThemeSelect } from "./theme-select"
import { Skeleton } from "./ui/skeleton"

interface FooterProps {
  className?: string
  props?: React.HTMLProps<HTMLDivElement>
}

const Footer: React.FC<FooterProps> = ({ className, props }) => {
  return (
    <div
      {...props}
      className={cn(
        "flex w-full flex-col items-center justify-between gap-8 border-t p-8 pt-8 sm:flex-row",
        className
      )}
    >
      <p className="text-xs">
        Developed by{" "}
        <Link href="https://twitter.com/muhammad_rk_isa" className="underline">
          Muhammad Isa
        </Link>
      </p>
      <div className="flex min-h-8 flex-row gap-8">
        <React.Suspense fallback={<Skeleton className="h-8 w-[104px]" />}>
          <ThemeSelect />
        </React.Suspense>
        <div className="flex items-center gap-2">
          <Link
            href="https://twitter.com/muhammad_rk_isa"
            target="_blank"
            rel="noreferrer"
            className="group p-1"
          >
            <Icons.x className="size-3.5 fill-primary/80 transition-all group-hover:fill-primary" />
            <span className="sr-only">Follow me on X</span>
          </Link>
          <Link
            href="https://github.com/Muhammad-RK-Isa/nexcom"
            target="_blank"
            rel="noreferrer"
            className="group p-1"
          >
            <Icons.gitHub className="size-4 fill-primary/80 transition-all group-hover:fill-primary" />
            <span className="sr-only">Follow me on GitHub</span>
          </Link>
          <Link
            href="https://discord.gg/P8GXYyH3ZU"
            target="_blank"
            rel="noreferrer"
            className="group p-1"
          >
            <Icons.linkedIn className="size-4 fill-primary/80 transition-all group-hover:fill-primary" />
            <span className="sr-only">Connect on LinkedIn</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Footer
