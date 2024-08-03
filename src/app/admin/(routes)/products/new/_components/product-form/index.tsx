"use client"

import React from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next-nprogress-bar"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import type { CreateProductInput } from "~/types"
import { Paths } from "~/lib/constants"
import { cn } from "~/lib/utils"
import { insertProductSchema } from "~/lib/validations/product"
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
import { ScrollArea } from "~/components/ui/scroll-area"
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

const ProductForm = () => {
  const router = useRouter()
  const [isActionsMenuOpen, setIsActionsMenuOpen] = React.useState(false)

  const form = useForm<CreateProductInput>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      inventoryQuantity: 0,
      manageInventory: true,
      allowBackorder: false,
      weight: {
        value: undefined,
        unit: "kg",
      },
      length: {
        value: undefined,
        unit: "m",
      },
      height: {
        value: undefined,
        unit: "m",
      },
      width: {
        value: undefined,
        unit: "m",
      },
      status: "active",
      options: [],
      variants: [],
      images: [],
      originCountry: "",
      content: "",
      metaTitle: "",
      material: "",
    },
  })

  const { mutate: createProduct, isPending: isCreating } =
    api.products.createProduct.useMutation({
      onSuccess: () => {
        toast.success("Product created")
        setIsActionsMenuOpen(false)
        router.push(`${Paths.Admin.Products}/{data?.product?.id}`)
      },
      onError: (err) => {
        toast.error(err.message)
        console.table(err)
      },
    })

  const onSubmit = (values: CreateProductInput) => {
    createProduct(values)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto grid flex-1 auto-rows-max"
      >
        <div className="-mt-6 w-full border-b bg-card py-4">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 sm:justify-start lg:px-0">
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
              Add Product
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
                disabled={isCreating}
                loading={isCreating}
              >
                Create
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
                <DropdownMenuSeparator className="my-0" />
                <DropdownMenuItem
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isCreating || !form.formState.isDirty}
                  className="text-xs"
                >
                  Save
                  {isCreating ? (
                    <Icons.spinner className="ml-auto size-3" />
                  ) : null}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-xs"
                  disabled={isCreating || !form.formState.isDirty}
                  onClick={() => router.push("/admin/products")}
                >
                  Discard
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <ScrollArea className="max-h-[calc(100vh-117px)] w-full px-4 lg:max-h-[calc(100vh-125px)] lg:px-6">
          <div className="mx-auto my-4 grid max-w-6xl gap-4 md:grid-cols-[1fr_250px] lg:my-6 lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <ProductDetailsForm />
              <ProductPricingForm />
              <ProductInventoryForm />
              <ProductShippingForm />
              {/* <ProductVariantsForm /> */}
              <ProductSEOForm />
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <ProductStatusForm />
              <ProductOrganisationForm />
            </div>
          </div>
        </ScrollArea>
      </form>
    </Form>
  )
}

export default ProductForm
