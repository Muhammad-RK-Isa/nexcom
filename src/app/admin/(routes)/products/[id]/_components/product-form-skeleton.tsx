import React from "react";
import { InputLableSkeleton } from "~/components/skeletons/input-label-skeleton";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export const ProductFormSkeleton = () => {
  return (
    <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-7 w-full md:h-8 md:w-1/4" />
        <Skeleton className="ml-auto h-7 w-full md:h-8 md:w-1/4" />
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-4 w-1/3" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <InputLableSkeleton />
                <InputLableSkeleton />
                <InputLableSkeleton variant={"textarea"} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-4 w-1/3" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                <InputLableSkeleton />
                <InputLableSkeleton />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-4 w-1/3" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <Skeleton className="h-[46px] w-full" />
                <Skeleton className="h-[46px] w-full" />
                <InputLableSkeleton className="w-1/2" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-4 w-1/3" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <InputLableSkeleton />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <InputLableSkeleton />
                <InputLableSkeleton />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
