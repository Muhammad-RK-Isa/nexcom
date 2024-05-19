import React from "react";
import { Icons } from "./icons";
import { cn } from "~/lib/utils";
import Link from "next/link";
import { ThemeSelect } from "./theme-select";
import { Skeleton } from "./ui/skeleton";

const SocialLink = ({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) => {
  return (
    <Link href={href} target="_blank" rel="noreferrer" className="group">
      <span className="sr-only">{children}</span>
      <Icon className="size-4 fill-primary/60 transition-all group-hover:fill-primary" />
    </Link>
  );
};

interface FooterProps {
  className?: string;
  props?: React.HTMLProps<HTMLDivElement>;
}

const Footer: React.FC<FooterProps> = ({ className, props }) => {
  return (
    <div
      {...props}
      className={cn(
        "flex w-full flex-col items-center justify-between gap-8 border-t p-8 pt-8 sm:flex-row",
        className,
      )}
    >
      <p className="text-xs">
        Developed by{" "}
        <Link href="https://twitter.com/muhammad_rk_isa" className="underline">
          Muhammad Isa
        </Link>
      </p>
      <div className="flex min-h-8 flex-row gap-8">
        <React.Suspense fallback={<Skeleton className="h-8 w-[104px]" />}>
          <ThemeSelect />
        </React.Suspense>
        <div className="flex items-center gap-4">
          <SocialLink href="https://twitter.com/muhammad_rk_isa" icon={Icons.x}>
            Follow me on X
          </SocialLink>
          <SocialLink
            href="https://github.com/Muhammad-RK-Isa"
            icon={Icons.gitHub}
          >
            Follow me on GitHub
          </SocialLink>
          <SocialLink
            href="https://discord.gg/P8GXYyH3ZU"
            icon={Icons.linkedIn}
          >
            Connect on LinkedIn
          </SocialLink>
        </div>
      </div>
    </div>
  );
};

export default Footer;
