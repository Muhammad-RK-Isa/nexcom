"use client";

import React from "react";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useUploadFile } from "~/lib/hooks/use-upload-files";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import type { StoredFile, TableImageParams } from "~/types";
import { EmptyCard } from "~/components/empty-card";
import { ImageUploader } from "./image-uploader";
import { Button, buttonVariants } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { ScrollArea } from "~/components/ui/scroll-area";

interface ImageSelectModalProps {
  open?: boolean;
  value: StoredFile[];
  onOpenChange: (value: boolean) => void;
  onValueChange: (value: StoredFile[]) => void;
}

export const ImageSelectModal: React.FC<ImageSelectModalProps> = ({
  open,
  value = [],
  onOpenChange,
  onValueChange,
}) => {
  const [selectedImages, setSelectedImages] =
    React.useState<StoredFile[]>(value);
  const [searchParams, setSearchParams] = React.useState<TableImageParams>({
    page: 1,
    per_page: 50,
    sort: "",
    name: "",
    from: "",
    to: "",
    operator: "and",
  });

  // Function to update search parameters
  //? INFO: will be using this function to filter images
  const updateSearchParams = <K extends keyof TableImageParams>(
    key: K,
    value: TableImageParams[K],
  ) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      [key]: value,
    }));
  };

  const { data: images } = api.images.getTableImages.useQuery(searchParams);

  const reshapedImages = React.useMemo(() => {
    return (
      images?.data.map((image) => ({
        id: image.id,
        name: image.name,
        url: image.url,
      })) ?? []
    );
  }, [images]);

  const {
    uploadFiles,
    progresses,
    uploadedFiles,
    isUploading,
    setUploadedFiles,
  } = useUploadFile("authorizedRoute", {
    defaultUploadedFiles: reshapedImages ?? [],
  });

  React.useEffect(() => {
    setUploadedFiles(reshapedImages ?? []);
  }, [setUploadedFiles, reshapedImages]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!onOpenChange ? (
        <DialogTrigger className={cn(buttonVariants({ variant: "outline" }))}>
          Select Images
        </DialogTrigger>
      ) : null}
      <DialogContent className="flex min-h-[80vh] max-w-screen-lg flex-col space-y-4 md:max-w-screen-lg lg:max-w-screen-lg">
        <DialogHeader>
          <DialogTitle>Select Images</DialogTitle>
        </DialogHeader>
        <div className="relative flex h-full flex-1 flex-col gap-4">
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
          />
          <div className="-mx-6 mt-auto flex items-center justify-center space-x-2 border-t px-6 pt-4">
            <Button
              type="button"
              variant="outline"
              size={"sm"}
              className="ml-auto"
              onClick={() => {
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size={"sm"}
              onClick={() => {
                onValueChange(selectedImages);
                onOpenChange(false);
              }}
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface ImagesProps {
  files: StoredFile[];
  selectedImages: StoredFile[];
  setSelectedImages: (files: StoredFile[]) => void;
}

export function Images({
  files,
  selectedImages,
  setSelectedImages,
}: ImagesProps) {
  const handleSelect = (file: StoredFile) => {
    if (!!selectedImages.find((f) => f.id === file.id)) {
      setSelectedImages(selectedImages.filter((f) => f.id !== file.id));
    } else {
      setSelectedImages([...selectedImages, file]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uploaded files</CardTitle>
      </CardHeader>
      <CardContent>
        {files.length > 0 ? (
          <ScrollArea className="h-fit">
            <div className="grid h-full max-h-[40vh] grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="group flex flex-col space-y-2 rounded-md border bg-secondary p-4 transition-colors hover:bg-secondary/80 dark:bg-secondary/40"
                  onClick={() => handleSelect(file)}
                >
                  <div className="relative size-28 rounded-md shadow-sm drop-shadow-sm">
                    <Image
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
                        "absolute left-2 top-2 z-20 data-[state=checked]:bg-background data-[state=checked]:text-foreground dark:border-background",
                        selectedImages.find((f) => f.id === file.id)
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100",
                      )}
                    />
                    <div className="absolute inset-y-0 z-10 size-full rounded-md bg-[#09090b] bg-opacity-0 transition-all duration-150 group-hover:bg-opacity-40" />
                  </div>
                  <div className="line-clamp-2 break-all text-center text-xs">
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
  );
}
