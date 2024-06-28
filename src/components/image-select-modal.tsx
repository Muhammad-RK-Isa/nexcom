"use client"

import React from "react"
import NextImage from "next/image"
import { api } from "~/trpc/react"
import { toast } from "sonner"

import { useUploadFile } from "~/lib/hooks/use-upload-files"
import { cn } from "~/lib/utils"
import { Button, buttonVariants } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Checkbox } from "~/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { ScrollArea } from "~/components/ui/scroll-area"
import { EmptyCard } from "~/components/empty-card"
import { Icons } from "~/components/icons"
import type { Image, TableImageParams } from "~/types"

import { ImageUploader } from "./image-uploader"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"

interface ImageSelectModalProps {
  open?: boolean
  value: Image[]
  onOpenChange?: (value: boolean) => void
  onValueChange: (value: Image[]) => void
  trigger?: React.ReactNode | null
  multiple?: boolean
}

export const ImageSelectModal: React.FC<ImageSelectModalProps> = ({
  open,
  value = [],
  onOpenChange,
  onValueChange,
  trigger,
  multiple = true,
}) => {
  const [selectedImages, setSelectedImages] = React.useState<Image[]>(value)
  const [searchParams, setSearchParams] = React.useState<TableImageParams>({
    page: 1,
    per_page: 50,
    sort: "",
    name: "",
    from: "",
    to: "",
    operator: "and",
  })

  const updateSearchParams = <K extends keyof TableImageParams>(
    key: K,
    value: TableImageParams[K]
  ) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      [key]: value,
    }))
  }

  const { data: images, refetch } =
    api.images.getTableImages.useQuery(searchParams)
  const { mutate: deleteImages, isPending: isDeleting } =
    api.images.deleteImages.useMutation({
      onSuccess: () => {
        refetch()
        toast.success("Images deleted")
        setSelectedImages([])
        onValueChange([])
      },
      onError: (err) => {
        toast.error(err.message)
      },
    })

  const reshapedImages = React.useMemo(() => {
    return (
      images?.data.map((image) => ({
        id: image.id,
        name: image.name,
        url: image.url,
      })) ?? []
    )
  }, [images])

  const {
    uploadFiles,
    progresses,
    uploadedFiles,
    isUploading,
    setUploadedFiles,
  } = useUploadFile("authorizedRoute", {
    defaultUploadedFiles: reshapedImages ?? [],
  })

  React.useEffect(() => {
    setUploadedFiles(reshapedImages ?? [])
  }, [setUploadedFiles, reshapedImages])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!onOpenChange ? (
        <DialogTrigger
          className={cn(!trigger && buttonVariants({ variant: "outline" }))}
          asChild={!!trigger}
        >
          {trigger ?? "Select Images"}
        </DialogTrigger>
      ) : null}
      <DialogContent className="flex flex-col gap-4 p-0 sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg">
        <DialogHeader className="p-4 lg:p-6">
          <DialogTitle>Select Images</DialogTitle>
          <DialogDescription>
            Select from the list of images or upload new ones
          </DialogDescription>
        </DialogHeader>
        <div className="-mt-8 flex h-full flex-1 flex-col gap-4">
          <div className="flex flex-col space-y-4 p-4 lg:p-6">
            <ImageUploader
              maxFiles={32}
              maxSize={8 * 1024 * 1024}
              progresses={progresses}
              disabled={isUploading}
              onUpload={uploadFiles}
              className="h-40 text-sm"
            />
            <Images
              files={uploadedFiles}
              selectedImages={selectedImages}
              setSelectedImages={setSelectedImages}
              multiple={multiple}
            />
          </div>
          <div className="mt-auto flex w-full items-center gap-4 rounded-b-lg border-t bg-card p-4 lg:p-6">
            {selectedImages.length ? (
              <div className="mr-auto flex items-center space-x-2">
                <Button
                  onClick={() => setSelectedImages([])}
                  variant="ghost"
                  size="sm"
                >
                  Unselect all
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={isDeleting}
                      loading={isDeleting}
                      icon={Icons.trash}
                    >
                      Delete&nbsp;
                      <span className="hidden sm:block">selected</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete images</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete{" "}
                        {selectedImages.length > 1
                          ? "these images"
                          : "this image"}
                        ?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className={cn(
                          buttonVariants({ variant: "destructive" })
                        )}
                        onClick={() => deleteImages(selectedImages)}
                      >
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ) : null}
            <div className="ml-auto flex items-center space-x-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  size={"sm"}
                  onClick={() => {
                    setSelectedImages(value)
                    onOpenChange?.(false)
                  }}
                >
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  type="button"
                  size={"sm"}
                  disabled={reshapedImages.length === 0 || isDeleting}
                  onClick={() => {
                    onValueChange(selectedImages)
                    onOpenChange?.(false)
                  }}
                >
                  Done
                </Button>
              </DialogClose>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface ImagesProps {
  files: Image[]
  selectedImages: Image[]
  setSelectedImages: (files: Image[]) => void
  multiple: boolean
}

export function Images({
  files,
  selectedImages,
  setSelectedImages,
  multiple,
}: ImagesProps) {
  const handleSelect = (file: Image) => {
    if (multiple) {
      if (!!selectedImages.find((f) => f.id === file.id)) {
        setSelectedImages(selectedImages.filter((f) => f.id !== file.id))
      } else {
        setSelectedImages([...selectedImages, file])
      }
    } else {
      if (!!selectedImages.find((f) => f.id === file.id)) {
        setSelectedImages([])
      } else {
        setSelectedImages([file])
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between space-x-2">
          Uploaded images
          {selectedImages.length ? (
            <span className="text-xs font-normal">
              {selectedImages.length} selected
            </span>
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {files.length ? (
          <ScrollArea className="h-fit">
            <div className="grid h-full max-h-[40vh] grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="group flex flex-col items-center space-y-2 rounded-md border bg-secondary p-4 transition-colors hover:bg-secondary/80 dark:bg-secondary/40"
                  onClick={() => handleSelect(file)}
                >
                  <div className="relative size-28 rounded-md shadow-sm drop-shadow-sm">
                    <NextImage
                      src={file.url}
                      alt={file.name}
                      fill
                      sizes="(min-width: 640px) 640px, 100vw"
                      loading="lazy"
                      className="rounded-md object-cover"
                    />
                    <Checkbox
                      checked={!!selectedImages.find((f) => f.id === file.id)}
                      onChange={() => handleSelect(file)}
                      className={cn(
                        "absolute left-2 top-2 z-20 dark:border-background data-[state=checked]:dark:bg-background data-[state=checked]:dark:text-foreground",
                        selectedImages.find((f) => f.id === file.id)
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      )}
                    />
                    <div className="absolute inset-y-0 z-10 size-full rounded-md bg-[#09090b] bg-opacity-0 transition-all duration-150 group-hover:md:bg-opacity-40" />
                  </div>
                  <div className="line-clamp-2 cursor-default break-all text-center text-xs">
                    {file.name}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <EmptyCard
            title="No files uploaded"
            description="Upload some files to see them here"
            className="w-full"
          />
        )}
      </CardContent>
    </Card>
  )
}
