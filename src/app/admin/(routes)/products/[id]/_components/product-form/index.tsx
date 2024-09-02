"use client"

import React from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next-nprogress-bar"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import type { EditableProduct, UpdateProductInput } from "~/types"
import { Paths } from "~/lib/constants"
import { cn } from "~/lib/utils"
import { updateProductSchema } from "~/lib/validations/product"
import { Button, buttonVariants } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Form } from "~/components/ui/form"
import { Icons } from "~/components/icons"
import { api } from "~/trpc/react"

import ProductDetailsForm from "./product-details"
import ProductInventoryForm from "./product-inventory"
import ProductOrganisationForm from "./product-organisation"
import ProductPricingForm from "./product-pricing"
import ProductSEOForm from "./product-seo"
import ProductShippingForm from "./product-shipping"
import ProductStatusForm from "./product-status"
import { ProductVariantsForm } from "./product-variants"

interface ProductFormProps {
  product?: EditableProduct
}

const ProductForm: React.FC<ProductFormProps> = ({ product }) => {
  const router = useRouter()
  const [isActionsMenuOpen, setIsActionsMenuOpen] = React.useState(false)

  const form = useForm<UpdateProductInput>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      id: product?.id || undefined,
      title: product?.title || undefined,
      slug: product?.slug || undefined,
      description: product?.description || undefined,
      price: product?.price || undefined,
      mrp: product?.mrp || undefined,
      manageInventory: product?.manageInventory || true,
      allowBackorder: product?.allowBackorder || false,
      inventoryQuantity: product?.inventoryQuantity || undefined,
      weight: {
        value: product?.weight?.value || undefined,
        unit: product?.weight?.unit || "kg",
      },
      length: {
        value: product?.length?.value || undefined,
        unit: product?.length?.unit || "m",
      },
      height: {
        value: product?.height?.value || undefined,
        unit: product?.height?.unit || "m",
      },
      width: {
        value: product?.width?.value || undefined,
        unit: product?.width?.unit || "m",
      },
      status: product?.status || "active",
      options: product?.options || [],
      variants: product?.variants || [],
      images: product?.images || [],
      originCountry: product?.originCountry || undefined,
      content: product?.content || {},
      metaTitle: product?.metaTitle || undefined,
      material: product?.material || undefined,
    },
  })

  const { mutate: createProduct, isPending: isCreating } =
    api.products.createProduct.useMutation({
      onSuccess: () => {
        toast.success("Product created")
        setIsActionsMenuOpen(false)
        router.push(`${Paths.Admin.Products}`)
      },
      onError: (err) => {
        if (err.data?.code === "CONFLICT")
          form.setError(
            "slug",
            {
              message: "This slug is already in use",
            },
            {
              shouldFocus: true,
            }
          )
        else toast.error(err.message)
      },
    })

  const { mutate: updateProduct, isPending: isUpdating } =
    api.products.updateProduct.useMutation({
      onSuccess: () => {
        toast.success("Product updated")
        router.push(Paths.Admin.Products)
      },
      onError: (err) => {
        if (err.data?.code === "CONFLICT")
          form.setError(
            "slug",
            {
              message: "This slug is already in use",
            },
            {
              shouldFocus: true,
            }
          )
        else toast.error(err.message)
      },
    })

  const onSubmit = (values: UpdateProductInput) => {
    if (product?.id) {
      console.log(values)
      updateProduct(values)
    } else {
      createProduct(values)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="-mt-4 lg:space-y-0 lg:px-6"
      >
        <div className="sticky top-[54px] z-10 -mx-4 w-screen bg-[#fafafa] dark:bg-background sm:mx-0 sm:w-full md:w-full">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 p-4 sm:justify-start sm:px-0 xl:max-w-6xl">
            <Link
              href={"/admin/products"}
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "icon",
                  className: "size-7",
                })
              )}
            >
              <Icons.chevronLeft className="size-4" />
              <span className="sr-only">Back</span>
            </Link>
            <h1 className="max-w-40 truncate text-lg font-semibold tracking-tight md:max-w-72 md:text-xl lg:max-w-[60%]">
              {product ? "Edit Product" : "Add Product"}
            </h1>
            <div className="hidden items-center gap-2 sm:ml-auto sm:flex">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => router.push("/admin/products")}
              >
                Discard
              </Button>
              <Button
                size="sm"
                type="submit"
                disabled={isCreating || isUpdating}
                loading={isCreating || isUpdating}
              >
                {product ? "Save" : "Create"}
              </Button>
            </div>
            <DropdownMenu
              open={isActionsMenuOpen}
              onOpenChange={setIsActionsMenuOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-7 sm:hidden"
                >
                  <Icons.ellipsisVertical className="size-4" />
                  <span className="sr-only">Toggle form actions menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-xs">
                  Actions
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    form.handleSubmit(onSubmit)()
                    setIsActionsMenuOpen(false)
                  }}
                  disabled={isCreating || isUpdating || !form.formState.isDirty}
                  className="text-xs"
                >
                  {product ? "Save" : "Create"}
                  {isCreating || isUpdating ? (
                    <Icons.spinner className="ml-auto size-3" />
                  ) : null}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-xs"
                  disabled={isCreating || isUpdating || !form.formState.isDirty}
                  onClick={() => router.push("/admin/products")}
                >
                  Discard
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="mx-auto grid w-full max-w-5xl gap-4 lg:grid-cols-[2fr,1fr] lg:px-0 xl:max-w-6xl">
          <div className="grid auto-rows-max gap-4">
            <ProductDetailsForm />
            <ProductPricingForm />
            <ProductInventoryForm />
            <ProductShippingForm />
            <ProductVariantsForm />
            <ProductSEOForm />
          </div>
          <div className="grid auto-rows-max items-start gap-4">
            <ProductStatusForm />
            <ProductOrganisationForm />
          </div>
        </div>
      </form>
    </Form>
  )
}

export default ProductForm
