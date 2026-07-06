import { env } from "~/src/environment"

export const TEST_APP_URL = env.NEXT_PUBLIC_APP_URL

export function createCookieHeader(name: string, value: string): string {
  return `${name}=${value}`
}

export function createTestRequestUrl(pathname: string): string {
  return new URL(pathname, TEST_APP_URL).toString()
}

export function createAuthActionUrl(callbackPath: string): string {
  return `${TEST_APP_URL}/api/auth/callback?callbackURL=${encodeURIComponent(callbackPath)}`
}
