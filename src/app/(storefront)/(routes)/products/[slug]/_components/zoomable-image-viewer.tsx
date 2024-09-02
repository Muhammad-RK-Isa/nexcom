"use client"

import React from "react"
import Image from "next/image"
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch"

import type { PublicProduct } from "~/types"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Icons } from "~/components/icons"

type ProductImage = PublicProduct["images"][number]

interface ZoomableImageViewerProps {
  selectedImage: ProductImage
  setSelectedImage: (image: ProductImage | undefined) => void
  images: PublicProduct["images"]
}

const ZoomableImageViewer: React.FC<ZoomableImageViewerProps> = ({
  images,
  selectedImage,
  setSelectedImage,
}) => {
  const prev = () =>
    setSelectedImage(
      images[images.findIndex((image) => image.id === selectedImage?.id) - 1]
    )
  const next = () =>
    setSelectedImage(
      images[images.findIndex((image) => image.id === selectedImage?.id) + 1]
    )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"secondary"}
          size={"icon"}
          className="absolute right-2 top-2 size-8 rounded-full"
        >
          <Icons.maximize className="size-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="h-screen w-screen max-w-none bg-background/80 p-0 md:max-w-none lg:max-w-none"
        showCloseIcon={false}
      >
        <DialogClose className="absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <Icons.minimize className="size-6" />
        </DialogClose>
        <div className="mx-auto my-auto aspect-square w-full max-w-4xl">
          {images.length > 0 ? (
            <div className="relative overflow-hidden rounded-md">
              <TransformWrapper>
                {({ zoomIn, zoomOut, resetTransform }) => (
                  <>
                    <div className="absolute bottom-6 right-1/2 z-10 flex translate-x-1/2 items-center space-x-2.5">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => zoomOut()}
                        className="rounded-full"
                      >
                        <Icons.zoomOut className="size-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => resetTransform()}
                        className="rounded-full"
                      >
                        Reset
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => zoomIn()}
                        className="rounded-full"
                      >
                        <Icons.zoomIn className="size-4" />
                      </Button>
                    </div>
                    <TransformComponent
                      wrapperStyle={{ height: "100%", width: "100%" }}
                      contentStyle={{ height: "100%", width: "100%" }}
                    >
                      <div className="relative aspect-square w-full cursor-all-scroll">
                        <Image
                          src={selectedImage.url}
                          alt={selectedImage.name}
                          fill
                          className="size-full rounded-sm object-contain"
                        />
                      </div>
                    </TransformComponent>
                  </>
                )}
              </TransformWrapper>
              {images.length > 1 ? (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full"
                    onClick={prev}
                    disabled={
                      images.findIndex(
                        (image) => image.id === selectedImage?.id
                      ) === 0
                    }
                  >
                    <Icons.chevronLeft className="size-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full"
                    onClick={next}
                    disabled={
                      images.findIndex(
                        (image) => image.id === selectedImage?.id
                      ) ===
                      images.length - 1
                    }
                  >
                    <Icons.chevronRight className="size-4" />
                  </Button>
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ZoomableImageViewer
