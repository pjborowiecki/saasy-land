type SameSite = "Lax" | "None" | "Strict"

const VALUE_OFFSET = 1

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

const decodeCookieValue = (value: string): string | undefined => {
  try {
    return decodeURIComponent(value)
  } catch {
    return undefined
  }
}

export const readCookie = ({ header, name }: { header: string | null | undefined; name: string }): string | undefined => {
  for (const entry of header?.split(";") ?? []) {
    const separator = entry.indexOf("=")

    if (separator > 0 && entry.slice(0, separator).trim() === name) {
      return decodeCookieValue(entry.slice(separator + VALUE_OFFSET).trim())
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

  return attributes.join("; ")
}
