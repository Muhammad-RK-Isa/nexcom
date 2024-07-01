import React from "react"
import Image from "next/image"
import {
  TransformComponent,
  TransformWrapper,
  useControls,
} from "react-zoom-pan-pinch"

import type { CompleteProduct } from "~/types"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog"
import { Icons } from "~/components/icons"

interface SlideProps {
  selected: boolean
  image: CompleteProduct["images"][number]
}

const Slide: React.FC<SlideProps> = ({ image, selected }) => {
  // const { zoomIn, zoomOut, centerView } = useControls()

  return (
    <div className="relative min-w-0 shrink-0 grow-0 basis-full overflow-hidden">
      <Image
        src={image.url}
        alt={image.name}
        fill
        className={cn(
          "rounded-sm object-cover",
          selected && "border-primary/10"
        )}
      />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant={"secondary"}
            size={"icon"}
            className="absolute right-2 top-2 rounded-full"
          >
            <Icons.search className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="h-screen w-screen max-w-none bg-background/80 p-0 md:max-w-none lg:max-w-none">
          <div className="relative mx-auto my-auto aspect-square w-full max-w-4xl">
            <TransformWrapper>
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  <div className="absolute bottom-6 right-1/2 z-20 flex translate-x-1/2 items-center space-x-4">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => zoomIn()}
                      className="rounded-full"
                    >
                      <Icons.zoomIn className="size-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => resetTransform()}
                      className="rounded-full"
                    >
                      Center
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => zoomOut()}
                      className="rounded-full"
                    >
                      <Icons.zoomOut className="size-4" />
                    </Button>
                  </div>
                  <TransformComponent
                    wrapperStyle={{ height: "100%", width: "100%" }}
                    contentStyle={{ height: "100%", width: "100%" }}
                  >
                    <div className="relative aspect-square w-full">
                      <Image
                        src={image.url}
                        alt={image.name}
                        fill
                        className="size-full rounded-sm object-cover"
                      />
                    </div>
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Slide
