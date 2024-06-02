"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next-nprogress-bar";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Icons } from "~/components/icons";
import { Badge } from "~/components/ui/badge";
import { Button, buttonVariants } from "~/components/ui/button";
import KeywordsInput from "~/components/keywords-input";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { cn, slugify } from "~/lib/utils";

import {
  insertProductSchema,
  productStatuses,
  sizeUnits,
  weightUnits,
} from "~/schemas";
import { api } from "~/trpc/react";
import type {
  CompleteProduct,
  CreateProductInput,
  UpdateProductInput,
} from "~/types";
import { getStatusIcon } from "../../_lib/utils";
import { ProductVariantsForm } from "./product-variants-form";

interface ProductFormMainProps {
  product?: CompleteProduct;
}

export const ProductFormMain: React.FC<ProductFormMainProps> = ({
  product,
}) => {
  const editing = !!product?.id;

  const router = useRouter();

  const form = useForm<UpdateProductInput>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: product ?? {
      title: "",
      slug: "",
      description: "",
      manageInventory: true,
      allowBackorder: false,
      height: null,
      length: null,
      weightUnit: "kg",
      heightUnit: "m",
      lengthUnit: "m",
      status: "active",
      product_options: [],
      product_variants: [],
    },
  });

  const { mutate: createProduct, isPending: isCreating } =
    api.products.createProduct.useMutation({
      onSuccess: (data) => {
        toast.success("Product created");
        router.push(`/admin/products/${data?.product?.id}`);
      },
      onError: (err) => {
        toast.error(err.message);
        console.table(err);
      },
    });

  const { mutate: updateProduct, isPending: isUpdating } =
    api.products.updateProduct.useMutation({
      onSuccess: () => {
        toast.success("Product updated");
        router.refresh();
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });

  const onSubmit = (values: CreateProductInput) => {
    if (!!product?.id) {
      updateProduct({
        ...values,
        id: product.id,
      });
    } else {
      createProduct(values);
      return;
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4"
      >
        <div className="flex items-center gap-4">
          <Link
            href={"/admin/products"}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "icon",
                className: "size-7",
              }),
            )}
          >
            <Icons.chevronLeft className="size-4" />
            <span className="sr-only">Back</span>
          </Link>
          <h1 className="max-w-44 truncate text-xl font-semibold tracking-tight md:max-w-72 lg:max-w-[60%]">
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
          <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Button
              variant="outline"
              size="sm"
              type="button"
              disabled={isUpdating}
            >
              Discard
            </Button>
            <Button
              size="sm"
              type="submit"
              disabled={isUpdating || isCreating}
              loading={isUpdating || isCreating}
              loadingText="Saving"
            >
              {editing ? "Save" : "Create"}
            </Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <FormField
                    name="title"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Product title"
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value);
                              form.setValue("slug", slugify(value));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="slug"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="description"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <Textarea
                          {...field}
                          value={field.value ?? ""}
                          placeholder="Write a short description of the product"
                          rows={6}
                        />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    name="price"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="grid gap-2.5 space-y-0">
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">
                              {"৳"}
                            </span>
                            <Input
                              {...field}
                              type="number"
                              inputMode="numeric"
                              placeholder="0.00"
                              className="pl-8"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="mrp"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center justify-between">
                          MRP
                          <HoverCard openDelay={100}>
                            <HoverCardTrigger
                              className={cn(
                                buttonVariants({
                                  variant: "secondary",
                                  size: "icon",
                                  className:
                                    "size-4 rounded-full text-xs text-muted-foreground",
                                }),
                              )}
                            >
                              ?
                            </HoverCardTrigger>
                            <HoverCardContent className="text-xs">
                              MRP stands for Maximum Retail Price. The
                              &quot;Price&quot; will be compared with this
                              &quot;MRP&quot;.
                            </HoverCardContent>
                          </HoverCard>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">
                              {"৳"}
                            </span>
                            <Input
                              {...field}
                              type="number"
                              inputMode="numeric"
                              placeholder="0.00"
                              className="pl-8"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <FormField
                    name="manageInventory"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border pl-4 shadow-input hover:bg-accent hover:text-accent-foreground">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="w-full p-4 pl-0">
                          Manage inventory
                          <FormMessage />
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="allowBackorder"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border pl-4 shadow-input hover:bg-accent hover:text-accent-foreground">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="w-full p-4 pl-0">
                          Continue selling when out of stock
                          <FormMessage />
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="inventoryQuantity"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <div className="grid grid-cols-2 gap-6">
                          <Input {...field} type="number" />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Shipping</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center space-x-4">
                      <FormField
                        name="weight"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight</FormLabel>
                            <Input
                              {...field}
                              type="number"
                              inputMode="numeric"
                            />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="weightUnit"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              {...field}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a unit" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.values(weightUnits.Values).map(
                                  (u, idx) => (
                                    <SelectItem key={idx} value={u}>
                                      {u}
                                    </SelectItem>
                                  ),
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {form.getFieldState("weight").error ||
                    form.getFieldState("weightUnit").error ? (
                      <p className="text-[0.8rem] font-medium text-destructive">
                        {form.getFieldState("weight").error?.message}
                        <br />
                        {form.getFieldState("weightUnit").error?.message}
                      </p>
                    ) : null}
                  </div>
                  <div className="gap2.5 flex flex-col">
                    <div className="flex items-center space-x-4">
                      <FormField
                        name="height"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Height</FormLabel>
                            <Input
                              {...field}
                              type="number"
                              value={field.value ?? ""}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="heightUnit"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              {...field}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a unit" />
                                </SelectTrigger>
                              </FormControl>
                              <FormMessage />
                              <SelectContent>
                                {Object.values(sizeUnits.Values).map(
                                  (u, idx) => (
                                    <SelectItem key={idx} value={u}>
                                      {u}
                                    </SelectItem>
                                  ),
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {form.getFieldState("height").error ||
                    form.getFieldState("heightUnit").error ? (
                      <p className="text-[0.8rem] font-medium text-destructive">
                        {form.getFieldState("weight").error?.message}
                        <br />
                        {form.getFieldState("weightUnit").error?.message}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center space-x-4">
                      <FormField
                        name="length"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Length</FormLabel>
                            <Input
                              {...field}
                              type="number"
                              value={field.value ?? ""}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="lengthUnit"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              {...field}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a unit" />
                                </SelectTrigger>
                              </FormControl>
                              <FormMessage />
                              <SelectContent>
                                {Object.values(sizeUnits.Values).map(
                                  (u, idx) => (
                                    <SelectItem key={idx} value={u}>
                                      {u}
                                    </SelectItem>
                                  ),
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {form.getFieldState("height").error ||
                    form.getFieldState("heightUnit").error ? (
                      <p className="text-[0.8rem] font-medium text-destructive">
                        {form.getFieldState("length").error?.message}
                        <br />
                        {form.getFieldState("lengthUnit").error?.message}
                      </p>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
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
                              const Icon = getStatusIcon(status);
                              return (
                                <SelectItem key={idx} value={status}>
                                  <div className="flex items-center">
                                    <Icon className="mr-2 size-4 text-muted-foreground" />
                                    <span className="capitalize">{status}</span>
                                  </div>
                                </SelectItem>
                              );
                            },
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
        </div>
        <div className="ml-auto flex items-center gap-2 md:hidden">
          <Button
            variant="outline"
            size="sm"
            type="button"
            disabled={isUpdating}
          >
            Discard
          </Button>
          <Button
            size="sm"
            type="submit"
            disabled={isUpdating || isCreating}
            loading={isUpdating || isCreating}
            loadingText="Saving"
          >
            {editing ? "Save" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
