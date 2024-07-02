"use client"

import React from "react"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"

import type { CompleteProduct } from "~/types"
import { Icons } from "~/components/icons"

import Thumb from "./thumb"
import ZoomableImageViewer from "./zoomable-image-viewer"

interface ProductImageViewerProps {
  images: CompleteProduct["images"]
  selectedImage?: CompleteProduct["images"][number]
  setSelectedImage: (image?: CompleteProduct["images"][number]) => void
}

const ProductImageViewer: React.FC<ProductImageViewerProps> = ({
  images,
  selectedImage,
  setSelectedImage,
}) => {
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({
    startIndex: images.findIndex((img) => img.id === selectedImage?.id),
  })
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  })

  const onThumbClick = React.useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return
      emblaMainApi.scrollTo(index)
    },
    [emblaMainApi, emblaThumbsApi]
  )

  const onSelect = React.useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return
    setSelectedImage(images[emblaMainApi.selectedScrollSnap()])
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap())
  }, [emblaMainApi, emblaThumbsApi, setSelectedImage, images])

  React.useEffect(() => {
    if (!emblaMainApi) return
    onSelect()

    emblaMainApi.on("select", onSelect).on("reInit", onSelect)
  }, [emblaMainApi, onSelect])

  return (
    <div className="relative flex w-full flex-col gap-2">
      {images.length > 1 ? (
        <div className="overflow-hidden rounded-md bg-card" ref={emblaMainRef}>
          <div className="flex aspect-square touch-pan-y">
            {images.map((image, idx) => (
              <div
                key={idx}
                className="relative min-w-0 shrink-0 grow-0 basis-full overflow-hidden"
              >
                <Image
                  src={image.url}
                  alt={image.name}
                  fill
                  className="rounded-sm object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative aspect-square">
          {images[0]?.url ? (
            <Image
              src={images[0]?.url}
              alt={images[0]?.name}
              fill
              className="rounded-sm object-contain"
            />
          ) : (
            <Icons.image className="h-full w-full text-muted-foreground" />
          )}
        </div>
      )}
      {selectedImage ? (
        <ZoomableImageViewer
          selectedImage={selectedImage}
          setSelectedImage={(image) => {
            if (!image) return
            emblaMainApi?.scrollTo(images.indexOf(image))
          }}
          images={images}
        />
      ) : null}
      {images.length > 1 ? (
        <div className="overflow-hidden rounded-sm" ref={emblaThumbsRef}>
          <div className="flex h-24 touch-pan-y gap-2">
            {images.map((image, idx) => (
              <Thumb
                key={idx}
                image={image}
                onClick={() => onThumbClick(idx)}
                selected={
                  idx ===
                  images.findIndex((img) => img.id === selectedImage?.id)
                }
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default ProductImageViewer
