import "~/styles/globals.css"
import "~/styles/prosemirror.css"

import type { Metadata, Viewport } from "next"
import { Poppins } from "next/font/google"

import { cn } from "~/lib/utils"
import Providers from "~/providers"

const poppins = Poppins({
  subsets: ["latin"],
  preload: true,
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Nexcom",
  description: "Crafted with ❤️ by Muhammad Isa",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "font-poppins scroll-smooth antialiased",
          poppins.className
        )}
      >
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}
