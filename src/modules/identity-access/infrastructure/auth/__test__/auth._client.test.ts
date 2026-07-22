import type * as BetterAuthClientPluginsModule from "better-auth/client/plugins"
import type { createAuthClient } from "better-auth/react"
import type * as BetterAuthReactModule from "better-auth/react"

import { authClient } from "~/src/modules/identity-access/infrastructure/auth/auth._client"

import { ROUTES } from "~/src/routes"

type CreateAuthClientOptions = NonNullable<Parameters<typeof createAuthClient>[0]>

const capturedConfig = vi.hoisted(() => ({ value: undefined as CreateAuthClientOptions | undefined }))

vi.mock(import("better-auth/client/plugins"), async (importOriginal): Promise<Partial<typeof BetterAuthClientPluginsModule>> => {
  const actual = await importOriginal<typeof BetterAuthClientPluginsModule>()
  const twoFactorClient: typeof actual.twoFactorClient = (config) => ({
    ...actual.twoFactorClient(config),
    onTwoFactorRedirect: config?.onTwoFactorRedirect,
  })

  return {
    ...actual,
    twoFactorClient,
  }
})

vi.mock(import("better-auth/react"), async (importOriginal): Promise<Partial<typeof BetterAuthReactModule>> => {
  const actual = await importOriginal<typeof BetterAuthReactModule>()
  const createAuthClient: typeof actual.createAuthClient = (options) => {
    capturedConfig.value = options
    return actual.createAuthClient(options)
  }

  return {
    ...actual,
    createAuthClient,
  }
})

function isRedirectHandler(value: unknown): value is () => void {
  return typeof value === "function"
}

function readTwoFactorRedirect(): (() => void) | undefined {
  const plugins = capturedConfig.value?.plugins

  if (!Array.isArray(plugins)) {
    return undefined
  }

  for (const plugin of plugins) {
    if (typeof plugin === "object" && plugin !== null && "onTwoFactorRedirect" in plugin) {
      const { onTwoFactorRedirect } = plugin

      if (isRedirectHandler(onTwoFactorRedirect)) {
        return onTwoFactorRedirect
      }
    }
  }

  return undefined
}

describe("better auth client", () => {
  it("configures two-factor redirect", () => {
    expect.hasAssertions()
    const onTwoFactorRedirect = readTwoFactorRedirect()

    expect(onTwoFactorRedirect).toBeDefined()

    const location = { href: "", pathname: "/auth/sign-in" }
    vi.stubGlobal("location", location)
    onTwoFactorRedirect?.()
    expect(location.href).toBe(ROUTES.TWO_FACTOR)
    expect(authClient).toBeDefined()
  })

  it("prefixes two-factor redirect with the active locale", () => {
    expect.hasAssertions()
    const onTwoFactorRedirect = readTwoFactorRedirect()
    const location = { href: "", pathname: "/en/auth/sign-in" }

    vi.stubGlobal("location", location)
    onTwoFactorRedirect?.()

    expect(location.href).toBe(`/en${ROUTES.TWO_FACTOR}`)
  })

  it("uses the locale prefix when pathname matches the locale root", () => {
    expect.hasAssertions()
    const onTwoFactorRedirect = readTwoFactorRedirect()
    const location = { href: "", pathname: "/pl" }

    vi.stubGlobal("location", location)
    onTwoFactorRedirect?.()

    expect(location.href).toBe(`/pl${ROUTES.TWO_FACTOR}`)
  })

  it("falls back to the base path when location is unavailable", () => {
    expect.hasAssertions()
    const onTwoFactorRedirect = readTwoFactorRedirect()
    const unavailableLocation: Location | undefined = undefined

    vi.stubGlobal("location", unavailableLocation)

    expect(() => onTwoFactorRedirect?.()).toThrow(TypeError)
  })

  it("falls back to the base path when pathname is missing", () => {
    expect.hasAssertions()
    const onTwoFactorRedirect = readTwoFactorRedirect()
    const location = { href: "" }

    vi.stubGlobal("location", location)
    onTwoFactorRedirect?.()

    expect(location.href).toBe(ROUTES.TWO_FACTOR)
  })
})
