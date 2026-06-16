import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getURL() {
  if (process.env.NODE_ENV === 'production') {
    return 'https://clearpath-ai-five.vercel.app'
  }
  return 'http://localhost:3000'
}
