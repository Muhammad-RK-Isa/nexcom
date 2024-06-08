import React from "react";
import Link from "next/link";

import { buttonVariants } from "~/components/ui/button";
import { APP_TITLE, Paths } from "~/lib/constants";
import { SignOut } from "./_components/sign-out";
import { currentUser } from "~/lib/auth/utils";
import { cn } from "~/lib/utils";

const StorefrontHomepage = async () => {
  const user = await currentUser();
  return (
    <div className="flex flex-col gap-y-6 px-12 pt-40 text-center text-4xl font-semibold">
      Welcome to {APP_TITLE}
      {!user ? (
        <Link
          href={Paths.SignIn}
          className={cn(buttonVariants({ variant: "link" }))}
        >
          Sign in
        </Link>
      ) : (
        <>
          <div className="mx-auto grid gap-2 rounded-md border bg-muted/40 p-4 text-sm font-normal">
            <code>{user?.name}</code>
            <code>{user?.email}</code>
          </div>
          <div className="mx-auto flex">
            {user?.role === "admin" && (
              <Link
                href={Paths.Admin}
                className={cn(buttonVariants({ variant: "link" }))}
              >
                Admin
              </Link>
            )}
            <React.Suspense>
              <SignOut />
            </React.Suspense>
          </div>
        </>
      )}
    </div>
  );
};

export default StorefrontHomepage;
