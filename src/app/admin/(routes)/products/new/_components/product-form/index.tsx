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
import { Icons } from "~/components/icons"
import { api } from "~/trpc/react"

import ProductDetailsForm from "./product-details"
import ProductInventoryForm from "./product-inventory"
import ProductOrganisationForm from "./product-organisation"
import ProductPricingForm from "./product-pricing"
import ProductSEOForm from "./product-seo"
import ProductShippingForm from "./product-shipping"
import ProductStatusForm from "./product-status"

const ProductForm = () => {
  const router = useRouter()
  const [isActionsMenuOpen, setIsActionsMenuOpen] = React.useState(false)

  const form = useForm<CreateProductInput>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
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
      content: {},
      metaTitle: "",
      material: "",
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
        if (
          err.message.includes("slug_index") &&
          err.message.includes("duplicate key value violates unique constraint")
        ) {
          form.setError("slug", { message: "This slug is already in use" })
          form.setFocus("slug")
          return
        }
        toast.error(err.message)
      },
    })

  const onSubmit = (values: CreateProductInput) => {
    createProduct(values)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="-mt-4 md:space-y-4 lg:space-y-0 lg:px-6"
      >
        <div className="sticky top-[54px] z-10 -mx-4 w-screen bg-[#fafafa] dark:bg-background md:mx-0 md:w-full">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 p-4 sm:justify-start lg:px-0">
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
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    form.handleSubmit(onSubmit)()
                    setIsActionsMenuOpen(false)
                  }}
                  disabled={isCreating || !form.formState.isDirty}
                  className="text-xs"
                >
                  Save
                  {isCreating ? (
                    <Icons.spinner className="ml-auto size-3" />
                  ) : null}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
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
        <div className="mx-auto grid w-full max-w-5xl gap-4 lg:grid-cols-[2fr,1fr] lg:px-0">
          <div className="grid auto-rows-max gap-4">
            <ProductDetailsForm />
            <ProductPricingForm />
            <ProductInventoryForm />
            <ProductShippingForm />
            {/* <ProductVariantsForm /> */}
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
