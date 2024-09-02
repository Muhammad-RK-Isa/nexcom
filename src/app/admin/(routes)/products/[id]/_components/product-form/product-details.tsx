import React from "react"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"

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
import Editor from "~/components/editor"
import { Icons } from "~/components/icons"
import { ImageSelectModal } from "~/components/image/image-select-modal"
import Images from "~/components/image/images"

const ProductDetailsForm = () => {
  const form = useFormContext<UpdateProductInput>()
  const { title } = form.watch()

  const [isImageModalOpen, setIsImageModalOpen] = React.useState(false)
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
                    onChange={field.onChange}
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
                <div className="-mb-1 flex items-center justify-between">
                  <FormLabel>Slug</FormLabel>
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => {
                      if (Boolean(!title)) {
                        toast.info("Please enter a title first")
                        return
                      }
                      field.onChange(slugify(title))
                    }}
                  >
                    <Icons.sparkles className="mr-1.5 size-3 text-muted-foreground" />
                    Auto generate
                  </Button>
                </div>
                <FormControl>
                  <Input {...field} autoCorrect="off" spellCheck="false" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Detailed description</FormLabel>
                <FormControl>
                  <Editor {...field} initialValue={field.value ?? {}} />
                </FormControl>
                <FormMessage />
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
