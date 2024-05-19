import React from "react";

import { Skeleton } from "~/components/ui/skeleton";

import { SignInFormSkeleton } from "./_components/sign-in-form-skeleton";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

const Loading = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-6">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-1/3" />
      </CardHeader>
      <CardContent>
        <SignInFormSkeleton />
      </CardContent>
    </Card>
  );
};

export default Loading;
