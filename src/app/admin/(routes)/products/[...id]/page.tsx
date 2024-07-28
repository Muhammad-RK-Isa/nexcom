import React from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"

import { api } from "~/trpc/server"

interface ProductPageProps {
  params: {
    id: string
  }
}

const ProductPage: React.FC<ProductPageProps> = async ({ params }) => {
  const product = await api.products.getProductById({ id: params.id })

  if (!product) return notFound()
  return <div>{product.title}</div>
}

export default ProductPage
