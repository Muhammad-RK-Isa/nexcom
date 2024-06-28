import React from "react"
import { api } from "~/trpc/server"

import ProductsCollection from "~/components/shop/product/products-collection"
import type { SearchProductParams } from "~/types"

interface StorefrontHomepageProps {
  searchParams: SearchProductParams
}

const StorefrontHomepage: React.FC<StorefrontHomepageProps> = async ({
  searchParams,
}) => {
  const { data, pageCount } = await api.products.getProducts(searchParams)
  return (
    <div className="flex flex-col py-16">
      <ProductsCollection products={data} />
    </div>
  )
}

export default StorefrontHomepage
