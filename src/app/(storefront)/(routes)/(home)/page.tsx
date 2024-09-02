import React from "react"

import type { FilterProductParams } from "~/types"
import ProductsCollection from "~/components/shop/product/products-collection"
import { api } from "~/trpc/server"

interface StorefrontHomepageProps {
  searchParams: FilterProductParams
}

const StorefrontHomepage: React.FC<StorefrontHomepageProps> = async ({
  searchParams,
}) => {
  const { data } = await api.products.getFilteredProducts(searchParams)
  return (
    <div className="flex flex-col p-4 lg:p-6">
      <ProductsCollection products={data} />
    </div>
  )
}

export default StorefrontHomepage
