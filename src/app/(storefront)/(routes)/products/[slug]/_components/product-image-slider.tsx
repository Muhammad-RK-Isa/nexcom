"use client"

import React from "react"
import Image from "next/image"
import { EmblaOptionsType } from "embla-carousel"
import useEmblaCarousel from "embla-carousel-react"

import type { CompleteProduct } from "~/types"
import { cn } from "~/lib/utils"

import SliderThumb from "./slider-thumb"

interface ProductImageSliderProps {
  images: CompleteProduct["images"]
}

const ProductImageSlider: React.FC<ProductImageSliderProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = React.useState(images[0])
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({})
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
    <div className="flex w-full max-w-[calc(100vw-2rem)] flex-col gap-2">
      <div className="overflow-hidden rounded-md" ref={emblaMainRef}>
        <div className="flex aspect-square touch-pan-y">
          {images.map((image, idx) => (
            <div
              className="relative min-w-0 shrink-0 grow-0 basis-full overflow-hidden"
              key={idx}
            >
              <Image
                src={image.url}
                alt={image.name}
                fill
                className={cn(
                  "rounded-sm object-cover",
                  image.id === selectedImage?.id && "border-primary/10"
                )}
              />
            </div>
          ))}
        </div>
      </div>
      {images.length > 1 ? (
        <div className="overflow-hidden" ref={emblaThumbsRef}>
          <div className="flex h-24 touch-pan-y gap-2">
            {images.map((image, idx) => (
              <SliderThumb
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

export default ProductImageSlider
