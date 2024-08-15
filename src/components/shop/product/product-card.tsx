import React from "react"

import type { SearchedProducts } from "~/types"
import {
  AnimatedDialog,
  AnimatedDialogClose,
  AnimatedDialogContainer,
  AnimatedDialogContent,
  AnimatedDialogDescription,
  AnimatedDialogImage,
  AnimatedDialogSubtitle,
  AnimatedDialogTitle,
  AnimatedDialogTrigger,
} from "~/components/ui/animated-dialog"

interface ProductCardProps {
  product: SearchedProducts["data"][number]
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { title, price, images, description, mrp } = product
  const cardImages = images.sort((a, b) => a.rank - b.rank)
  return (
    <AnimatedDialog
      transition={{
        type: "spring",
        bounce: 0.05,
        duration: 0.25,
      }}
    >
      <AnimatedDialogTrigger
        style={{
          borderRadius: "12px",
        }}
        className="flex max-w-[270px] flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900"
      >
        <AnimatedDialogImage
          src={cardImages[0]?.url || ""}
          alt="A desk lamp designed by Edouard Wilfrid Buquet in 1925. It features a double-arm design and is made from nickel-plated brass, aluminium and varnished wood."
          className="h-48 w-full object-cover"
        />
        <div className="flex flex-grow flex-row items-end justify-between p-2">
          <div>
            <AnimatedDialogTitle className="text-zinc-950 dark:text-zinc-50">
              {title}
            </AnimatedDialogTitle>
            <AnimatedDialogSubtitle className="line-clamp-2 text-zinc-700 dark:text-zinc-400">
              <div className="flex items-center space-x-2">
                <span className="text-xs line-through">{mrp}</span>
                <span className="text-base font-medium">{price}</span>
              </div>
            </AnimatedDialogSubtitle>
          </div>
        </div>
      </AnimatedDialogTrigger>
      <AnimatedDialogContainer>
        <AnimatedDialogContent
          style={{
            borderRadius: "24px",
          }}
          className="pointer-events-auto relative flex h-auto w-full flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900 sm:w-[500px]"
        >
          <AnimatedDialogImage
            src={images[0]?.url || ""}
            alt="A desk lamp designed by Edouard Wilfrid Buquet in 1925. It features a double-arm design and is made from nickel-plated brass, aluminium and varnished wood."
            className="h-full w-full"
          />
          <div className="p-6">
            <AnimatedDialogTitle className="text-2xl text-zinc-950 dark:text-zinc-50">
              {title}
            </AnimatedDialogTitle>
            <AnimatedDialogSubtitle className="text-zinc-700 dark:text-zinc-400">
              <div className="flex items-center space-x-2">
                <span className="line-through">{mrp}</span>
                <span className="font-medium">{price}</span>
              </div>
            </AnimatedDialogSubtitle>
            <AnimatedDialogDescription
              disableLayoutAnimation
              variants={{
                initial: { opacity: 0, scale: 0.8, y: 100 },
                animate: { opacity: 1, scale: 1, y: 0 },
                exit: { opacity: 0, scale: 0.8, y: 100 },
              }}
            >
              <p className="mt-2 line-clamp-4 text-zinc-500 dark:text-zinc-500">
                {description}
              </p>
            </AnimatedDialogDescription>
          </div>
          <AnimatedDialogClose className="text-zinc-50" />
        </AnimatedDialogContent>
      </AnimatedDialogContainer>
    </AnimatedDialog>
    // <div className="flex flex-col justify-between space-y-4 rounded-lg border bg-card p-3 sm:p-3.5 md:p-4">
    //   <Link href={`/products/${product.slug}`}>
    //     {cardImages[0]?.url ? (
    //       <div className="group relative aspect-square w-full overflow-hidden rounded-lg border border-border/50">
    //         {cardImages[1]?.url ? (
    //           <Image
    //             src={cardImages[1]?.url}
    //             alt={title}
    //             fill
    //             className="absolute inset-y-0 rounded-lg object-cover opacity-0 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100"
    //           />
    //         ) : null}
    //         <Image
    //           src={cardImages[0]?.url}
    //           alt={title}
    //           fill
    //           className={cn(
    //             "rounded-lg object-cover transition-all duration-500 group-hover:scale-110",
    //             cardImages[1]?.url && "group-hover:opacity-0"
    //           )}
    //         />
    //       </div>
    //     ) : (
    //       <Icons.image className="size-full" />
    //     )}
    //     <div className="mt-4 flex flex-col space-y-1 text-sm md:text-lg">
    //       <h3 className="line-clamp-1 overflow-hidden text-ellipsis break-all font-medium">
    //         {title}
    //       </h3>
    //       <p className="tracking-wide">
    //         {"৳"}
    //         {price}
    //       </p>
    //     </div>
    //   </Link>
    //   <div className="flex items-center justify-between space-x-2">
    //     <Button
    //       variant="secondary"
    //       className="h-8 flex-1 border bg-secondary/50 text-xs sm:h-9 sm:text-sm"
    //     >
    //       <Icons.cart className="mr-2 size-3.5 sm:size-4" />
    //       <span className="inline sm:hidden">Add</span>
    //       <span className="hidden sm:inline">Add to cart</span>
    //     </Button>
    //     <Tooltip>
    //       <TooltipTrigger asChild>
    //         <Button variant="outline" size="icon" className="h-8 sm:h-9">
    //           <Icons.eye className="size-3.5 sm:size-4" />
    //         </Button>
    //       </TooltipTrigger>
    //       <TooltipContent>
    //         <p className="text-sm">Quick view</p>
    //       </TooltipContent>
    //     </Tooltip>
    //   </div>
    // </div>
  )
}

export default ProductCard
