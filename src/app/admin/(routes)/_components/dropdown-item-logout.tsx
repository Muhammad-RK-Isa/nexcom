"use client";

import { signOut } from "next-auth/react";
import React from "react";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";

export const DropdownItemLogout = () => {
  return <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>;
};
