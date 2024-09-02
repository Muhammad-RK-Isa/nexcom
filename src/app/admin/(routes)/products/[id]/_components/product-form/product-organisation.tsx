"use client"

import { useFormContext } from "react-hook-form"

import type { UpdateProductInput } from "~/types"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import KeywordsInput from "~/components/keywords-input"

const ProductOrganisationForm = () => {
  const form = useFormContext<UpdateProductInput>()

  return (
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
  )
}

export default ProductOrganisationForm
