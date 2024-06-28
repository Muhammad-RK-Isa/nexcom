import React, { useState } from "react"

import { Icons } from "~/components/icons"

interface KeywordsInputProps {
  initialKeywords?: string[]
  onKeywordsChange: (keywords: string[]) => void
  placeholder?: string
}

const KeywordsInput: React.FC<KeywordsInputProps> = ({
  initialKeywords = [],
  onKeywordsChange,
  placeholder,
}) => {
  const [keywords, setKeywords] = useState<string[]>(initialKeywords)
  const [inputValue, setInputValue] = useState<string>("")

  // Handles adding new keyword on Enter or comma press, and keyword removal on Backspace
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      (event.key === "Enter" || event.key === ",") &&
      inputValue.trim() !== ""
    ) {
      event.preventDefault()
      const newKeywords = [...keywords, inputValue.trim()]
      setKeywords(newKeywords)
      onKeywordsChange(newKeywords)
      setInputValue("")
    } else if (event.key === "Backspace" && inputValue === "") {
      event.preventDefault()
      const newKeywords = keywords.slice(0, -1)
      setKeywords(newKeywords)
      onKeywordsChange(newKeywords)
    }
  }

  // Handles pasting keywords separated by commas, new lines, or tabs
  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const paste = event.clipboardData.getData("text")
    const keywordsToAdd = paste
      .split(/[\n\t,]+/)
      .map((keyword) => keyword.trim())
      .filter(Boolean)
    if (keywordsToAdd.length) {
      const newKeywords = [...keywords, ...keywordsToAdd]
      setKeywords(newKeywords)
      onKeywordsChange(newKeywords)
      setInputValue("")
    }
  }

  // Updates the inputValue state as the user types
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }
  // Adds the keyword when the input loses focus, if there's a keyword to add
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (inputValue.trim() !== "" && event.relatedTarget?.tagName !== "BUTTON") {
      const newKeywords = [...keywords, inputValue.trim()]
      setKeywords(newKeywords)
      onKeywordsChange(newKeywords)
      setInputValue("")
    }
  }

  // Removes a keyword from the list
  const removeKeyword = (indexToRemove: number) => {
    const newKeywords = keywords.filter((_, index) => index !== indexToRemove)
    setKeywords(newKeywords)
    onKeywordsChange(newKeywords)
  }

  return (
    <div className="flex min-h-9 w-full flex-wrap items-center rounded-md border border-input p-2 text-sm shadow-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-ring">
      <div
        className="flex w-full flex-wrap gap-1.5 overflow-y-auto"
        style={{ maxHeight: "300px" }}
      >
        {keywords.map((keyword, index) => (
          <button
            type="button"
            key={index}
            onClick={() => removeKeyword(index)}
            className="flex items-center rounded-sm border border-input bg-muted/40 px-2 py-1 text-xs"
          >
            {keyword}
            <Icons.multiply className="ml-2 size-3.5 cursor-pointer text-muted-foreground" />
          </button>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={(e) => handleBlur(e)}
          className="peer mx-1 flex-1 bg-transparent text-sm outline-none"
          placeholder={placeholder ?? "Type keyword and press Enter..."}
        />
      </div>
    </div>
  )
}

export default KeywordsInput
