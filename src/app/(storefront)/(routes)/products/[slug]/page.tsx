import React from "react"
import Image from "next/image"
import { notFound } from "next/navigation"

import { Icons } from "~/components/icons"
import { api } from "~/trpc/server"

import ProductImageSlider from "./_components/product-image-viewer"

interface ProductPageProps {
  params: {
    slug: string
  }
}

const ProductPage: React.FC<ProductPageProps> = async ({ params }) => {
  const product = await api.products.getProductBySlug(params)

  if (!product) return notFound()

  return (
    <div className="mx-auto w-full p-4 md:pt-6 lg:max-w-screen-xl lg:p-6 lg:pt-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:gap-8 xl:gap-12">
        <div className="relative aspect-square w-full">
          {product.images[0]?.url ? (
            <ProductImageSlider images={product.images} />
          ) : (
            <Icons.image className="size-full" />
          )}
        </div>
        <div className="flex flex-col space-y-4">
          <h1 className="line-clamp-3 break-words text-3xl font-medium">
            {product.title}
          </h1>
          <h2 className="text-2xl">
            {"৳"}
            {product.price.toFixed(2)}
          </h2>
        </div>
      </div>
    </div>
  )
}

export default ProductPage
