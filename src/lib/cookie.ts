import { createIsomorphicFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"

type SameSite = "Lax" | "None" | "Strict"

export interface CookieOptions {
  httpOnly?: boolean
  maxAge?: number
  path?: string
  sameSite?: SameSite
  secure?: boolean
}

const ONE_YEAR_IN_SECONDS = 31_536_000
const DEFAULT_PATH = "/"
const DEFAULT_SAME_SITE: SameSite = "Lax"

const ENTRY_DELIMITER = ";"
const ATTRIBUTE_DELIMITER = `${ENTRY_DELIMITER} `
const KEY_VALUE_DELIMITER = "="

const KEY_VALUE_DELIMITER_LENGTH = KEY_VALUE_DELIMITER.length

const ENTRY_START_INDEX = 0

const decodeCookieValue = (value: string): string | undefined => {
  try {
    return decodeURIComponent(value)
  } catch {
    return undefined
  }
}

export const readCookie = ({ header, name }: { header: string | null | undefined; name: string }): string | undefined => {
  for (const entry of header?.split(ENTRY_DELIMITER) ?? []) {
    const separator = entry.indexOf(KEY_VALUE_DELIMITER)

    if (separator > ENTRY_START_INDEX && entry.slice(ENTRY_START_INDEX, separator).trim() === name) {
      return decodeCookieValue(entry.slice(separator + KEY_VALUE_DELIMITER_LENGTH).trim())
    }
  }

  return undefined
}

export const serializeCookie = ({ name, options = {}, value }: { name: string; options?: CookieOptions; value: string }): string => {
  const { httpOnly = false, maxAge = ONE_YEAR_IN_SECONDS, path = DEFAULT_PATH, sameSite = DEFAULT_SAME_SITE } = options

  const secure = sameSite === "None" || (options.secure ?? import.meta.env.PROD)
  const attributes = [`${name}=${encodeURIComponent(value)}`, `Path=${path}`, `Max-Age=${maxAge}`, `SameSite=${sameSite}`]

  if (secure) {
    attributes.push("Secure")
  }

  if (httpOnly) {
    attributes.push("HttpOnly")
  }

  return attributes.join(ATTRIBUTE_DELIMITER)
}

export const getCookie = createIsomorphicFn()
  .server((name: string) => readCookie({ header: getRequest().headers.get("cookie"), name }))
  .client((name: string) => readCookie({ header: globalThis.document.cookie, name }))
