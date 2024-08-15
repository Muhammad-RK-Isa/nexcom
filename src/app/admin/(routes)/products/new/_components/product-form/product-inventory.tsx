import { useFormContext } from "react-hook-form"

import type { CreateProductInput } from "~/types"
import { cn } from "~/lib/utils"
import { buttonVariants } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Checkbox } from "~/components/ui/checkbox"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card"
import { Input } from "~/components/ui/input"

const ProductInventoryForm = () => {
  const form = useFormContext<CreateProductInput>()
  return (
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
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border bg-background pl-4 shadow-sm transition-all hover:bg-accent hover:text-accent-foreground">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(v) => {
                      field.onChange(v)
                      if (Boolean(!v)) {
                        form.setValue("inventoryQuantity", 0)
                        form.setValue("allowBackorder", false)
                      }
                    }}
                  />
                </FormControl>
                <FormLabel className="flex w-full cursor-pointer items-center p-4 pl-0">
                  Manage inventory
                  <FormMessage />
                  <HoverCard openDelay={100}>
                    <HoverCardTrigger
                      className={cn(
                        buttonVariants({
                          variant: "secondary",
                          size: "icon",
                          className:
                            "ml-auto size-4 rounded-full text-xs text-muted-foreground",
                        })
                      )}
                    >
                      {"?"}
                    </HoverCardTrigger>
                    <HoverCardContent className="text-xs">
                      If checked the inventory will be managed automatically
                      when a order is fulfilled or cancelled.
                    </HoverCardContent>
                  </HoverCard>
                </FormLabel>
              </FormItem>
            )}
          />
          {form.getValues("manageInventory") ? (
            <>
              <FormField
                name="allowBackorder"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border pl-4 shadow-sm transition-all hover:bg-accent hover:text-accent-foreground">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="w-full cursor-pointer p-4 pl-0">
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
            </>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductInventoryForm
