import "~/styles/globals.css";

import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";

import Providers from "~/providers";
import { cn } from "~/lib/utils";

const poppins = Poppins({
  subsets: ["latin"],
  preload: true,
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Nexcom",
  description: "Crafted with ❤️ by Muhammad Isa",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "font-poppins scroll-smooth antialiased",
          poppins.className,
        )}
      >
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
