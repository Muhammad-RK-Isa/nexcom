import { cn } from "~/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-shine overflow-hidden rounded-md bg-foreground/5 bg-[linear-gradient(90deg,transparent_25%,rgba(255,255,255,.5)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-no-repeat transition-[background-position_0s_ease] dark:bg-[linear-gradient(90deg,transparent_20%,rgba(255,255,255,.1)_40%,transparent_65%,transparent_80%)]",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
