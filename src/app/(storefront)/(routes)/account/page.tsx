"use client"

import * as React from "react"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"

import { Paths } from "~/lib/constants"
import { cn } from "~/lib/utils"
import { Button, buttonVariants } from "~/components/ui/button"

const AccountPage = () => {
  const { data } = useSession()

  return (
    <div className="mx-auto mt-[30vh] flex flex-col items-center space-y-6">
      {data?.user ? (
        <div>
          <Button variant="destructive" onClick={() => signOut()}>
            Log out
          </Button>
        </div>
      ) : (
        <Link
          href={Paths.SignIn}
          className={cn(buttonVariants({ variant: "link" }))}
        >
          Sign in
        </Link>
      )}
      {data?.user.role === "admin" ? (
        <Link
          href={Paths.Admin.Dashboard}
          className={cn(buttonVariants({ variant: "link" }))}
        >
          Go to admin dashboard
        </Link>
      ) : null}
    </div>
  )
}

export default AccountPage
