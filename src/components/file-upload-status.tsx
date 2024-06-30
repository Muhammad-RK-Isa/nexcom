import React from "react"
import { motion } from "framer-motion"

import type { Image } from "~/types"
import { cn } from "~/lib/utils"

import { Icons } from "./icons"
import { FileCard } from "./image-uploader"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"

interface ploadStatusProps {
  files: File[]
  setFiles: (value: File[]) => void
  onUnMount: () => void
  className?: string
  progresses?: Record<string, number>
  isUploadFinished?: boolean
  uploadedFiles?: Image[]
}

export const FileUploadStatus: React.FC<ploadStatusProps> = ({
  files,
  onUnMount,
  className,
  setFiles,
  progresses,
  isUploadFinished,
  uploadedFiles,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false)

  const onRemove = (index: number) => {
    if (!files) return
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
  }

  let remainingFiles: number = 0

  for (const key in progresses) {
    if (Number(progresses[key]) < 100) {
      remainingFiles++
    }
  }

  React.useEffect(() => {
    if (isUploadFinished) {
      setIsExpanded(false)
      setFiles([])
    }
  }, [isUploadFinished, setFiles])

  return (
    <div className={cn(className)}>
      <motion.div
        layout
        transition={{
          duration: 0.3,
          ease: [0.42, 0, 0.58, 1],
          bounce: 0.3,
          damping: 10,
        }}
        animate={{ height: isExpanded ? 384 : 56 }}
        className={cn(
          "w-80 overflow-hidden rounded-md border bg-card shadow-lg drop-shadow-lg backdrop-blur-sm dark:border-none",
          { "cursor-default": isExpanded }
        )}
      >
        <div className="flex flex-col">
          <div
            className={cn("flex h-14 items-center justify-between gap-2 px-2", {
              "border-b py-2": isExpanded,
            })}
          >
            {isUploadFinished ? (
              <>
                <div className="ml-2 flex items-center space-x-2">
                  <Icons.checkCircle className="size-4" />
                  <span className="text-sm font-medium">
                    {uploadedFiles?.length ?? 0} files uploaded
                  </span>
                </div>
                <Button variant={"ghost"} size={"icon"} onClick={onUnMount}>
                  <Icons.multiply className="size-5" />
                </Button>
              </>
            ) : (
              <>
                <div className="flex flex-col p-2">
                  <span className="text-sm font-medium">Uploading</span>
                  <span className="text-xs">{remainingFiles} remaining</span>
                </div>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <Icons.chevronDown className="size-5" />
                  ) : (
                    <Icons.chevronUp className="size-5" />
                  )}
                </Button>
              </>
            )}
          </div>
          {isExpanded ? (
            <ScrollArea className="h-96 w-full p-3">
              <div className="h-full space-y-4">
                {files?.map((file, index) => (
                  <FileCard
                    key={index}
                    file={file}
                    onRemove={() => onRemove(index)}
                    progress={progresses?.[file.name]}
                  />
                ))}
              </div>
            </ScrollArea>
          ) : null}
        </div>
      </motion.div>
    </div>
  )
}
