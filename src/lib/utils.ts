import { generateHTML } from "@tiptap/core"
import { clsx, type ClassValue } from "clsx"
import { type JSONContent } from "novel"
import { type PostgresError } from "postgres"
import { twMerge } from "tailwind-merge"
import { v1 as uuidv1, v4 as uuidv4 } from "uuid"

import { env } from "~/env"

type Extensions = Parameters<typeof generateHTML>[1]

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateOrderId(): string {
  const timestamp = uuidv1()
  const randomPart = uuidv4()

  const timestampPart = timestamp.split("-")[0]
  const randomPartSegment = randomPart.split("-")[1]

  const orderId = `ORDER-${timestampPart}-${randomPartSegment}`.toUpperCase()
  return orderId
}

export function generateId({ prefix }: { prefix?: string } = {}) {
  return `${prefix ? prefix + "_" : ""}${uuidv4()}`
}

export function standardizeBDPhoneNumber(phoneNumber: string): string {
  return (
    "+" +
    (phoneNumber.replace(/\D/g, "").startsWith("88")
      ? phoneNumber.replace(/\D/g, "")
      : "880" + phoneNumber.replace(/\D/g, "").replace(/^[0]/, ""))
  )
}

export function formatAddress({
  division,
  district,
  area,
  street_address,
  zip_code,
}: {
  division: string
  district: string
  area: string
  street_address: string
  zip_code?: number
}) {
  let full_address = `${street_address}, ${area}, ${district}, ${division}`
  full_address += zip_code ? `, ${zip_code}` : ""
  return full_address
}

export function formatPrice(
  price: number | string,
  options: {
    currency?: "USD" | "EUR" | "BDT"
    notation?: Intl.NumberFormatOptions["notation"]
    currencyDisplay?: Intl.NumberFormatOptions["currencyDisplay"]
    maximumFractionDigits?: Intl.NumberFormatOptions["maximumFractionDigits"]
  } = {}
) {
  const {
    currency = "BDT",
    notation = "standard",
    currencyDisplay = "narrowSymbol",
    maximumFractionDigits = 0,
  } = options

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation,
    currencyDisplay,
    maximumFractionDigits,
  }).format(Number(price))
}

export function formatNumber(
  number: number | string,
  options: {
    decimals?: number
    style?: Intl.NumberFormatOptions["style"]
    notation?: Intl.NumberFormatOptions["notation"]
  } = {}
) {
  const { decimals = 0, style = "decimal", notation = "standard" } = options

  return new Intl.NumberFormat("en-US", {
    style,
    notation,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number(number))
}

export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  }
) {
  return new Intl.DateTimeFormat("en-US", {
    ...options,
  }).format(new Date(date))
}

export function formatBytes(
  bytes: number,
  decimals = 0,
  sizeType: "accurate" | "normal" = "normal"
) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"]
  if (bytes === 0) return "0 Byte"
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
  }`
}

export function formatId(id: number) {
  return `#${id.toString().padStart(4, "0")}`
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function unslugify(str: string) {
  return str.replace(/-/g, " ")
}

export function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  )
}

export function toSentenceCase(str: string) {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
}

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str
}

export function isArrayOfFile(files: unknown): files is File[] {
  const isArray = Array.isArray(files)
  if (!isArray) return false
  return files.every((file) => file instanceof File)
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`
}

export function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export function isMacOs() {
  if (typeof window === "undefined") return false

  return window.navigator.userAgent.includes("Mac")
}

export const onlyUnique = (value: unknown, index: number, self: unknown[]) =>
  self.indexOf(value) === index

export function formatOptions(options: (string | undefined)[]): string {
  const filteredOptions = options.filter(
    (opt): opt is string => opt !== undefined
  )
  const optionsLength = filteredOptions.length

  if (optionsLength === 0) return ""
  if (optionsLength === 1) return `Select ${filteredOptions[0]}`

  const lastOption = filteredOptions.pop()
  const formattedOptions = filteredOptions.join(", ")

  return `Select ${formattedOptions} and ${lastOption}`
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function isValidUrl(url: string) {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}
export function getUrlFromString(str: string) {
  if (isValidUrl(str)) return str
  try {
    if (str.includes(".") && !str.includes(" ")) {
      return new URL(`https://${str}`).toString()
    }
  } catch (e) {
    return null
  }
}

export function generateStaticHTML(
  content: JSONContent,
  extensions: Extensions
): string {
  const html = generateHTML(content, extensions)
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")

  // Disable checkboxes
  doc.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    const inputElement = checkbox as HTMLInputElement
    inputElement.setAttribute("disabled", "true")
  })

  return doc.body.innerHTML
}

export function isPostgresError(error: unknown): error is PostgresError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "severity" in error &&
    "detail" in error
  )
}

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
