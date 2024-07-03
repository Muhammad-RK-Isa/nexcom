"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, useScroll, useTransform } from "framer-motion"

import { APP_TITLE } from "~/lib/constants"
import { cn } from "~/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu"
import { Icons } from "~/components/icons"

import { navLinks } from "../_lib/nav-links"

const Navbar = () => {
  const { scrollY } = useScroll()

  const padding = useTransform(scrollY, [0, 300], ["1.75rem", "1.25rem"])

  const logoFontSizeDesktop = useTransform(
    scrollY,
    [0, 300],
    ["1.75rem", "1.5rem"]
  )
  const logoFontSizeMobile = useTransform(
    scrollY,
    [0, 300],
    ["1.75rem", "1.5rem"]
  )

  const border = useTransform(
    scrollY,
    [0, 300],
    ["0", "1px solid hsl(var(--border"]
  )

  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  console.log(scrollY.get())

  return (
    <motion.nav
      className={cn(
        "sticky top-0 z-50 flex w-full items-center justify-between bg-background px-10"
      )}
      style={{
        paddingTop: padding,
        paddingBottom: padding,
        borderBottom: border,
      }}
    >
      <NavigationMenu className="hidden lg:flex">
        <NavigationMenuList className="space-x-8">
          {navLinks.map((item) => (
            <NavigationMenuItem key={item.heading}>
              {item.subLinks ? (
                <>
                  <NavigationMenuTrigger
                    variant={"transparent"}
                    showIndicator={false}
                    className="lg:text-md px-0 py-0 font-medium md:text-base"
                  >
                    {item.heading}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="flex space-x-6 p-6">
                      {item.subLinks?.map((subItem) => (
                        <li
                          key={subItem.href}
                          className="flex flex-col space-y-3"
                        >
                          <Link
                            href={subItem.href}
                            className="font-medium underline-offset-4 hover:underline"
                          >
                            {subItem.heading}
                          </Link>
                          {subItem.subLinks?.map((subSubItem) => (
                            <ul key={subSubItem.href} className="flex flex-col">
                              <li>
                                <Link
                                  href={subSubItem.href}
                                  className="flex items-center text-nowrap text-sm text-muted-foreground underline-offset-2 transition-all hover:text-primary hover:underline"
                                >
                                  {subSubItem.heading}
                                </Link>
                              </li>
                            </ul>
                          ))}
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <NavigationMenuLink
                  href={item.href}
                  className={cn(
                    navigationMenuTriggerStyle({ variant: "transparent" })
                  )}
                >
                  {item.heading}
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <Link href="/">
        <motion.span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-clip bg-primary/60 bg-[linear-gradient(90deg,transparent_25%,rgba(255,255,255,.5)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-clip-text bg-no-repeat font-semibold uppercase text-transparent transition-[background-position_0s_ease] hover:animate-shine dark:bg-primary/40"
          style={{
            fontSize: isMobile ? logoFontSizeMobile : logoFontSizeDesktop,
          }}
        >
          {APP_TITLE}
        </motion.span>
      </Link>
      <div className="flex items-center space-x-6 md:space-x-8 lg:space-x-10">
        <Icons.search className="size-4" />
      </div>
    </motion.nav>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

export default Navbar
