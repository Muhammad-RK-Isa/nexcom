import * as React from "react"
import { toast } from "sonner"
import type { UploadFilesOptions } from "uploadthing/types"

import type { Image } from "~/types"
import { getErrorMessage } from "~/lib/handle-error"
import { uploadFiles } from "~/lib/uploadthing"
import { type OurFileRouter } from "~/app/api/uploadthing/core"
import { api } from "~/trpc/react"

interface UseUploadFileProps
  extends Pick<
    UploadFilesOptions<OurFileRouter, keyof OurFileRouter>,
    "headers" | "onUploadBegin" | "onUploadProgress" | "skipPolling"
  > {
  defaultUploadedFiles?: Image[]
}

export function useUploadFile(
  endpoint: keyof OurFileRouter,
  { defaultUploadedFiles = [], ...props }: UseUploadFileProps = {}
) {
  const [uploadedFiles, setUploadedFiles] =
    React.useState<Image[]>(defaultUploadedFiles)
  const [progresses, setProgresses] = React.useState<Record<string, number>>({})
  const [isUploading, setIsUploading] = React.useState(false)

  const { mutate: insertImages } = api.images.insertImages.useMutation()

  async function uploadThings(files: File[]) {
    setIsUploading(true)
    try {
      const res = await uploadFiles(endpoint, {
        ...props,
        files,
        onUploadProgress: ({ file, progress }) => {
          setProgresses((prev) => {
            return {
              ...prev,
              [file]: progress,
            }
          })
        },
      })

      const formattedRes: Image[] = res.map((file) => ({
        id: file.key,
        name: file.name,
        url: file.url,
      }))

      // Insert the uploaded images to the database
      insertImages(formattedRes)

      setUploadedFiles((prev) =>
        prev ? [...prev, ...formattedRes] : formattedRes
      )
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setProgresses({})
      setIsUploading(false)
    }
  }

  return {
    uploadedFiles,
    progresses,
    uploadFiles: uploadThings,
    isUploading,
    setUploadedFiles,
  }
}
