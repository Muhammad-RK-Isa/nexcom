import { getUserByEmail } from "~/server/data/user"
import { signInSchema } from "~/server/db/schema"
import { compare } from "bcrypt-ts"
import { eq } from "drizzle-orm"
import { getServerSession, type NextAuthOptions } from "next-auth"
import { type Adapter } from "next-auth/adapters"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

import { Paths } from "~/lib/constants"
import { env } from "~/env"

import { drizzleAdapter } from "./adapter"
import { db } from "./db"
import { users } from "./db/schema"

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  events: {
    linkAccount: async ({ user, profile }) => {
      await db
        .update(users)
        .set({
          emailVerified: new Date(),
          image: profile.image,
        })
        .where(eq(users.id, user.id))
    },
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (token.role && session.user) {
        session.user.role = token.role
      }

      if (session.user) {
        session.user.name = token.name
        session.user.email = token.email
      }

      return session
    },
    jwt: async ({ token, user }) => {
      if (!token.sub) return token

      if (!user) return token

      token.role = user.role!

      return token
    },
  },
  adapter: drizzleAdapter as Adapter,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = signInSchema.safeParse(credentials)

        if (validatedFields.success) {
          const { email, password } = validatedFields.data

          const user = await getUserByEmail(email)

          if (!user || !user.hashedPassword)
            throw new Error("Incorrect email or password")

          const passwordsMatch = await compare(password, user.hashedPassword)

          if (passwordsMatch) return user
          else throw new Error("Incorrect email or password")
        }
        return null
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  session: {
    strategy: "jwt",
    maxAge: 1800,
  },
  debug: env.NODE_ENV === "development",
  pages: {
    signIn: Paths.SignIn,
    newUser: Paths.SignUp,
  },
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions)
