import React from "react"
import { type Metadata } from "next"
import { notFound } from "next/navigation"

import { toTitleCase } from "~/lib/utils"
import { env } from "~/env"
import { api } from "~/trpc/server"

import ProductClient from "./_components/product-client"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const slug = decodeURIComponent(params.slug)

  const product = await api.products.getProductMetadataBySlug({ slug })

  if (!product) {
    return {}
  }

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: toTitleCase(product.title),
    description: product.description,
    openGraph: product.image
      ? {
          title: product.title,
          description: product.description,
          images: [product.image.url],
        }
      : undefined,
  }
}

const ProductPage: React.FC<ProductPageProps> = async ({ params }) => {
  const product = await api.products.getPublicProduct(params)
  const cart = await api.carts.getCart()

  if (!product) return notFound()

  return (
    <div className="mx-auto w-full p-4 pt-0 md:pt-6 lg:max-w-screen-xl lg:p-6 lg:pt-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:gap-8 xl:gap-12">
        <React.Suspense>
          <ProductClient product={product} cartItems={cart?.items} />
        </React.Suspense>
      </div>
    </div>
  )
}

export default ProductPage
