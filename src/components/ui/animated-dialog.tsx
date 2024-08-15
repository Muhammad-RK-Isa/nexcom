"use client"

import React, {
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  AnimatePresence,
  motion,
  MotionConfig,
  type Transition,
  type Variant,
} from "framer-motion"
import { createPortal } from "react-dom"

import useClickOutside from "~/lib/hooks/use-click-outside"
import { cn } from "~/lib/utils"
import { Icons } from "~/components/icons"

interface AnimatedDialogContextType {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  uniqueId: string
  triggerRef: React.RefObject<HTMLDivElement>
}

const AnimatedDialogContext =
  React.createContext<AnimatedDialogContextType | null>(null)

function useAnimatedDialog() {
  const context = useContext(AnimatedDialogContext)
  if (!context) {
    throw new Error(
      "useAnimatedDialog must be used within a AnimatedDialogProvider"
    )
  }
  return context
}

type AnimatedDialogProviderProps = {
  children: React.ReactNode
  transition?: Transition
}

function AnimatedDialogProvider({
  children,
  transition,
}: AnimatedDialogProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const uniqueId = useId()
  const triggerRef = useRef<HTMLDivElement>(null)

  const contextValue = useMemo(
    () => ({ isOpen, setIsOpen, uniqueId, triggerRef }),
    [isOpen, uniqueId]
  )

  return (
    <AnimatedDialogContext.Provider value={contextValue}>
      <MotionConfig transition={transition}>{children}</MotionConfig>
    </AnimatedDialogContext.Provider>
  )
}

type AnimatedDialogProps = {
  children: React.ReactNode
  transition?: Transition
}

function AnimatedDialog({ children, transition }: AnimatedDialogProps) {
  return (
    <AnimatedDialogProvider>
      <MotionConfig transition={transition}>{children}</MotionConfig>
    </AnimatedDialogProvider>
  )
}

type AnimatedDialogTriggerProps = {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  triggerRef?: React.RefObject<HTMLDivElement>
}

function AnimatedDialogTrigger({
  children,
  className,
  style,
  triggerRef,
}: AnimatedDialogTriggerProps) {
  const { setIsOpen, isOpen, uniqueId } = useAnimatedDialog()

  const handleClick = useCallback(() => {
    setIsOpen(!isOpen)
  }, [isOpen, setIsOpen])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        setIsOpen(!isOpen)
      }
    },
    [isOpen, setIsOpen]
  )

  return (
    <motion.div
      ref={triggerRef}
      layoutId={`dialog-${uniqueId}`}
      className={cn("relative cursor-pointer", className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={style}
      role="button"
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-controls={`Animateddialog-content-${uniqueId}`}
    >
      {children}
    </motion.div>
  )
}

type AnimatedDialogContent = {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

function AnimatedDialogContent({
  children,
  className,
  style,
}: AnimatedDialogContent) {
  const { setIsOpen, isOpen, uniqueId, triggerRef } = useAnimatedDialog()
  const containerRef = useRef<HTMLDivElement>(null)
  const [firstFocusableElement, setFirstFocusableElement] =
    useState<HTMLElement | null>(null)
  const [lastFocusableElement, setLastFocusableElement] =
    useState<HTMLElement | null>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
      if (event.key === "Tab") {
        if (!firstFocusableElement || !lastFocusableElement) return

        if (event.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            event.preventDefault()
            lastFocusableElement.focus()
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            event.preventDefault()
            firstFocusableElement.focus()
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [setIsOpen, firstFocusableElement, lastFocusableElement])

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden")
      const focusableElements = containerRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusableElements && focusableElements.length > 0) {
        setFirstFocusableElement(focusableElements[0] as HTMLElement)
        setLastFocusableElement(
          focusableElements[focusableElements.length - 1] as HTMLElement
        )
        ;(focusableElements[0] as HTMLElement).focus()
      }
    } else {
      document.body.classList.remove("overflow-hidden")
      triggerRef.current?.focus()
    }
  }, [isOpen, triggerRef])

  useClickOutside(containerRef, () => {
    if (isOpen) {
      setIsOpen(false)
    }
  })

  return (
    <motion.div
      ref={containerRef}
      layoutId={`Animateddialog-${uniqueId}`}
      className={cn("overflow-hidden", className)}
      style={style}
      role="Animateddialog"
      aria-modal="true"
      aria-labelledby={`Animateddialog-title-${uniqueId}`}
      aria-describedby={`Animateddialog-description-${uniqueId}`}
    >
      {children}
    </motion.div>
  )
}

