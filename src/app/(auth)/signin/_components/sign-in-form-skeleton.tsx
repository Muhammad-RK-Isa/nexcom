import React from "react";
import { InputLableSkeleton } from "~/components/skeletons/input-label-skeleton";
import { Skeleton } from "~/components/ui/skeleton";

export const SignInFormSkeleton = () => {
  return (
    <div className="w-full space-y-4">
      <InputLableSkeleton />
      <InputLableSkeleton />
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-5 w-1/3" />
      </div>
      <Skeleton className="h-10" />
      <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
      <Skeleton className="h-10 w-full flex-auto" />
    </div>
  );
};
