"use client"

import React from "react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { SessionProvider } from "next-auth/react"

import { useMediaQuery } from "~/lib/hooks/use-media-query"
import { Toaster } from "~/components/ui/sonner"
import { TooltipProvider } from "~/components/ui/tooltip"
import { TRPCReactProvider } from "~/trpc/react"

import ProgressBarProvider from "./progress-bar-provider"
import { ThemeProvider } from "./theme-provider"

const Providers = ({ children }: React.PropsWithChildren) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  return (
    <SessionProvider>
      <ThemeProvider
        enableSystem
        disableTransitionOnChange
        attribute="class"
        defaultTheme="light"
      >
        <ProgressBarProvider />
        <Toaster richColors expand={isDesktop ? true : false} />
        <TRPCReactProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </TRPCReactProvider>
        <SpeedInsights />
      </ThemeProvider>
    </SessionProvider>
  )
}

export default Providers
