"use client"

import { useFormContext } from "react-hook-form"

import type { UpdateProductInput } from "~/types"
import { productStatuses } from "~/lib/validations/product"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

import { getStatusIcon } from "../../../_lib/utils"

const ProductStatusForm = () => {
  const form = useFormContext<UpdateProductInput>()

  return (
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
                  {Object.values(productStatuses.Values).map((status, idx) => {
                    const Icon = getStatusIcon(status)
                    return (
                      <SelectItem key={idx} value={status}>
                        <div className="flex items-center">
                          <Icon className="mr-2 size-4 text-muted-foreground" />
                          <span className="capitalize">{status}</span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}

export default ProductStatusForm
