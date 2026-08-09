import "server-only"

import { headers } from "next/headers"

import { betterAuth } from "@next-safe-action/adapter-better-auth"
import { IP_HEADER_NAME } from "@vercel/functions/headers"
import { APIError } from "better-auth/api"
import { createMiddleware, createSafeActionClient, DEFAULT_SERVER_ERROR_MESSAGE } from "next-safe-action"

import { type ActionServerError, AppError, ERROR_CODES } from "~/src/modules/_core/constants/errors"

import { hasPermission, type Permission } from "~/src/integrations/better-auth/auth.access"
import { authErrorKey } from "~/src/integrations/better-auth/auth.errors"
import { auth } from "~/src/integrations/better-auth/auth.server"
import { redis } from "~/src/integrations/redis/redis.config"

const FIRST_ATTEMPT = 1
const SENSITIVE_ATTEMPTS = 3
const TOKEN_ATTEMPTS = 5
const RATE_LIMIT_WINDOW_IN_SECONDS = 60

export const RATE_LIMITS = {
  SENSITIVE: { max: SENSITIVE_ATTEMPTS, window: RATE_LIMIT_WINDOW_IN_SECONDS },
  TOKEN: { max: TOKEN_ATTEMPTS, window: RATE_LIMIT_WINDOW_IN_SECONDS },
} as const

export const actionClient = createSafeActionClient({
  handleServerError(error): ActionServerError {
    if (error instanceof AppError) {
      return { code: error.code, message: error.message }
    }

    if (error instanceof APIError) {
      return { code: ERROR_CODES.AUTH_API_ERROR, message: authErrorKey(error) }
    }

    return { code: ERROR_CODES.INTERNAL_ERROR, message: DEFAULT_SERVER_ERROR_MESSAGE }
  },
}).use(async ({ next }) => next({ ctx: { requestHeaders: await headers() } }))

export function withRateLimit(kind: string, { max, window }: { readonly max: number; readonly window: number }) {
  return createMiddleware<{ ctx: { requestHeaders: Headers } }>().define(async ({ ctx, next }) => {
    const forwardedFor = ctx.requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim()
    const ip = ctx.requestHeaders.get(IP_HEADER_NAME) ?? forwardedFor ?? "unknown"

    const key = `action-rate-limit:${kind}:${ip}`

    let count = FIRST_ATTEMPT
    try {
      count = await redis.incr(key)
      if (count === FIRST_ATTEMPT) {
        await redis.expire(key, window)
      }
    } catch (error) {
      // Fail open: an unreachable limiter store must not take the action down with it.
      console.error(`[rate-limit] storage unavailable for "${kind}"`, error)
      count = FIRST_ATTEMPT
    }

    if (count > max) {
      throw new AppError(ERROR_CODES.TOO_MANY_REQUESTS)
    }

    return next()
  })
}

export function withAuth(permission?: Permission) {
  return betterAuth(auth, {
    authorize: ({ authData, next }) => {
      if (!authData) {
        throw new AppError(ERROR_CODES.UNAUTHORIZED)
      }

      if (permission && !hasPermission(authData.user.role, permission)) {
        throw new AppError(ERROR_CODES.FORBIDDEN)
      }

      return next({ ctx: { auth: authData } })
    },
  })
}
