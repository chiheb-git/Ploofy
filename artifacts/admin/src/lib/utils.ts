import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: string | number | undefined | null): string {
  if (price === undefined || price === null) return "0 DZD";
  const num = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(num)) return typeof price === "string" ? price : "0 DZD";
  
  return num.toLocaleString('fr-DZ', { minimumFractionDigits: 0 }).replace(/\u202F/g, ' ').replace(/,/g, ' ') + ' DZD';
}
