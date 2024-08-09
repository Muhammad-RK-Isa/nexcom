"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { useRouter } from "next-nprogress-bar"

import { APP_TITLE, Paths } from "~/lib/constants"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"

import { adminNavLinks } from "../_lib/utils"

export const Sidebar = () => {
  const router = useRouter()
  const pathname = usePathname()

  const [isExpanded, setIsExpanded] = React.useState(false)

  return (
    <motion.aside
      className="fixed inset-y-0 left-0 z-50 hidden space-y-4 border-r bg-background hover:shadow-sm hover:drop-shadow-sm md:flex md:flex-col"
      transition={{ duration: 0.15 }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      initial={{ width: 54 }}
      animate={{ width: isExpanded ? 192 : 54 }}
    >
      <div className="flex h-[54px] items-center border-b pl-5 text-xl font-semibold uppercase">
        <Link href={Paths.Storefront} className="flex items-center">
          <div className="flex items-center overflow-hidden text-clip bg-primary/60 bg-[linear-gradient(90deg,transparent_25%,rgba(255,255,255,.5)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-clip-text bg-no-repeat text-transparent transition-[background-position_0s_ease] hover:animate-shine dark:bg-primary/40">
            <span>{APP_TITLE.charAt(0)}</span>
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: isExpanded ? "auto" : 0 }}
              transition={{ duration: 0.15 }}
            >
              {APP_TITLE.substring(1)}
            </motion.span>
          </div>
        </Link>
      </div>
      <div className="flex flex-1 flex-col">
        <nav className="flex flex-col space-y-2.5 px-2">
          {adminNavLinks.map(({ title, icon: Icon, path }, idx) => (
            <Button
              key={idx}
              onClick={() => {
                router.push(path)
                setIsExpanded(false)
              }}
              variant="ghost"
              className={cn(
                "group flex items-start justify-start p-2 transition-colors",
                pathname === path && "bg-accent"
              )}
            >
              <Icon className="mr-2 size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
              <motion.span
                initial={{ width: 0 }}
                animate={{
                  width: isExpanded ? "auto" : 0,
                }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden text-muted-foreground group-hover:text-foreground"
              >
                {title}
              </motion.span>
            </Button>
          ))}
        </nav>
      </div>
    </motion.aside>
  )
}
