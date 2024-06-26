import React from "react"
import Image from "next/image"

import type { CompleteProduct } from "~/types"
import { cn } from "~/lib/utils"

interface ThumbProps {
  image: CompleteProduct["images"][number]
  selected: boolean
  onClick: () => void
}

const Thumb: React.FC<ThumbProps> = ({ image, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="relative aspect-square min-w-24"
    >
      <Image
        src={image.url}
        alt={image.name}
        layout="fill"
        objectFit="cover"
        className={cn(
          "rounded-sm border brightness-50 transition-all",
          selected && "brightness-100"
        )}
      />
    </button>
  )
}

export default Thumb
