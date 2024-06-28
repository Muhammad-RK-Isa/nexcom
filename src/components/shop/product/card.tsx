import React from "react"
import Image from "next/image"
import Link from "next/link"

import { cn } from "~/lib/utils"
import { Icons } from "~/components/icons"
import type { SearchedProducts } from "~/types"

interface ProductCardProps {
  product: SearchedProducts["data"][number]
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { title, price, images } = product
  const cardImages = images.sort((a, b) => a.rank - b.rank)
  return (
    <div className="flex flex-col space-y-4">
      <Link href={`/products/${product.slug}`}>
        <div className="group relative h-80 w-full cursor-pointer rounded-lg">
          {cardImages[0]?.url ? (
            <>
              <Image
                src={cardImages[0]?.url}
                alt={title}
                layout="fill"
                objectFit="contain"
                className={cn(
                  "rounded-lg",
                  cardImages[1]?.url &&
                    "transition-opacity duration-300 group-hover:opacity-0"
                )}
              />
              {cardImages[1]?.url ? (
                <Image
                  src={cardImages[1]?.url}
                  alt={title}
                  layout="fill"
                  objectFit="contain"
                  className="absolute inset-y-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              ) : null}
            </>
          ) : (
            <Icons.image className="size-full" />
          )}
        </div>
      </Link>
      <div className="flex flex-col space-y-2">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm">{price}</p>
      </div>
    </div>
  )
}

export default ProductCard
