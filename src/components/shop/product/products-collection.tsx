import React from "react"

import type { SearchedProducts } from "~/types"

import ProductCard from "./card"

interface ProductsCollectionProps {
  products: SearchedProducts["data"]
}

const ProductsCollection: React.FC<ProductsCollectionProps> = ({
  products,
}) => {
  return (
    <div className="mx-auto grid grid-cols-2 gap-4 md:grid-cols-3 lg:max-w-screen-lg lg:gap-6 xl:max-w-screen-2xl xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductsCollection
