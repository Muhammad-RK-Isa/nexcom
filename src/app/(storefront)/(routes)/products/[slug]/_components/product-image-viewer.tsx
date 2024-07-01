"use client"

import React from "react"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"

import type { CompleteProduct } from "~/types"
import { cn } from "~/lib/utils"
import { Icons } from "~/components/icons"

import Slide from "./slide"
import Thumb from "./thumb"

interface ProductImageViewerProps {
  images: CompleteProduct["images"]
}

const ProductImageViewer: React.FC<ProductImageViewerProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = React.useState(images[0])
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({})
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "trimSnaps",
    dragFree: false,
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
    <div className="flex w-full max-w-[calc(100vw-2rem)] flex-col gap-2">
      {images.length > 1 ? (
        <div className="overflow-hidden rounded-md" ref={emblaMainRef}>
          <div className="flex aspect-square touch-pan-y">
            {images.map((image, idx) => (
              <Slide
                key={idx}
                image={image}
                selected={
                  idx ===
                  images.findIndex((img) => img.id === selectedImage?.id)
                }
              />
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
              className="rounded-sm object-cover"
            />
          ) : (
            <Icons.image className="h-full w-full text-muted-foreground" />
          )}
        </div>
      )}
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
