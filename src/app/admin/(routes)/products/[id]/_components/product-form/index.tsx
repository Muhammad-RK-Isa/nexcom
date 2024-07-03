"use client"

import React from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next-nprogress-bar"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import type {
  CreateProductInput,
  EditableProduct,
  UpdateProductInput,
} from "~/types"
import { cn } from "~/lib/utils"
import { insertProductSchema, productStatuses } from "~/lib/validations/product"
import { Badge } from "~/components/ui/badge"
import { Button, buttonVariants } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { ScrollArea } from "~/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Icons } from "~/components/icons"
import KeywordsInput from "~/components/keywords-input"
import { api } from "~/trpc/react"

import { getStatusIcon } from "../../../_lib/utils"
import ProductDetailsForm from "./product-details"
import ProductInventoryForm from "./product-inventory"
import ProductPricingForm from "./product-pricing"
import ProductShippingForm from "./product-shipping"
import { ProductVariantsForm } from "./product-variants"

interface ProductFormProps {
  product?: EditableProduct
}

const ProductForm: React.FC<ProductFormProps> = ({ product }) => {
  const editing = !!product?.id

  const router = useRouter()
  const [isActionMenuOpen, setIsActionMenuOpen] = React.useState(false)

  const form = useForm<UpdateProductInput>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: product
      ? {
          ...product,
          options: product.options?.sort((a, b) => a.rank - b.rank),
          images: product.images
            ?.sort((a, b) => a.rank - b.rank)
            .flatMap(({ id, name, url }) => ({
              id,
              name,
              url,
            })),
        }
      : {
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
          status: "active",
          options: [],
          variants: [],
          images: [],
        },
  })

  const { mutate: createProduct, isPending: isCreating } =
    api.products.createProduct.useMutation({
      onSuccess: (data) => {
        toast.success("Product created")
        setIsActionMenuOpen(false)
        router.push(`/admin/products/${data?.product?.id}`)
      },
      onError: (err) => {
        toast.error(err.message)
        console.table(err)
      },
    })

  const { mutate: updateProduct, isPending: isUpdating } =
    api.products.updateProduct.useMutation({
      onSuccess: () => {
        toast.success("Product updated")
        setIsActionMenuOpen(false)
        router.refresh()
      },
      onError: (err) => {
        toast.error(err.message)
      },
    })

  const onSubmit = (values: CreateProductInput) => {
    if (!!product?.id) {
      updateProduct({
        ...values,
        id: product.id,
      })
    } else {
      createProduct(values)
      return
    }
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
              {product?.title ?? "Add Product"}
            </h1>
            {editing ? (
              <Badge
                variant={
                  product.status === productStatuses.Values.active
                    ? "secondary"
                    : product.status === productStatuses.Values.draft
                      ? "outline"
                      : "secondary"
                }
                className="capitalize"
              >
                {product.status}
              </Badge>
            ) : null}
            <div className="hidden items-center gap-2 sm:ml-auto sm:flex">
              <Button
                variant="outline"
                size="sm"
                type="button"
                disabled={isUpdating}
                onClick={() => router.push("/admin/products")}
              >
                Discard
              </Button>
              <Button
                size="sm"
                type="submit"
                disabled={isUpdating || isCreating}
                loading={isUpdating || isCreating}
              >
                {editing ? "Save" : "Create"}
              </Button>
            </div>
            <DropdownMenu
              open={isActionMenuOpen}
              onOpenChange={setIsActionMenuOpen}
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
                  disabled={isUpdating || isCreating || !form.formState.isDirty}
                  className="text-xs"
                >
                  {editing ? "Save" : "Create"}
                  {isCreating || isUpdating ? (
                    <Icons.spinner className="ml-auto size-3" />
                  ) : null}
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={isUpdating}
                  className="text-xs"
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
              <ProductVariantsForm />
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Product Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Status</FormLabel>
                        <Select
                          {...field}
                          value={field.value}
                          onValueChange={field.onChange}
                          defaultValue={productStatuses.Values.active}
                        >
                          <FormControl>
                            <SelectTrigger className="capitalize">
                              <SelectValue placeholder="Select the status of the product" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(productStatuses.Values).map(
                              (status, idx) => {
                                const Icon = getStatusIcon(status)
                                return (
                                  <SelectItem key={idx} value={status}>
                                    <div className="flex items-center">
                                      <Icon className="mr-2 size-4 text-muted-foreground" />
                                      <span className="capitalize">
                                        {status}
                                      </span>
                                    </div>
                                  </SelectItem>
                                )
                              }
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Product Organization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <FormField
                      name="vendor"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vendor</FormLabel>
                          <Input {...field} value={field.value ?? ""} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="tags"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tags</FormLabel>
                          <FormControl>
                            <KeywordsInput
                              {...field}
                              onKeywordsChange={field.onChange}
                              initialKeywords={field.value}
                              placeholder=""
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            {form.formState.isValidating && (
              <p className="text-lg">Validating...</p>
            )}
          </div>
        </ScrollArea>
      </form>
    </Form>
  )
}

export default ProductForm
