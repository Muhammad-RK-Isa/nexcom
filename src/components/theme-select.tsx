"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { cn } from "~/lib/utils"
import { Icons } from "~/components/icons"

import { Button } from "./ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

interface ThemeToggleProps {
  className?: string
  tooltipSide?: "right" | "left" | "top" | "bottom"
}

export const ThemeSelect: React.FC<ThemeToggleProps> = ({
  className,
  tooltipSide = "top",
}) => {
  const { theme, setTheme, themes } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {themes.map((thm, idx) => (
        <Tooltip key={idx}>
          <TooltipTrigger asChild>
            <Button
              variant={"ghost"}
              size={"icon"}
              className={cn(
                "size-max cursor-pointer rounded-full border p-2 transition-colors hover:text-primary",
                theme === thm
                  ? "border-border bg-accent text-primary"
                  : "border-transparent text-muted-foreground"
              )}
              onClick={() => setTheme(thm)}
            >
              {thm === "light" ? (
                <Icons.sun className="size-4" />
              ) : thm === "dark" ? (
                <Icons.moon className="size-4" />
              ) : thm === "system" ? (
                <Icons.monitor className="size-4" />
              ) : null}
            </Button>
          </TooltipTrigger>
          <TooltipContent side={tooltipSide} className="capitalize">
            Switch to {thm} mode
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}
