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

export function getBase(): string {
  const pathName = window.location.pathname

  if (inIframe()) {
    if (pathName.includes('/dip/')) {
      return '/dip/api/webapps/view'
    }
    const backendMatch = pathName.match(
      /(\/web-apps-backends\/[a-zA-Z0-9\-_]*\/[a-zA-Z0-9\-_]*)/
    )
    if (backendMatch) return backendMatch[1]
    return pathName.replace(/\/fetch\/.*$/, '') || pathName
  }

  let location = pathName.match(
    /(\/public-webapps\/[a-zA-Z0-9\-_]*\/[a-zA-Z0-9\-_]*).*/
  )
  if (location) return location[1]

  location = pathName.match(/(\/webapps\/[a-zA-Z0-9\-_]*\/[a-zA-Z0-9\-_]*).*/)
  return location ? location[1] : ''
}
