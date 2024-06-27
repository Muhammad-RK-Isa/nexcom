import React from "react"
import { notFound } from "next/navigation"
import { api } from "~/trpc/server"

import ProductForm from "./_components/product-form"
import ProductFormSkeleton from "./_components/product-form/skeleton"

const ProductPage = async ({ params: { id } }: { params: { id: string } }) => {
  const product =
    id === "new" ? null : await api.products.getProductById({ id })

  if (!product && id !== "new") return notFound()

  return (
    <div className="-mx-4 -mb-4 lg:-mx-6 lg:-mb-6">
      <React.Suspense fallback={<ProductFormSkeleton />}>
        <ProductForm product={product} />
      </React.Suspense>
    </div>
  )
}

export default ProductPage
