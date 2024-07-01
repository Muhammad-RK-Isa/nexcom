"use client"

import React from "react"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch"

import type { CompleteProduct } from "~/types"
import { Button } from "~/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog"
import { Icons } from "~/components/icons"

type ProductImage = CompleteProduct["images"][number]

interface ZoomableImageViewerProps {
  selectedImage: ProductImage | undefined
  setSelectedImage: (image: ProductImage | undefined) => void
  images: CompleteProduct["images"]
}

const ZoomableImageViewer: React.FC<ZoomableImageViewerProps> = ({
  images,
  selectedImage,
  setSelectedImage,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    startIndex: images.findIndex((image) => image.id === selectedImage?.id),
  })

  const prev = () => emblaApi?.scrollPrev()
  const next = () => emblaApi?.scrollNext()

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return
    setSelectedImage(images[emblaApi.selectedScrollSnap()])
  }, [setSelectedImage, images, emblaApi])

  React.useEffect(() => {
    if (!emblaApi) return
    onSelect()

    emblaApi.on("select", onSelect).on("reInit", onSelect)
  }, [onSelect, emblaApi])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"secondary"}
          size={"icon"}
          className="absolute right-2 top-2 rounded-full"
        >
          <Icons.search className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="h-screen w-screen max-w-none bg-background/80 p-0 md:max-w-none lg:max-w-none">
        <div className="mx-auto my-auto aspect-square w-full max-w-4xl">
          {images.length > 0 ? (
            <div className="relative overflow-hidden rounded-md" ref={emblaRef}>
              <div className="flex aspect-square touch-pan-y">
                {images.map((image, idx) => (
                  <div
                    key={idx}
                    className="relative min-w-0 shrink-0 grow-0 basis-full overflow-hidden"
                  >
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
                            <div className="relative aspect-square w-full">
                              <Image
                                src={image.url}
                                alt={image.name}
                                fill
                                className="size-full rounded-sm object-cover"
                              />
                            </div>
                          </TransformComponent>
                        </>
                      )}
                    </TransformWrapper>
                  </div>
                ))}
              </div>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full"
                onClick={prev}
              >
                <Icons.chevronLeft className="size-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full"
                onClick={next}
              >
                <Icons.chevronRight className="size-4" />
              </Button>
            </div>
          ) : (
            <div className="relative aspect-square">
              {images[0]?.url ? (
                <Image
                  src={images[0]?.url}
                  alt={images[0]?.name}
                  fill
                  className="rounded-sm object-cover"
                />
              ) : (
                <Icons.image className="h-full w-full text-muted-foreground" />
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ZoomableImageViewer
