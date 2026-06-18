import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: string | number): string {
  const num = Number(price);
  if (isNaN(num)) return price.toString();
  return num.toLocaleString('fr-DZ', { minimumFractionDigits: 0 }).replace(/,/g, ' ') + ' DZD';
}
