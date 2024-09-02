"use client"

import * as React from "react"
import {
  EditorBubble,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorRoot,
  type JSONContent,
} from "novel"
import { handleCommandNavigation, ImageResizer } from "novel/extensions"

import { cn } from "~/lib/utils"

import { Separator } from "../ui/separator"
import { extensions as baseExtensions } from "./extensions"
import { LinkSelector } from "./selectors/link-selector"
import { NodeSelector } from "./selectors/node-selector"
import { TextButtons } from "./selectors/text-buttons"
import { slashCommand, suggestionItems } from "./slash-command"

const extensions = [...baseExtensions, slashCommand]

interface EditorProp {
  initialValue?: JSONContent
  onChange: (value: JSONContent) => void
  className?: string
}
const Editor: React.FC<EditorProp> = ({
  initialValue,
  onChange,
  className,
}) => {
  const [openNode, setOpenNode] = React.useState(false)
  const [openLink, setOpenLink] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)

  return (
    <EditorRoot>
      <EditorContent
        className={cn(
          "rounded-md border bg-background p-4",
          isFocused && "ring-1 ring-ring",
          className
        )}
        {...(initialValue && { initialContent: initialValue })}
        extensions={extensions}
        editorProps={{
          handleDOMEvents: {
            keydown: (_view, event) => handleCommandNavigation(event),
          },
          attributes: {
            class: `prose bg-background dark:prose-invert prose-headings:font-title font-default focus:outline-none`,
          },
        }}
        onUpdate={({ editor }) => {
          onChange(editor.getJSON())
        }}
        slotAfter={<ImageResizer />}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
          <EditorCommandEmpty className="px-2 text-muted-foreground">
            No results
          </EditorCommandEmpty>
          <EditorCommandList>
            {suggestionItems.map((item) => (
              <EditorCommandItem
                value={item.title}
                onCommand={(val) => item.command?.(val)}
                className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent`}
                key={item.title}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                  {item.icon}
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </EditorCommandItem>
            ))}
          </EditorCommandList>
        </EditorCommand>

        <EditorBubble
          tippyOptions={{
            placement: "top",
          }}
          className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl"
        >
          <Separator orientation="vertical" />
          <NodeSelector open={openNode} onOpenChange={setOpenNode} />
          <Separator orientation="vertical" />
          <LinkSelector open={openLink} onOpenChange={setOpenLink} />
          <Separator orientation="vertical" />
          <TextButtons />
        </EditorBubble>
      </EditorContent>
    </EditorRoot>
  )
}

export default Editor
