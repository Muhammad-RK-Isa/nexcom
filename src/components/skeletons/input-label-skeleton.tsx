import React from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

interface InputLableSkeletonProps {
  variant?: "default" | "compact";
}

export const InputLableSkeleton: React.FC<InputLableSkeletonProps> = ({
  variant = "default",
}) => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton
        className={cn(
          "w-full",
          variant === "default" && "h-10",
          variant === "compact" && "h-9",
        )}
      />
    </div>
  );
};
