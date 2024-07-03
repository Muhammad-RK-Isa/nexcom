import React from "react"

import type { CompleteProduct } from "~/types"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"

interface OptionSelectProps {
  options: CompleteProduct["options"]
  onValueChange: (optionId: string, value: string) => void
  selectedOptions: Record<string, string>
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
                  size="sm"
                  className={cn(
                    "w-max border",
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
