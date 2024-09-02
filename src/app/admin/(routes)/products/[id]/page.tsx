import React from "react"
import { type Metadata } from "next"
import { notFound } from "next/navigation"

import { env } from "~/env"
import { api } from "~/trpc/server"

import ProductForm from "./_components/product-form"
import ProductFormSkeleton from "./_components/skeleton"

interface ProductPageProps {
  params: { id: string }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  if (params.id === "new")
    return {
      title: "Add Product",
      description: "Create a new product",
      metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    }

  const { title, description, image } =
    await api.products.getProductMetadataById({ id: params.id })

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title,
    description,
    openGraph: image
      ? {
          title,
          description,
          images: [image.url],
        }
      : undefined,
  }
}

const ProductPage: React.FC<ProductPageProps> = async ({ params: { id } }) => {
  const product =
    id === "new" ? undefined : await api.products.getEditableProduct({ id })

  if (!product && id !== "new") return notFound()

  return (
    <React.Suspense fallback={<ProductFormSkeleton />}>
      <ProductForm product={product} />
    </React.Suspense>
  )
}

export default ProductPage
