import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

import { Paths } from "./lib/constants";
import { UserRole } from "./server/db/schema";
import { adminPrefix, authRoutes, protectedRoutes } from "~/routes";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    const { nextUrl, nextauth } = req;

    let isLoggedIn = !!nextauth.token;
    let role = nextauth?.token?.role;

    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    const isAdminRoute = nextUrl.pathname.startsWith(adminPrefix);

    if (isLoggedIn && isAuthRoute)
      return NextResponse.redirect(new URL(Paths.Storefront, nextUrl));

    if (isAdminRoute) {
      let callbackUrl = nextUrl.pathname;
      if (nextUrl.search) {
        callbackUrl += nextUrl.search;
      }

      const encodedCallbackUrl = encodeURIComponent(callbackUrl);

      if (!isLoggedIn)
        return NextResponse.redirect(
          new URL(`${Paths.SignIn}?callbackUrl=${encodedCallbackUrl}`, nextUrl),
        );

      if (role !== UserRole.Values.admin)
        return NextResponse.redirect(new URL(Paths.Unauthorized, nextUrl));
    }

    return;
  },
  {
    callbacks: {
      authorized: async ({ token, req }) => {
        const { nextUrl } = req;

        const isProtectedRoute = protectedRoutes.includes(nextUrl.pathname);

        if (isProtectedRoute && !token) return false;

        return true;
      },
    },
  },
);

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
