import Link from "next/link";
import React from "react";

import { buttonVariants } from "~/components/ui/button";
import { currentUser } from "~/lib/auth/utils";
import { APP_TITLE, Paths } from "~/lib/constants";
import { cn } from "~/lib/utils";
import { SignOut } from "./_components/sign-out";

const StorefrontHomepage = async () => {
  const user = await currentUser();

  return (
    <div className="flex flex-col gap-y-6 px-12 pt-40 text-center text-4xl font-semibold">
      Welcome to {APP_TITLE}
      <p className="break-all text-sm font-normal">{JSON.stringify(user)}</p>
      {!user ? (
        <Link
          href={Paths.SignIn}
          className={cn(buttonVariants({ variant: "link" }))}
        >
          Sign in
        </Link>
      ) : (
        <React.Suspense>
          <SignOut />
        </React.Suspense>
      )}
    </div>
  );
};

export default StorefrontHomepage;
