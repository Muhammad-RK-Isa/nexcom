"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import { motion } from "framer-motion";

import { APP_TITLE, Paths } from "~/lib/constants";
import { cn } from "~/lib/utils";
import { adminNavLinks } from "../_lib/utils";
import { ThemeSelect } from "~/components/theme-select";
import { Button } from "~/components/ui/button";
import { Icons } from "~/components/icons";
import { useSidebar } from "~/lib/hooks/use-sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { onClose, isOpen } = useSidebar();

  return (
    <motion.aside
      className="sticky left-0 top-0 hidden h-screen max-h-screen gap-2 overflow-x-hidden border-r bg-background dark:bg-card md:flex md:flex-col"
      animate={{ width: isOpen ? "280px" : "0px" }}
      initial={{ width: isOpen ? "280px" : "0px" }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex h-14 items-center gap-2 border-b px-4 text-xl font-semibold uppercase lg:h-[60px] lg:px-7">
        <Link href={Paths.Storefront}>
          <span className="text-clip bg-primary/60 bg-[linear-gradient(90deg,transparent_25%,rgba(255,255,255,.5)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-clip-text bg-no-repeat text-transparent transition-[background-position_0s_ease] hover:animate-shine dark:bg-primary/40">
            {APP_TITLE}
          </span>
        </Link>
        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          className="group -mr-4 ml-auto"
        >
          <Icons.panelLeftClose className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
          <span className="sr-only">Close side panel</span>
        </Button>
      </div>
      <div className="flex flex-1 flex-col py-3">
        <nav className="grid items-start gap-1 px-2 text-sm font-medium lg:px-4">
          {adminNavLinks.map(({ title, icon: Icon, path, active }, idx) => (
            <button
              key={idx}
              disabled={!active}
              onClick={() => router.push(path)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all",
                path === pathname && "bg-muted text-primary",
                active ? "hover:bg-muted hover:text-primary" : "opacity-50",
              )}
            >
              <Icon className="size-4" />
              {title}{" "}
            </button>
          ))}
        </nav>
        <div className="mt-auto flex items-center justify-between p-4">
          <ThemeSelect />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"ghost"}
                size={"icon"}
                className={cn(
                  "size-max cursor-pointer rounded-full p-2 text-muted-foreground transition-colors hover:text-primary",
                )}
                onClick={() => router.push("/admin/settings")}
              >
                <Icons.settings className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="capitalize">
              Go to settings
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </motion.aside>
  );
};
