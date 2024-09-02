import * as React from "react"
import { useEditor } from "novel"

import { cn, getUrlFromString } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { Icons } from "~/components/icons"

interface LinkSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const LinkSelector = ({ open, onOpenChange }: LinkSelectorProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const { editor } = useEditor()

  // Autofocus on input by default
  React.useEffect(() => {
    inputRef.current && inputRef.current?.focus()
  })
  if (!editor) return null

  return (
    <Popover modal={true} open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="gap-2 rounded-none border-none"
        >
          <p className="text-base">↗</p>
          <p
            className={cn("underline decoration-stone-400 underline-offset-4", {
              "text-blue-500": editor.isActive("link"),
            })}
          >
            Link
          </p>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-full p-0" sideOffset={10}>
        <form
          className="flex items-center space-x-2 p-1"
          onSubmit={(e) => {
            e.preventDefault()
            const input = inputRef.current
            if (!input) return
            const url = getUrlFromString(input.value)
            if (url) {
              editor.chain().focus().setLink({ href: url }).run()
              onOpenChange(false)
            }
            e.stopPropagation()
          }}
        >
          <Input
            ref={inputRef}
            type="text"
            placeholder="Paste a link"
            className="h-8 w-min"
            defaultValue={editor.getAttributes("link").href || ""}
          />
          {editor.getAttributes("link").href ? (
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="size-8"
              onClick={() => {
                editor.chain().focus().unsetLink().run()
                onOpenChange(false)
              }}
            >
              <Icons.trash className="size-4" />
            </Button>
          ) : (
            <Button type="submit" size="icon" className="size-8">
              <Icons.check className="size-4" />
            </Button>
          )}
        </form>
      </PopoverContent>
    </Popover>
  )
}
