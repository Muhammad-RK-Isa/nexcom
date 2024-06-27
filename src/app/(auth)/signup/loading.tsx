import React from "react"

import { Card, CardContent, CardHeader } from "~/components/ui/card"
import { Skeleton } from "~/components/ui/skeleton"

import { SignUpFormSkeleton } from "./_components/sign-up-form-skeleton"

const Loading = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-6">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-1/3" />
      </CardHeader>
      <CardContent>
        <SignUpFormSkeleton />
      </CardContent>
    </Card>
  )
}

export default Loading
