import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatiert ein Datum in deutsches Format.
 */
export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(price)
} 