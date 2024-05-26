import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { APP_TITLE } from "~/lib/constants";
import { SignInForm } from "./_components/sign-in-form";
import { SignInFormSkeleton } from "./_components/sign-in-form-skeleton";

export const metadata = {
  title: "Sign In to Next Commerce",
  description: "Sign In Page",
};

const SignInPage = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-6">
        <CardTitle className="text-xl">Welcome to {APP_TITLE}</CardTitle>
        <CardDescription>Sign in to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <React.Suspense fallback={<SignInFormSkeleton />}>
          <SignInForm />
        </React.Suspense>
      </CardContent>
    </Card>
  );
};

export default SignInPage;
