import React from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

interface InputLableSkeletonProps {
  variant?: "default" | "extended" | "textarea";
  className?: string;
}

export const InputLableSkeleton: React.FC<InputLableSkeletonProps> = ({
  variant = "default",
  className,
}) => {
  return (
    <div
      className={cn(
        variant === "extended" ? "space-y-4" : "space-y-2",
        className,
      )}
    >
      <Skeleton className="h-5 w-1/3" />
      <Skeleton
        className={cn(
          "w-full",
          variant === "default" && "h-9",
          variant === "extended" && "h-10",
          variant === "textarea" && "h-36",
        )}
      />
    </div>
  );
};
