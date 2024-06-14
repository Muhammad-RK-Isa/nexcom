import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

export const Breadcrumbs = () => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter((item) => item !== "");

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, idx) => {
          const newSegment = segment.startsWith("product_")
            ? "Edit product"
            : segment.startsWith("admin")
              ? null
              : segment;
          if (!newSegment) return null;
          return (
            <React.Fragment key={idx}>
              <BreadcrumbItem>
                {segment === segments.at(-1) ? (
                  <BreadcrumbPage className="capitalize">
                    {newSegment}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      className="capitalize"
                      href={`/${segments.slice(0, idx + 1).join("/")}`}
                      aria-label={`Go to ${newSegment}`}
                    >
                      {newSegment}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {segment !== segments.at(-1) ? (
                <BreadcrumbSeparator key={idx} />
              ) : null}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
