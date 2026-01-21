import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitizeString(input: string) {
  const trimmed = input.trim();
  const escaped = trimmed
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  return escaped;
}

export function sanitizeNumber(input: string | number) {
  const num = typeof input === 'number' ? input : Number(String(input).replace(/[^\d.]/g, ''));
  if (!isFinite(num) || num < 0) return 0;
  return Math.round(num * 100) / 100;
}
