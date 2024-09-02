import React from "react"

import type { PublicProduct } from "~/types"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"

interface OptionSelectProps {
  options: PublicProduct["options"]
  selectedOptions: Record<string, string>
  onValueChange: (optionId: string, value: string) => void
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  options,
  onValueChange,
  selectedOptions,
}) => {
  return (
    <div className="flex flex-col space-y-4">
      {options
        .sort((a, b) => a.rank - b.rank)
        .map((option, idx) => (
          <div key={idx} className="flex flex-col space-y-2">
            <h3 className="text-sm font-medium">{option.title}</h3>
            <div className="flex flex-wrap gap-2">
              {option.values.map((v) => (
                <Button
                  key={v.id}
                  className={cn(
                    "h-8 w-max border text-xs shadow-none lg:h-10 lg:text-sm",
                    selectedOptions[option.id] === v.value
                      ? "border-primary"
                      : "border-border"
                  )}
                  variant={
                    selectedOptions[option.id] === v.value
                      ? "default"
                      : "outline"
                  }
                  onClick={() => onValueChange(option.id, v.value)}
                >
                  {v.value}
                </Button>
              ))}
            </div>
          </div>
        ))}
    </div>
  )
}

export default OptionSelect
