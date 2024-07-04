"use client"

import React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { isEqual } from "lodash"

import type { CartItem, CompleteProduct } from "~/types"
import { Icons } from "~/components/icons"

import { AddToCartForm } from "./add-to-cart-form"
import OptionSelect from "./option-select"
import ProductImageViewer from "./product-image-viewer"

interface ProductClientProps {
  product: CompleteProduct
  cartItems?: CartItem[] | null
}

const ProductClient: React.FC<ProductClientProps> = ({
  product,
  cartItems,
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { variants, options, images } = product
  const [selectedOptions, setSelectedOptions] = React.useState<
    Record<string, string>
  >({})

  React.useEffect(() => {
    const optionObj: Record<string, string> = {}
    const variantId = searchParams.get("variant")

    for (const option of options) {
      optionObj[option.id] = ""
    }

    if (variantId) {
      const variant = variants.find((v) => v.id === variantId)
      if (variant && variant.optionValues) {
        variant.optionValues.forEach((ov) => {
          optionObj[ov.optionId] = ov.value
        })
      }
    }

    setSelectedOptions(optionObj)
  }, [options, variants, searchParams])

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

    if (variantId) {
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.set("variant", variantId)
      router.replace(newUrl.toString(), { scroll: false })
    }

    return variants.find((v) => v.id === variantId)
  }, [selectedOptions, variantRecord, variants, router])

  const handleOptionChange = (optionId: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  const cartQuantity = cartItems?.find(
    (item) =>
      item.productId === product.id && item.variantId === selectedVariant?.id
  )?.quantity
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
      <div className="flex max-w-[calc(100vw-2rem)] flex-col space-y-4 lg:space-y-6">
        <div className="flex flex-col space-y-1.5 sm:space-y-2 lg:space-y-4">
          <h1 className="line-clamp-2 break-words text-2xl font-medium lg:text-3xl">
            {product.title}
          </h1>
          <h2 className="text-xl lg:text-2xl">
            {"৳"}
            {product.price.toFixed(2)}
          </h2>
        </div>
        {product.options.length > 0 ? (
          <OptionSelect
            options={product.options}
            onValueChange={handleOptionChange}
            selectedOptions={selectedOptions}
          />
        ) : null}
        <AddToCartForm
          productId={product.id}
          variantId={selectedVariant?.id}
          cartQuantity={cartQuantity}
          variantRequired={product.variants.length >= 1 && !selectedVariant}
          options={options}
        />
      </div>
    </>
  )
}

export default ProductClient
