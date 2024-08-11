"use client"

import * as React from "react"

import { useMediaQuery } from "~/lib/hooks/use-media-query"
import { cn } from "~/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog"
import { Button } from "~/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer"

export const ResponsiveAlertDialog = (props: {
  trigger: React.ReactNode | string
  title?: React.ReactNode
  description?: React.ReactNode
  footer?: React.ReactNode
  action?: React.ReactNode
  cancel?: React.ReactNode
  contentClassName?: string
}) => {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 640px)")

  return isDesktop ? (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild={typeof props.trigger !== "string"}>
        {props.trigger}
      </AlertDialogTrigger>
      <AlertDialogContent className={cn("max-w-md", props.contentClassName)}>
        <AlertDialogHeader>
          <AlertDialogTitle>{props.title}</AlertDialogTitle>
          <AlertDialogDescription>{props.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {props.footer}
          {props.action ? (
            <AlertDialogAction>{props.action}</AlertDialogAction>
          ) : null}
          {props.cancel ? (
            <AlertDialogCancel>{props.cancel}</AlertDialogCancel>
          ) : null}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ) : (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild={typeof props.trigger !== "string"}>
        {props.trigger}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{props.title}</DrawerTitle>
          <DrawerDescription>{props.description}</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="pt-2">
          {props.footer ? (
            props.footer
          ) : (
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
