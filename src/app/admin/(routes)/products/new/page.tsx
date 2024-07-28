import React from "react"
import { type Metadata } from "next"

import ProductForm from "./_components/product-form"
import ProductFormSkeleton from "./_components/skeleton"

export const metadata: Metadata = {
  title: "Create Product",
  description: "Create a new product",
}

const CreateProductPage = () => {
  return (
    <div className="-mx-4 -mb-4 lg:-mx-6 lg:-mb-6">
      <React.Suspense fallback={<ProductFormSkeleton />}>
        <ProductForm />
      </React.Suspense>
    </div>
  )
}

export default CreateProductPage
