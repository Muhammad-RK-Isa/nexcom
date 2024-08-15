"use client"

import * as React from "react"

import { dataTableConfig, type DataTableConfig } from "~/config/data-table"
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group"

type FeatureFlagValue = DataTableConfig["featureFlags"][number]["value"]

interface ProductsTableContextProps {
  featureFlags: FeatureFlagValue[]
  setFeatureFlags: React.Dispatch<React.SetStateAction<FeatureFlagValue[]>>
}

const ProductsTableContext = React.createContext<ProductsTableContextProps>({
  featureFlags: [],
  setFeatureFlags: () => {},
})

export function useProductsTable() {
  const context = React.useContext(ProductsTableContext)
  if (!context) {
    throw new Error(
      "useProductsTable must be used within a ProductsTableProvider"
    )
  }
  return context
}

export function ProductsTableProvider({ children }: React.PropsWithChildren) {
  const [featureFlags, setFeatureFlags] = React.useState<FeatureFlagValue[]>([])

  return (
    <ProductsTableContext.Provider
      value={{
        featureFlags,
        setFeatureFlags,
      }}
    >
      <div className="mb-2 w-full overflow-x-auto">
        <ToggleGroup
          type="multiple"
          variant="primary"
          size="sm"
          value={featureFlags}
          onValueChange={(value: FeatureFlagValue[]) => setFeatureFlags(value)}
          className="w-fit gap-2.5"
        >
          {dataTableConfig.featureFlags.map((flag) => (
            <React.Fragment key={flag.value}>
              <ToggleGroupItem
                value={flag.value}
                className="whitespace-nowrap text-xs"
              >
                <flag.icon
                  className="mr-2 size-3.5 shrink-0"
                  aria-hidden="true"
                />
                {flag.label}
              </ToggleGroupItem>
            </React.Fragment>
          ))}
        </ToggleGroup>
      </div>
      {children}
    </ProductsTableContext.Provider>
  )
}
