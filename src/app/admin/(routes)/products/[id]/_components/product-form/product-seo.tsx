"use client"

import { useFormContext } from "react-hook-form"
import { toast } from "sonner"

import type { UpdateProductInput } from "~/types"
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
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Icons } from "~/components/icons"

const ProductSEOForm = () => {
  const form = useFormContext<UpdateProductInput>()
  const { title, metaTitle, description } = form.watch()
  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <FormField
            name="metaTitle"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <div className="-mb-1 flex items-center justify-between">
                  <FormLabel>Meta Title</FormLabel>
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => {
                      if (Boolean(!title)) {
                        toast.info("Please enter a title first")
                        return
                      }
                      field.onChange(title)
                    }}
                  >
                    <Icons.sparkles className="mr-1.5 size-3 text-muted-foreground" />
                    Auto generate
                  </Button>
                </div>
                <FormControl>
                  <Input {...field} placeholder="Meta title" />
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
                <FormLabel>Meta Description</FormLabel>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Write a short description of the product"
                  rows={3}
                />
              </FormItem>
            )}
          />
          {metaTitle ? (
            <>
              <Label className="-mb-4">
                Overview of the product in the search results
              </Label>
              <div className="space-y-1 rounded-md border p-4 shadow-sm">
                <h2 className="text-lg font-medium text-blue-700 dark:text-blue-500 sm:text-xl">
                  {metaTitle}
                </h2>
                <p className="line-clamp-2 text-xs font-medium text-muted-foreground sm:text-sm">
                  {description}
                </p>
              </div>
            </>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductSEOForm
