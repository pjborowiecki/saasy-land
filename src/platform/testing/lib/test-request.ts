export const TEST_APP_URL = "http://localhost:3000"

export const createCookieHeader = (name: string, value: string): string => `${name}=${value}`

export const createTestRequestUrl = (pathname: string): string => new URL(pathname, TEST_APP_URL).toString()

export const createAuthActionUrl = (callbackPath: string): string =>
  `${TEST_APP_URL}/api/auth/callback?callbackURL=${encodeURIComponent(callbackPath)}`
