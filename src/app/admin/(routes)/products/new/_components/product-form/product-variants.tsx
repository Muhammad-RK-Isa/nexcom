import React from "react"
import Image from "next/image"
import { useFormContext } from "react-hook-form"

import type { UpdateProductInput } from "~/types"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
// import ProductVariantFormModal from "./product-variant-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Label } from "~/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Icons } from "~/components/icons"
import { ImageSelectModal } from "~/components/image-select-modal"

import { ProductOptions } from "./product-options"

export const ProductVariantsForm = () => {
  const form = useFormContext<UpdateProductInput>()
  const { variants, options } = form.watch()

  const [isVariantModalOpen, setIsVariantModalOpen] = React.useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Variants</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <ProductOptions />
          <div className="grid space-y-3.5">
            <Label>Product Variants {`(${variants.length})`}</Label>
            <Button
              type="button"
              variant={"link"}
              className="border bg-muted/40 py-6 active:scale-100"
              disabled={!options.length}
              onClick={() => options.length && setIsVariantModalOpen(true)}
            >
              <Icons.plus className="mr-2 size-4" />
              Add Variant
            </Button>
            {/* <ProductVariantFormModal
              open={isVariantModalOpen}
              onOpenChange={setIsVariantModalOpen}
              options={options}
              variantIdx={}
            /> */}
          </div>
          {Boolean(variants.length) ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Inventory</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="border-b">
                {variants.map(({ title, price, inventoryQuantity, image }) => (
                  <TableRow key={title}>
                    <TableCell>
                      {image?.url ? (
                        <div className="relative size-6 border border-dashed transition-colors hover:border-blue-500">
                          <Image
                            src={image?.url}
                            alt={title}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <Icons.image className="size-6 opacity-80" />
                      )}
                    </TableCell>
                    <TableCell>{title}</TableCell>
                    <TableCell className="font-medium">{price}</TableCell>
                    <TableCell className="text-right">
                      {inventoryQuantity}
                    </TableCell>
                    <TableCell align="right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-sm"
                          >
                            <Icons.ellipsisHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Icons.edit className="mr-2 size-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Icons.trash className="mr-2 size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
