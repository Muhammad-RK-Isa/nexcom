"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { cn } from "~/lib/utils";

import { Icons } from "~/components/icons";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "~/components/ui/sheet";
import { APP_TITLE } from "~/lib/constants";

import { Button } from "~/components/ui/button";
import { ThemeSelect } from "~/components/theme-select";

import { adminNavLinks } from "../_lib/utils";
import { useRouter } from "next-nprogress-bar";

export const AdminMobileSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <Icons.panelLeft className="size-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex h-full flex-col justify-between sm:max-w-xs"
      >
        <nav className="grid gap-4">
          <SheetClose asChild>
            <Link href="/">
              <Icons.nextjsfull className="mb-4 h-5 px-2.5 text-primary" />
              <span className="sr-only">{APP_TITLE}</span>
            </Link>
          </SheetClose>
          {adminNavLinks.map(({ title, icon: Icon, path, active }, idx) => (
            <SheetClose key={idx} asChild>
              <button
                onClick={() => router.push(path)}
                disabled={!active}
                className={cn(
                  "flex items-center gap-4 px-2.5 py-1.5 hover:text-foreground disabled:text-muted-foreground/50",
                  path === pathname
                    ? "rounded-lg bg-accent text-foreground"
                    : "text-muted-foreground",
                )}
              >
                <Icon className="size-5" />
                {title}
              </button>
            </SheetClose>
          ))}
          <Link
            href="/admin/settins"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Icons.settings className="size-5" />
            Settings
          </Link>
        </nav>
        <ThemeSelect />
      </SheetContent>
    </Sheet>
  );
};
