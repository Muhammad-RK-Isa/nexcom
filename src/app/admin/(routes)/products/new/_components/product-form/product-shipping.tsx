import { useFormContext } from "react-hook-form"

import type { CreateProductInput } from "~/types"
import countries from "~/lib/countries.json"
import { sizeUnits, weightUnits } from "~/lib/validations/product"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

const ProductShippingForm = () => {
  const form = useFormContext<CreateProductInput>()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center space-x-2.5">
              <FormField
                name={"weight.value"}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight</FormLabel>
                    <Input {...field} type="number" inputMode="numeric" />
                  </FormItem>
                )}
              />
              <FormField
                name="weight.unit"
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
                        {Object.values(weightUnits.Values).map((u, idx) => (
                          <SelectItem key={idx} value={u}>
                            {u}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {form.getFieldState("weight").error ? (
              <p className="text-[0.8rem] font-medium text-destructive">
                {form.getFieldState("weight.value").error?.message}
                <br />
                {form.getFieldState("weight.unit").error?.message}
              </p>
            ) : null}
          </div>
          <div className="gap2.5 flex flex-col">
            <div className="flex items-center space-x-2.5">
              <FormField
                name="height.value"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height</FormLabel>
                    <Input
                      {...field}
                      type="number"
                      inputMode="numeric"
                      value={field.value ?? ""}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="height.unit"
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
                        {Object.values(sizeUnits.Values).map((u, idx) => (
                          <SelectItem key={idx} value={u}>
                            {u}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {form.getFieldState("height").error ? (
              <p className="text-[0.8rem] font-medium text-destructive">
                {form.getFieldState("height.value").error?.message}
                <br />
                {form.getFieldState("height.unit").error?.message}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center space-x-2.5">
              <FormField
                name="length.value"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Length</FormLabel>
                    <Input {...field} type="number" value={field.value ?? ""} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="length.unit"
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
                        {Object.values(sizeUnits.Values).map((u, idx) => (
                          <SelectItem key={idx} value={u}>
                            {u}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {form.getFieldState("length").error ? (
              <p className="text-[0.8rem] font-medium text-destructive">
                {form.getFieldState("length.value").error?.message}
                <br />
                {form.getFieldState("length.unit").error?.message}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center space-x-2.5">
              <FormField
                name="width.value"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Width</FormLabel>
                    <Input {...field} type="number" value={field.value ?? ""} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="width.unit"
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
                        {Object.values(sizeUnits.Values).map((u, idx) => (
                          <SelectItem key={idx} value={u}>
                            {u}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {form.getFieldState("width").error ? (
              <p className="text-[0.8rem] font-medium text-destructive">
                {form.getFieldState("width.value").error?.message}
                <br />
                {form.getFieldState("width.unit").error?.message}
              </p>
            ) : null}
          </div>
          <FormField
            name="originCountry"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country of Origin</FormLabel>
                <Select
                  {...field}
                  value={field.value ?? ""}
                  onValueChange={(v) => {
                    if (v === "n") {
                      field.onChange(undefined)
                      return
                    }
                    field.onChange(v)
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                  </FormControl>
                  <FormMessage />
                  <SelectContent>
                    <SelectItem value={"n"}>None</SelectItem>
                    {countries.map(({ name, code }) => (
                      <SelectItem key={code} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductShippingForm
