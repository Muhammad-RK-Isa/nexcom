"use client";

import { signOut } from "next-auth/react";
import React from "react";
import { Button } from "~/components/ui/button";

export const SignOut = () => {
  return (
    <Button
      onClick={() => signOut()}
      variant={"outline"}
      className="mx-auto w-max"
    >
      Sign out
    </Button>
  );
};
