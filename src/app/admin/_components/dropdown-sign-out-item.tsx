"use client"

import { signOut } from "next-auth/react"

import { DropdownMenuItem } from "~/components/ui/dropdown-menu"

const DropddownSignOutItem = () => {
  return <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
}

export default DropddownSignOutItem
