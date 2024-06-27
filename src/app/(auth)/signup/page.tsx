import React from "react"

import { APP_TITLE } from "~/lib/constants"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"

import { SignUpForm } from "./_components/sign-up-form"
import { SignUpFormSkeleton } from "./_components/sign-up-form-skeleton"

export const metadata = {
  title: `Sign Up - ${APP_TITLE}`,
  description: "Sign Up Page",
}

const SignInPage = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-6">
        <CardTitle className="text-xl">Welcome to {APP_TITLE}</CardTitle>
        <CardDescription>Sign up to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <React.Suspense fallback={<SignUpFormSkeleton />}>
          <SignUpForm />
        </React.Suspense>
      </CardContent>
    </Card>
  )
}

export default SignInPage