type AnimatedDialogContainerProps = {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

function AnimatedDialogContainer({ children }: AnimatedDialogContainerProps) {
  const { isOpen, uniqueId } = useAnimatedDialog()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence initial={false} mode="sync">
      {isOpen && (
        <>
          <motion.div
            key={`backdrop-${uniqueId}`}
            className="fixed inset-0 h-full w-full bg-white/40 backdrop-blur-sm dark:bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {children}
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

type AnimatedDialogTitleProps = {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

function AnimatedDialogTitle({
  children,
  className,
  style,
}: AnimatedDialogTitleProps) {
  const { uniqueId } = useAnimatedDialog()

  return (
    <motion.div
      layoutId={`Animateddialog-title-container-${uniqueId}`}
      className={className}
      style={style}
      layout
    >
      {children}
    </motion.div>
  )
}

type AnimatedDialogSubtitleProps = {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

function AnimatedDialogSubtitle({
  children,
  className,
  style,
}: AnimatedDialogSubtitleProps) {
  const { uniqueId } = useAnimatedDialog()

  return (
    <motion.div
      layoutId={`Animateddialog-subtitle-container-${uniqueId}`}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}

type AnimatedDialogDescriptionProps = {
  children: React.ReactNode
  className?: string
  disableLayoutAnimation?: boolean
  variants?: {
    initial: Variant
    animate: Variant
    exit: Variant
  }
}

function AnimatedDialogDescription({
  children,
  className,
  variants,
  disableLayoutAnimation,
}: AnimatedDialogDescriptionProps) {
  const { uniqueId } = useAnimatedDialog()

  return (
    <motion.div
      key={`Animateddialog-description-${uniqueId}`}
      layoutId={
        disableLayoutAnimation
          ? undefined
          : `Animateddialog-description-content-${uniqueId}`
      }
      variants={variants}
      className={className}
      initial="initial"
      animate="animate"
      exit="exit"
      id={`Animateddialog-description-${uniqueId}`}
    >
      {children}
    </motion.div>
  )
}

type AnimatedDialogImageProps = {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
}

function AnimatedDialogImage({
  src,
  alt,
  className,
  style,
}: AnimatedDialogImageProps) {
  const { uniqueId } = useAnimatedDialog()

  return (
    <motion.img
      src={src}
      alt={alt}
      className={cn(className)}
      layoutId={`Animateddialog-img-${uniqueId}`}
      style={style}
    />
  )
}

type AnimatedDialogCloseProps = {
  children?: React.ReactNode
  className?: string
  variants?: {
    initial: Variant
    animate: Variant
    exit: Variant
  }
}

function AnimatedDialogClose({
  children,
  className,
  variants,
}: AnimatedDialogCloseProps) {
  const { setIsOpen, uniqueId } = useAnimatedDialog()

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])

  return (
    <motion.button
      onClick={handleClose}
      type="button"
      aria-label="Close Animateddialog"
      key={`Animateddialog-close-${uniqueId}`}
      className={cn("absolute right-6 top-6", className)}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
    >
      {children || <Icons.multiply className="size-6" />}
    </motion.button>
  )
}

export {
  AnimatedDialog,
  AnimatedDialogTrigger,
  AnimatedDialogContainer,
  AnimatedDialogContent,
  AnimatedDialogClose,
  AnimatedDialogTitle,
  AnimatedDialogSubtitle,
  AnimatedDialogDescription,
  AnimatedDialogImage,
}
