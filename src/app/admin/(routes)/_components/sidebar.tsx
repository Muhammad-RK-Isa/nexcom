"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next-nprogress-bar";

import { APP_TITLE, Paths } from "~/lib/constants";
import { cn } from "~/lib/utils";
import { adminNavLinks } from "../_lib/utils";
import { ThemeSelect } from "~/components/theme-select";

export const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="sticky left-0 top-0 hidden h-full max-h-screen flex-col gap-2 border-r bg-muted/40 md:flex">
      <Link
        href={Paths.Storefront}
        className="flex h-14 items-center gap-2 border-b px-4 text-xl font-semibold uppercase lg:h-[60px] lg:px-7"
      >
        <span className="text-clip bg-primary/60 bg-[linear-gradient(90deg,transparent_25%,rgba(255,255,255,.5)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-clip-text bg-no-repeat text-transparent transition-[background-position_0s_ease] hover:animate-shine dark:bg-primary/40">
          {APP_TITLE}
        </span>
      </Link>
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
        <ThemeSelect className="mt-auto p-4" />
      </div>
    </aside>
  );
};
