"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Image from "next/image";

import { useRouter } from "next-nprogress-bar";
import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { APP_TITLE } from "~/lib/constants";
import { cn } from "~/lib/utils";
import { adminNavLinks } from "../_lib/utils";
import { ThemeSelect } from "~/components/theme-select";

import NextLight from "~/../public/nextjs-icon-light-background.svg";
import NextDark from "~/../public/nextjs-icon-dark-background.svg";

export const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex h-full flex-col items-center gap-2 px-2 sm:py-4">
        <Link
          href="#"
          className="group relative mb-1 flex size-6 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
        >
          <Image
            src={NextLight}
            fill
            alt="Next.js logo light"
            className="dark:hidden"
          />
          <Image
            src={NextDark}
            fill
            alt="Next.js logo dark"
            className="hidden dark:block"
          />
          <span className="sr-only">{APP_TITLE}</span>
        </Link>
        {adminNavLinks.map(({ title, icon: Icon, path, active }, idx) => (
          <Tooltip key={idx}>
            <TooltipTrigger asChild>
              <Button
                size={"icon"}
                variant={"link"}
                disabled={!active}
                onClick={() => router.push(path)}
                className={cn(
                  "rounded-full text-muted-foreground transition-colors hover:text-primary",
                  path === pathname && "bg-accent text-primary",
                )}
              >
                <Icon className="size-5" />
                <span className="sr-only">{title}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{title}</TooltipContent>
          </Tooltip>
        ))}
        <div className="mt-auto flex flex-col items-center gap-4">
          <ThemeSelect
            className="flex-col space-x-0 space-y-1"
            tooltipSide="right"
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Icons.settings className="size-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </div>
      </nav>
    </aside>
  );
};
