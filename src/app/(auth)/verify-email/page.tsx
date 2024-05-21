import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { redirect } from "next/navigation";
// import { VerifyCode } from "./verify-code";
import { type SearchParams } from "~/types";
import { Paths } from "~/lib/constants";
import React from "react";

export const metadata = {
  title: "Verify Email",
  description: "Verify Email Page",
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  //TODO: Check if the used has already been verified or not in the middleware or here
  const email = searchParams.email;

  if (!email || typeof email !== "string") return redirect(Paths.SignIn);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="mb-4">Verify Email</CardTitle>
        <CardDescription className="mx-auto max-w-sm">
          A verification code was sent to your email. Please check your spam
          folder if you can&apos;t find the email.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex w-full items-center justify-center">
        <React.Suspense>{/* <VerifyCode email={email} /> */}</React.Suspense>
      </CardContent>
    </Card>
  );
}
