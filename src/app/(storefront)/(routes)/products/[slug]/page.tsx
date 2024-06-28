import React from "react"
import { api } from "~/trpc/server"

interface ProductPageProps {
  params: {
    slug: string
  }
}

const ProductPage: React.FC<ProductPageProps> = async ({ params }) => {
  const product = await api.products.getProductBySlug(params)

  return <div className="text-2xl">{product?.title}</div>
}

export default ProductPage
