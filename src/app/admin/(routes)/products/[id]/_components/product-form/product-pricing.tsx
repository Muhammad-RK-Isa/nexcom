import { useFormContext } from "react-hook-form"

import type { UpdateProductInput } from "~/types"
import { cn } from "~/lib/utils"
import { buttonVariants } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
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

const ProductPricingForm = () => {
  const form = useFormContext<UpdateProductInput>()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex w-full flex-col justify-between gap-6 md:flex-row md:items-start">
          <FormField
            name="price"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2.5 space-y-0">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <div className="relative h-9">
                    <span className="absolute left-0 top-0 grid size-9 place-content-center text-sm">
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
                        })
                      )}
                    >
                      ?
                    </HoverCardTrigger>
                    <HoverCardContent className="text-xs">
                      MRP stands for Maximum Retail Price. The &quot;Price&quot;
                      will be compared with this &quot;MRP&quot;.
                    </HoverCardContent>
                  </HoverCard>
                </FormLabel>
                <FormControl>
                  <div className="relative h-9">
                    <span className="absolute left-0 top-0 grid size-9 place-content-center text-sm">
                      {"৳"}
                    </span>
                    <Input
                      {...field}
                      value={field.value ?? undefined}
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
  )
}

export default ProductPricingForm
