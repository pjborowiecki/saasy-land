import { createMiddleware } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { isAPIError } from "better-auth/api"
import { ZodError } from "zod"

import { type Permission, hasPermission } from "~/src/integrations/better-auth/auth.access"
import { authErrorKey } from "~/src/integrations/better-auth/auth.errors"
import { TRUSTED_IP_HEADERS } from "~/src/integrations/better-auth/auth.server"
import { getRequestSession } from "~/src/integrations/better-auth/auth.session"

import { AppError, ERROR_CODES } from "~/src/modules/_core/constants/errors"

import { withinRateLimit } from "~/src/lib/rate-limit"

const RATE_LIMIT_WINDOW_SECONDS = 60

export const RATE_LIMITS = {
  SENSITIVE: { max: 3, window: RATE_LIMIT_WINDOW_SECONDS },
  TOKEN: { max: 5, window: RATE_LIMIT_WINDOW_SECONDS },
} as const

const handleRequestError = (error: unknown): never => {
  if (error instanceof AppError) {
    throw new AppError(error.code)
  }
  if (isAPIError(error)) {
    throw new AppError(ERROR_CODES.AUTH_API_ERROR, authErrorKey(error))
  }
  if (error instanceof ZodError) {
    throw new AppError(ERROR_CODES.VALIDATION)
  }
  console.error("Server function failed", error)
  throw new AppError(ERROR_CODES.INTERNAL_ERROR)
}

export const withRequest = createMiddleware({ type: "function" }).server(({ next }) =>
  next({ context: { requestHeaders: getRequest().headers } }).catch(handleRequestError),
)

export const authorized = (permission?: Permission) =>
  createMiddleware({ type: "function" })
    .middleware([withRequest])
    .server(async ({ next }) => {
      const session = await getRequestSession(getRequest())
      if (!session) {
        throw new AppError(ERROR_CODES.UNAUTHORIZED)
      }
      if (permission && !hasPermission(session.user.role, permission)) {
        throw new AppError(ERROR_CODES.FORBIDDEN)
      }
      return next({ context: { auth: session } })
    })

export const withRateLimit = (kind: string, { max, window }: { readonly max: number; readonly window: number }) =>
  createMiddleware({ type: "function" })
    .middleware([withRequest])
    .server(async ({ context, next }) => {
      const ip = context.requestHeaders.get(TRUSTED_IP_HEADERS[0]) ?? "unknown"
      if (!(await withinRateLimit({ key: `${kind}:${ip}`, limit: max, windowSeconds: window }))) {
        throw new AppError(ERROR_CODES.TOO_MANY_REQUESTS)
      }
      return next()
    })
