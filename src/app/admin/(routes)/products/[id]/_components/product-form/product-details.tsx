import React from "react"
import { useFormContext } from "react-hook-form"

import type { UpdateProductInput } from "~/types"
import { slugify } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { ImageSelectModal } from "~/components/image-select-modal"
import Images from "~/components/images"

const ProductDetailsForm = () => {
  const [isImageModalOpen, setIsImageModalOpen] = React.useState(false)
  const form = useFormContext<UpdateProductInput>()
  return (
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
                      const value = e.target.value
                      field.onChange(value)
                      form.setValue("slug", slugify(value))
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
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <div className="space-y-6">
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => setIsImageModalOpen(true)}
                      className="w-full"
                    >
                      Select Images
                    </Button>
                  </FormControl>
                  <FormMessage />
                  {field.value && field.value.length > 0 ? (
                    <Images files={field.value} />
                  ) : null}
                  <ImageSelectModal
                    value={field.value ?? []}
                    open={isImageModalOpen}
                    onOpenChange={setIsImageModalOpen}
                    onValueChange={field.onChange}
                  />
                </FormItem>
              </div>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductDetailsForm
