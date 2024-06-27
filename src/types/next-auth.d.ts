import { type DefaultSession } from "next-auth"
import { type DefaultJWT } from "next-auth/jwt"

import { type UserRole } from "~/types"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      role: UserRole
    } & DefaultSession["user"]
  }

  interface User {
    role: UserRole
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    role: UserRole
  }
}
