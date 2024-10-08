import React from "react"
import Image from "next/image"

import type { PublicProduct } from "~/types"
import { cn } from "~/lib/utils"

interface ThumbProps {
  image: PublicProduct["images"][number]
  selected: boolean
  onClick: () => void
}

const Thumb: React.FC<ThumbProps> = ({ image, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="relative aspect-square h-20 bg-card md:h-24"
    >
      <div
        className={cn(
          "absolute inset-0 z-10 rounded-md bg-black/50 transition-opacity",
          selected ? "opacity-0" : "opacity-100"
        )}
      />
      <Image
        src={image.url}
        alt={image.name}
        fill
        className="rounded-md border border-border/80 object-contain"
      />
    </button>
  )
}

export default Thumb
