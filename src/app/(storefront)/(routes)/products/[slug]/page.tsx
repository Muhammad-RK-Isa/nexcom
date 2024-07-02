import React from "react"
import { notFound } from "next/navigation"

import { Icons } from "~/components/icons"
import { api } from "~/trpc/server"

import ProductImageViewer from "./_components/product-image-viewer"

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
        <div className="relative aspect-square w-full max-w-[calc(100vw-2rem)]">
          {product.images[0]?.url ? (
            <ProductImageViewer images={product.images} />
          ) : (
            <Icons.image className="size-full" />
          )}
        </div>
        <div className="flex max-w-[calc(100vw-2rem)] flex-col space-y-4">
          <h1 className="line-clamp-2 break-words text-2xl font-medium lg:text-3xl">
            {product.title}
          </h1>
          <h2 className="text-xl lg:text-2xl">
            {"৳"}
            {product.price.toFixed(2)}
          </h2>
        </div>
      </div>
    </div>
  )
}

export default ProductPage
