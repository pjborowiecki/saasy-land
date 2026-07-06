import type * as BetterAuthClientPluginsModule from "better-auth/client/plugins"
import type { createAuthClient } from "better-auth/react"
import type * as BetterAuthReactModule from "better-auth/react"

import { CONSTANTS } from "~/src/constants"

import { authClient } from "~/src/integrations/better-auth/auth._client"

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

    const location = { href: "" }
    vi.stubGlobal("location", location)
    onTwoFactorRedirect?.()
    expect(location.href).toBe(CONSTANTS.ROUTES.TWO_FACTOR)
    expect(authClient).toBeDefined()
  })
})
