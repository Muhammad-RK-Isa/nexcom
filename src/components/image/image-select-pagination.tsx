"use client"

import React from "react"

import type { TableImageParams } from "~/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

import { Icons } from "../icons"
import { Button } from "../ui/button"

interface ImageSelectModalProps {
  selectedImages: number
  totalImages: number
  pageCount: number
  searchParams: TableImageParams
  updateSearchParams: <K extends keyof TableImageParams>(
    key: K,
    value: TableImageParams[K]
  ) => void
}

export const ImageSelectPagination: React.FC<ImageSelectModalProps> = ({
  selectedImages,
  totalImages,
  pageCount,
  searchParams,
  updateSearchParams,
}) => {
  const pageSizeOptions = [10, 20, 30, 40, 50]

  return (
    <div className="flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8">
      <div className="flex-1 whitespace-nowrap text-xs text-muted-foreground lg:text-sm">
        {selectedImages} of {totalImages} image(s) selected.
      </div>
      <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        <div className="flex items-center space-x-2">
          <p className="whitespace-nowrap text-xs font-medium lg:text-sm">
            Rows per page
          </p>
          <Select
            value={`${searchParams.per_page}`}
            onValueChange={(value) => {
              updateSearchParams("per_page", Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[4.5rem]">
              <SelectValue placeholder={searchParams.per_page} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-center text-xs font-medium lg:text-sm">
          Page {searchParams.page} of {pageCount}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            aria-label="Go to first page"
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => updateSearchParams("page", 1)}
            disabled={searchParams.page <= 1}
          >
            <Icons.chevronLeft className="size-4" aria-hidden="true" />
          </Button>
          <Button
            aria-label="Go to previous page"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => updateSearchParams("page", searchParams.page - 1)}
            disabled={searchParams.page <= 1}
          >
            <Icons.chevronLeft className="size-4" aria-hidden="true" />
          </Button>
          <Button
            aria-label="Go to next page"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => updateSearchParams("page", searchParams.page + 1)}
            disabled={searchParams.page >= pageCount}
          >
            <Icons.chevronRight className="size-4" aria-hidden="true" />
          </Button>
          <Button
            aria-label="Go to last page"
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => updateSearchParams("page", pageCount)}
            disabled={searchParams.page >= pageCount}
          >
            <Icons.chevronsRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )
}
