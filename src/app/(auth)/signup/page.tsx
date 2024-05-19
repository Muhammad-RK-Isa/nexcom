import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { APP_TITLE } from "~/lib/constants";
import { SignUpForm } from "./_components/sign-up-form";
import { SignUpFormSkeleton } from "./_components/sign-up-form-skeleton";

export const metadata = {
  title: "Sign Up for Next Commerce",
  description: "Sign Up Page",
};

const SignInPage = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-6">
        <CardTitle>Welcome to {APP_TITLE}</CardTitle>
        <CardDescription>Sign up to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <React.Suspense fallback={<SignUpFormSkeleton />}>
          <SignUpForm />
        </React.Suspense>
      </CardContent>
    </Card>
  );
};

export default SignInPage;
