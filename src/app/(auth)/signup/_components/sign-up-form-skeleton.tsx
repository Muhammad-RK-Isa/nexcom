import React from "react";
import { InputLableSkeleton } from "~/components/skeletons/input-label-skeleton";
import { Skeleton } from "~/components/ui/skeleton";

export const SignUpFormSkeleton = () => {
  return (
    <div className="w-full space-y-4">
      <InputLableSkeleton variant={"extended"} />
      <InputLableSkeleton variant={"extended"} />
      <InputLableSkeleton variant={"extended"} />
      <InputLableSkeleton variant={"extended"} />
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-10" />
      <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
      <Skeleton className="h-10 w-full flex-auto" />
    </div>
  );
};
