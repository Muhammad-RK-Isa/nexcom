"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { Button, buttonVariants } from "~/components/ui/button";
import { Paths } from "~/lib/constants";
import { useClientCurrentUser } from "~/lib/hooks/use-client-current-user";
import { cn } from "~/lib/utils";

const StorefrontHomepage = () => {
  const user = useClientCurrentUser();

  return (
    <div className="flex flex-col gap-y-6 px-12 pt-40 text-center text-4xl font-semibold">
      Welcome to Nextcom
      <p className="break-all text-sm font-normal">{JSON.stringify(user)}</p>
      {!user ? (
        <Link
          href={Paths.SignIn}
          className={cn(buttonVariants({ variant: "link" }))}
        >
          Sign in
        </Link>
      ) : (
        <Button
          onClick={() => signOut()}
          variant={"outline"}
          className="mx-auto w-max"
        >
          Sign out
        </Button>
      )}
    </div>
  );
};

export default StorefrontHomepage;
