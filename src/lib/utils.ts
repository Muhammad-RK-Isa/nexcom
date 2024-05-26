import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { v1 as uuidv1, v4 as uuidv4 } from "uuid";
import * as z from "zod";

import { env } from "~/env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateOrderId() {
  const timestamp = Date.now();
  const timeString = timestamp.toString().slice(-10);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const uuid = uuidv1({ msecs: timestamp });

  return `od${uuid.slice(0, 8).toUpperCase()}-${timeString}`;
}

export function generateId({ prefix }: { prefix?: string } = {}) {
  return `${prefix ? prefix + "_" : ""}${uuidv4()}`;
}

export function standardizeBDPhoneNumber(phoneNumber: string): string {
  return (
    "+" +
    (phoneNumber.replace(/\D/g, "").startsWith("88")
      ? phoneNumber.replace(/\D/g, "")
      : "880" + phoneNumber.replace(/\D/g, "").replace(/^[0]/, ""))
  );
}

export function formatAddress({
  division,
  district,
  area,
  street_address,
  zip_code,
}: {
  division: string;
  district: string;
  area: string;
  street_address: string;
  zip_code?: number;
}) {
  let full_address = `${street_address}, ${area}, ${district}, ${division}`;
  full_address += zip_code ? `, ${zip_code}` : "";
  return full_address;
}

export function formatPrice(
  price: number | string,
  options: {
    currency?: "USD" | "EUR" | "BDT";
    notation?: Intl.NumberFormatOptions["notation"];
    currencyDisplay?: Intl.NumberFormatOptions["currencyDisplay"];
    maximumFractionDigits?: Intl.NumberFormatOptions["maximumFractionDigits"];
  } = {},
) {
  const {
    currency = "BDT",
    notation = "standard",
    currencyDisplay = "narrowSymbol",
    maximumFractionDigits = 0,
  } = options;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation,
    currencyDisplay,
    maximumFractionDigits,
  }).format(Number(price));
}

export function formatNumber(
  number: number | string,
  options: {
    decimals?: number;
    style?: Intl.NumberFormatOptions["style"];
    notation?: Intl.NumberFormatOptions["notation"];
  } = {},
) {
  const { decimals = 0, style = "decimal", notation = "standard" } = options;

  return new Intl.NumberFormat("en-US", {
    style,
    notation,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number(number));
}

export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  },
) {
  return new Intl.DateTimeFormat("en-US", {
    ...options,
  }).format(new Date(date));
}

export function formatBytes(
  bytes: number,
  decimals = 0,
  sizeType: "accurate" | "normal" = "normal",
) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
  }`;
}

export function formatId(id: number) {
  return `#${id.toString().padStart(4, "0")}`;
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/-$/, "");
}

export function unslugify(str: string) {
  return str.replace(/-/g, " ");
}

export function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(),
  );
}

export function toSentenceCase(str: string) {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

export function isArrayOfFile(files: unknown): files is File[] {
  const isArray = Array.isArray(files);
  if (!isArray) return false;
  return files.every((file) => file instanceof File);
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`;
}

export function handleErrorMessage(err: unknown) {
  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message;
    });
    return toast.error(errors.join("\n"));
  } else if (err instanceof Error) {
    return toast.error(err.message);
  } else if (typeof err === "string") {
    toast.error(err);
  } else {
    return toast.error("Something went wrong, please try again later.");
  }
}

export function isMacOs() {
  if (typeof window === "undefined") return false;

  return window.navigator.userAgent.includes("Mac");
}

export const onlyUnique = (value: unknown, index: number, self: unknown[]) =>
  self.indexOf(value) === index;

export function formatOptions(options: (string | undefined)[]): string {
  const filteredOptions = options.filter(
    (opt): opt is string => opt !== undefined,
  );
  const optionsLength = filteredOptions.length;

  if (optionsLength === 0) return "";
  if (optionsLength === 1) return `Select ${filteredOptions[0]}`;

  const lastOption = filteredOptions.pop();
  const formattedOptions = filteredOptions.join(", ");

  return `Select ${formattedOptions} and ${lastOption}`;
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
