import React from "react"
import NextImage from "next/image"
import { ImageSelectPagination } from "~/features/images/components/image-select-pagination"
import { ImageUploader } from "~/features/images/components/image-uploader"
import type { Image, TableImageParams } from "~/features/images/types"
import { toast } from "sonner"

import { useUploadFile } from "~/lib/hooks/use-upload-files"
import { cn } from "~/lib/utils"
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
} from "~/components/ui/alert-dialog"
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
import { Input } from "~/components/ui/input"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Skeleton } from "~/components/ui/skeleton"
import { EmptyCard } from "~/components/empty-card"
import { Icons } from "~/components/icons"
import { api } from "~/trpc/react"

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
    per_page: 10,
    sort: "",
    name: "",
    from: "",
    to: "",
    operator: "and",
  })

  const updateSearchParams = async <K extends keyof TableImageParams>(
    key: K,
    value: TableImageParams[K]
  ) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      [key]: value,
    }))
    await refetch()
  }

  const { data, refetch, isLoading } =
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

  const {
    uploadFiles,
    progresses,
    uploadedFiles,
    isUploading,
    setUploadedFiles,
  } = useUploadFile("authorizedRoute")

  React.useEffect(() => {
    setUploadedFiles(
      data?.data.map((image) => ({
        id: image.id,
        name: image.name,
        url: image.url,
      })) ?? []
    )
  }, [setUploadedFiles, data?.data, data])

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
        <div className="-mt-8 flex h-full flex-1 flex-col">
          <div className="flex flex-col space-y-4 p-4 lg:p-6">
            <ImageUploader
              maxFiles={32}
              maxSize={8 * 1024 * 1024}
              progresses={progresses}
              disabled={isUploading}
              onUpload={uploadFiles}
              isUploading={isUploading}
              className="h-40 text-sm"
            />
            <Images
              files={uploadedFiles}
              selectedImages={selectedImages}
              setSelectedImages={setSelectedImages}
              multiple={multiple}
              isLoading={isLoading}
              updateSearchParams={updateSearchParams}
              searchParams={searchParams}
            />
          </div>
          <div className="flex w-full flex-col space-y-2 rounded-b-lg border-t bg-card p-4 lg:space-y-4 lg:p-6">
            {/* <ImageSelectPagination
              selectedImages={selectedImages.length}
              totalImages={Number(data?.pageCount ?? 0) * searchParams.per_page}
              pageCount={data?.pageCount ?? 0}
              searchParams={searchParams}
              updateSearchParams={updateSearchParams}
            /> */}
            <div className="flex w-full flex-row justify-between gap-2">
              {selectedImages.length ? (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setSelectedImages([])}
                    variant="outline"
                    size="sm"
                    className="w-full"
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
                        {/* <span className="hidden sm:block">Delete selected</span> */}
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
                    disabled={!uploadedFiles.length || isDeleting}
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
  isLoading: boolean
  updateSearchParams: <K extends keyof TableImageParams>(
    key: K,
    value: TableImageParams[K]
  ) => void
  searchParams: TableImageParams
}

function Images({
  files,
  selectedImages,
  setSelectedImages,
  multiple,
  isLoading,
  updateSearchParams,
  searchParams,
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
      <CardHeader className="md:flex-row md:justify-between">
        <CardTitle className="flex items-center justify-between space-x-2">
          Uploaded images
        </CardTitle>
        <div>
          <Input
            value={searchParams.name}
            onChange={(e) => updateSearchParams("name", e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 py-3 md:py-4">
        {isLoading ? (
          <ScrollArea className="h-fit">
            <div className="grid h-[40vh] grid-cols-2 gap-4 p-px sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {Array.from({ length: 12 }, (_, i) => (
                <Skeleton
                  key={i}
                  className="h-[11.625rem] w-full rounded-md border"
                ></Skeleton>
              ))}
            </div>
          </ScrollArea>
        ) : files.length ? (
          <ScrollArea className="h-fit">
            <div className="grid h-[40vh] grid-cols-2 gap-4 p-px sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {files.map((file) => (
                <button
                  key={file.id}
                  className="group flex h-[11.625rem] flex-col items-center space-y-2 rounded-md border bg-secondary p-4 transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:bg-secondary/40"
                  onClick={() => handleSelect(file)}
                >
                  <div className="relative size-28 rounded-md shadow-sm drop-shadow-sm">
                    <NextImage
                      src={file.url}
                      alt={file.name}
                      fill
                      sizes="(min-width: 640px) 640px, 100vw"
                      className="rounded-md object-cover"
                    />
                    <Checkbox
                      checked={!!selectedImages.find((f) => f.id === file.id)}
                      onChange={() => handleSelect(file)}
                      className={cn(
                        "absolute left-2 top-2 z-20 dark:border-background data-[state=checked]:dark:bg-background data-[state=checked]:dark:text-foreground",
                        selectedImages.find((f) => f.id === file.id)
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100 group-focus:opacity-100"
                      )}
                    />
                    <div className="absolute inset-y-0 z-10 size-full rounded-md bg-[#09090b] bg-opacity-0 transition-all duration-75 group-hover:dark:bg-opacity-30 group-hover:md:bg-opacity-10" />
                  </div>
                  <div className="line-clamp-2 cursor-default break-all text-center text-xs">
                    {file.name}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <EmptyCard
            title="No files uploaded"
            description="Upload some files to choose from"
            className="w-full border-none shadow-none"
          />
        )}
      </CardContent>
    </Card>
  )
}
