"use client"

import React from "react"
import { isEqual } from "lodash"

import type { CompleteProduct } from "~/types"
import { Icons } from "~/components/icons"

import { AddToCartForm } from "./add-to-cart-form"
import OptionSelect from "./option-select"
import ProductImageViewer from "./product-image-viewer"

interface ProductClientProps {
  product: CompleteProduct
}

const ProductClient: React.FC<ProductClientProps> = ({ product }) => {
  const { variants, options, images } = product
  const [selectedOptions, setSelectedOptions] = React.useState<
    Record<string, string>
  >({})

  React.useEffect(() => {
    const optionObj: Record<string, string> = {}

    for (const option of options) {
      optionObj[option.id] = ""
    }

    setSelectedOptions(optionObj)
  }, [options])

  const variantRecord = React.useMemo(() => {
    const map: Record<string, Record<string, string>> = {}

    for (const variant of variants) {
      if (!variant.optionValues) continue

      const temp: Record<string, string> = {}

      for (const optionValue of variant.optionValues) {
        temp[optionValue.optionId] = optionValue.value
      }

      map[variant.id] = temp
    }

    return map
  }, [variants])

  const selectedVariant = React.useMemo(() => {
    let variantId: string | undefined = undefined

    for (const [key, value] of Object.entries(variantRecord)) {
      if (isEqual(value, selectedOptions)) {
        variantId = key
        break
      }
    }

    return variants.find((v) => v.id === variantId)
  }, [selectedOptions, variantRecord, variants])

  const handleOptionChange = (optionId: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }
  return (
    <>
      <div className="relative aspect-square w-full max-w-[calc(100vw-2rem)]">
        {images[0]?.url ? (
          <ProductImageViewer
            images={product.images}
            selectedVariant={selectedVariant}
          />
        ) : (
          <Icons.image className="size-full" />
        )}
      </div>
      <div className="flex max-w-[calc(100vw-2rem)] flex-col space-y-4">
        <h1 className="line-clamp-2 break-words text-2xl font-medium lg:text-3xl">
          {product.title}
        </h1>
        <h2 className="text-xl lg:text-2xl">
          {"৳"}
          {product.price.toFixed(2)}
        </h2>
        {product.options.length > 0 ? (
          <OptionSelect
            options={product.options}
            onValueChange={handleOptionChange}
            selectedOptions={selectedOptions}
          />
        ) : null}
        <AddToCartForm productId={product.id} />
      </div>
    </>
  )
}

export default ProductClient
