import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function inIframe(): boolean {
  try {
    return window.self !== window.top
  } catch {
    return true
  }
}
