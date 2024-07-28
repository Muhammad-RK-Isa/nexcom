import React from "react"
import Image from "next/image"
import Link from "next/link"

import type { SearchedProducts } from "~/types"
import { cn } from "~/lib/utils"
import { AspectRatio } from "~/components/ui/aspect-ratio"
import { Button } from "~/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip"
import { Icons } from "~/components/icons"

interface ProductCardProps {
  product: SearchedProducts["data"][number]
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { title, price, images } = product
  const cardImages = images.sort((a, b) => a.rank - b.rank)
  return (
    <div className="flex flex-col justify-between space-y-4 rounded-lg border bg-card p-3 sm:p-3.5 md:p-4">
      <Link href={`/products/${product.slug}`}>
        {cardImages[0]?.url ? (
          <div className="group relative aspect-square w-full overflow-hidden rounded-lg border border-border/50">
            {cardImages[1]?.url ? (
              <Image
                src={cardImages[1]?.url}
                alt={title}
                fill
                className="absolute inset-y-0 rounded-lg object-cover opacity-0 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100"
              />
            ) : null}
            <Image
              src={cardImages[0]?.url}
              alt={title}
              fill
              className={cn(
                "rounded-lg object-cover transition-all duration-500 group-hover:scale-110",
                cardImages[1]?.url && "group-hover:opacity-0"
              )}
            />
          </div>
        ) : (
          <Icons.image className="size-full" />
        )}
        <div className="mt-4 flex flex-col space-y-1 text-sm md:text-lg">
          <h3 className="line-clamp-1 overflow-hidden text-ellipsis break-all font-medium">
            {title}
          </h3>
          <p className="tracking-wide">
            {"৳"}
            {price}
          </p>
        </div>
      </Link>
      <div className="flex items-center justify-between space-x-2">
        <Button
          variant="secondary"
          className="h-8 flex-1 border bg-secondary/50 text-xs sm:h-9 sm:text-sm"
        >
          <Icons.cart className="mr-2 size-3.5 sm:size-4" />
          <span className="inline sm:hidden">Add</span>
          <span className="hidden sm:inline">Add to cart</span>
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 sm:h-9">
              <Icons.eye className="size-3.5 sm:size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">Quick view</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

export default ProductCard
