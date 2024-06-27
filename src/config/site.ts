import { env } from "~/env"

export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Nexcom",
  description:
    "An e-commerce project built using TypeScript, Next.js, TailwindCSS, Shadcn-UI, Drizzle-ORM and Next-Auth.js.",
  url:
    env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://nexcom.muhammadisa.com",
  links: { github: "https://github.com/muhammad-rk-isa/nexcom" },
}
