import React from "react"

import type { FilteredProducts } from "~/types"

import ProductCard from "./product-card"

interface ProductsCollectionProps {
  products: FilteredProducts["data"]
}

const ProductsCollection: React.FC<ProductsCollectionProps> = ({
  products,
}) => {
  return (
    <div className="mx-auto grid grid-cols-2 gap-6 md:grid-cols-3 lg:max-w-screen-lg lg:grid-cols-4 xl:max-w-screen-2xl xl:grid-cols-5">
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
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductsCollection
