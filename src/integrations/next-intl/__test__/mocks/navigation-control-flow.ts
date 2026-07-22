export const RedirectType = {
  push: "push",
  replace: "replace",
} as const

export type RedirectTypeValue = (typeof RedirectType)[keyof typeof RedirectType]

const REDIRECT_ERROR_CODE = "NEXT_REDIRECT"
const HTTP_ERROR_FALLBACK_ERROR_CODE = "NEXT_HTTP_ERROR_FALLBACK"

const RedirectStatusCode = {
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
} as const

type HttpAccessFallbackStatus = 401 | 403 | 404

type DigestError = Error & { digest: string }

function createRedirectError(url: string, type: RedirectTypeValue, statusCode: number): never {
  const error = new Error(REDIRECT_ERROR_CODE) as DigestError
  error.digest = `${REDIRECT_ERROR_CODE};${type};${url};${statusCode};`
  throw error
}

function createHttpAccessFallbackError(status: HttpAccessFallbackStatus): never {
  const digest = `${HTTP_ERROR_FALLBACK_ERROR_CODE};${status}`
  const error = new Error(digest) as DigestError
  error.digest = digest
  throw error
}

export function redirect(url: string, type: RedirectTypeValue = RedirectType.replace): never {
  createRedirectError(url, type, RedirectStatusCode.TemporaryRedirect)
}

export function permanentRedirect(url: string, type: RedirectTypeValue = RedirectType.replace): never {
  createRedirectError(url, type, RedirectStatusCode.PermanentRedirect)
}

export function notFound(): never {
  createHttpAccessFallbackError(404)
}

export function unauthorized(): never {
  createHttpAccessFallbackError(401)
}

export function forbidden(): never {
  createHttpAccessFallbackError(403)
}

export function isRedirectError(error: unknown): boolean {
  if (typeof error !== "object" || error === null || !("digest" in error) || typeof error.digest !== "string") {
    return false
  }

  const [errorCode, type] = error.digest.split(";")
  const status = error.digest.split(";").at(-2)
  const statusCode = Number(status)

  return (
    errorCode === REDIRECT_ERROR_CODE &&
    (type === RedirectType.push || type === RedirectType.replace) &&
    !Number.isNaN(statusCode) &&
    (statusCode === RedirectStatusCode.TemporaryRedirect || statusCode === RedirectStatusCode.PermanentRedirect)
  )
}

export function getURLFromRedirectError(error: unknown): string | null {
  if (!isRedirectError(error) || typeof error !== "object" || error === null || !("digest" in error)) {
    return null
  }

  if (typeof error.digest !== "string") {
    return null
  }

  return error.digest.split(";").slice(2, -2).join(";")
}

export function isHTTPAccessFallbackError(error: unknown): error is Error & { digest: string } {
  if (typeof error !== "object" || error === null || !("digest" in error) || typeof error.digest !== "string") {
    return false
  }

  const [prefix, httpStatus] = error.digest.split(";")
  const statusCode = Number(httpStatus)

  return prefix === HTTP_ERROR_FALLBACK_ERROR_CODE && (statusCode === 401 || statusCode === 403 || statusCode === 404)
}

export function getHTTPAccessFallbackStatus(error: unknown): HttpAccessFallbackStatus | null {
  if (!isHTTPAccessFallbackError(error)) {
    return null
  }

  const statusCode = Number(error.digest.split(";")[1])

  if (statusCode === 401 || statusCode === 403 || statusCode === 404) {
    return statusCode
  }

  return null
}
