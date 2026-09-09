import { QueryClient } from "@tanstack/react-query"
import { beforeEach, describe, expect, it, vi } from "vite-plus/test"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { redirectAfterAuth, redirectIfSignedIn, requireAdmin, requireSignedIn } from "~/src/integrations/better-auth/auth.routes"
import { type getCurrentSession, getCurrentSessionQuery } from "~/src/integrations/better-auth/auth.session"
import { handleLocaleMiddleware } from "~/src/integrations/use-intl/i18n.middleware"

import { LICENSE_QUERY_KEYS } from "~/src/modules/license/license.constants"

const getSession = vi.hoisted(() => vi.fn<typeof getCurrentSession>())
vi.mock(import("~/src/integrations/better-auth/auth.session"), async (importOriginal) => {
  const original = await importOriginal()
  return { ...original, getCurrentSessionQuery: { ...original.getCurrentSessionQuery, queryFn: getSession } }
})
const createContext = () => ({ context: { queryClient: new QueryClient() } })
beforeEach(() => {
  getSession.mockReset()
})
const session = (role: "admin" | "customer") => getSession.mockResolvedValue(createAuthSessionFixture({ role }))
const signedOut = () => getSession.mockResolvedValue(null)

describe("route authorization and locale handling", () => {
  it("redirects a signed-out callback to sign-in", async () => {
    signedOut()
    await expect(redirectAfterAuth(createContext())).rejects.toHaveProperty("options.to", "/auth/sign-in")
  })
  it("redirects an admin callback to the admin area", async () => {
    session("admin")
    await expect(redirectAfterAuth(createContext())).rejects.toHaveProperty("options.to", "/admin")
  })
  it("redirects a customer callback to the app area", async () => {
    session("customer")
    await expect(redirectAfterAuth(createContext())).rejects.toHaveProperty("options.to", "/app")
  })
  it("protects app routes", async () => {
    signedOut()
    await expect(requireSignedIn(createContext())).rejects.toHaveProperty("options.to", "/auth/sign-in")
  })
  it("protects admin routes", async () => {
    signedOut()
    await expect(requireAdmin(createContext())).rejects.toHaveProperty("options.to", "/auth/sign-in")
  })
  it("redirects customers out of the admin area", async () => {
    session("customer")
    await expect(requireAdmin(createContext())).rejects.toHaveProperty("options.to", "/app")
  })
  it("allows admins and supplies the route session", async () => {
    session("admin")
    await expect(requireAdmin(createContext())).resolves.toHaveProperty("session.user.role", "admin")
  })
  it("allows signed-out visitors on guest routes", async () => {
    signedOut()
    await expect(redirectIfSignedIn(createContext())).resolves.toBeUndefined()
  })
  it.each([
    ["admin", "/admin"],
    ["customer", "/app"],
  ] as const)("redirects signed-in %s away from guest routes", async (role, to) => {
    session(role)
    await expect(redirectIfSignedIn(createContext())).rejects.toHaveProperty("options", expect.objectContaining({ replace: true, to }))
  })
  it("rechecks a cached admin session and rejects it after revocation", async () => {
    const context = createContext()
    session("admin")
    await requireAdmin(context)
    context.context.queryClient.setQueryData(LICENSE_QUERY_KEYS.CURRENT, { key: "previous-license" })
    signedOut()
    await expect(requireAdmin(context)).rejects.toHaveProperty("options.to", "/auth/sign-in")
    expect(context.context.queryClient.getQueryData(getCurrentSessionQuery.queryKey)).toBeNull()
    expect(context.context.queryClient.getQueryData(LICENSE_QUERY_KEYS.CURRENT)).toBeUndefined()
    expect(getSession).toHaveBeenCalledTimes(2)
  })
  it("clears the previous account's cached data when the session changes to another account", async () => {
    const context = createContext()
    session("customer")
    await requireSignedIn(context)
    context.context.queryClient.setQueryData(LICENSE_QUERY_KEYS.CURRENT, { key: "previous-license" })
    const nextSession = createAuthSessionFixture({ userId: "another-customer" })
    getSession.mockResolvedValue(nextSession)
    await expect(requireSignedIn(context)).resolves.toEqual({ session: nextSession })
    expect(context.context.queryClient.getQueryData(LICENSE_QUERY_KEYS.CURRENT)).toBeUndefined()
    expect(context.context.queryClient.getQueryData(getCurrentSessionQuery.queryKey)).toEqual(nextSession)
  })
  it("rechecks roles instead of trusting a cached admin role", async () => {
    const context = createContext()
    session("admin")
    await requireAdmin(context)
    session("customer")
    await expect(requireAdmin(context)).rejects.toHaveProperty("options.to", "/app")
  })
  it("shares an in-flight session check and caches it for page consumers", async () => {
    const context = createContext()
    const currentSession = createAuthSessionFixture()
    const pending = Promise.withResolvers<typeof currentSession>()
    getSession.mockReturnValue(pending.promise)
    const checks = Promise.all([requireSignedIn(context), requireSignedIn(context)])
    pending.resolve(currentSession)
    await expect(checks).resolves.toEqual([{ session: currentSession }, { session: currentSession }])
    expect(getSession).toHaveBeenCalledOnce()
    expect(context.context.queryClient.getQueryData(getCurrentSessionQuery.queryKey)).toEqual(currentSession)
  })
  it("reuses the session for link preloads but rechecks before actual navigation", async () => {
    const context = createContext()
    session("admin")
    await requireAdmin(context)
    await requireAdmin({ ...context, preload: true })
    await requireAdmin({ ...context, preload: true })
    expect(getSession).toHaveBeenCalledOnce()

    signedOut()
    await expect(requireAdmin(context)).rejects.toHaveProperty("options.to", "/auth/sign-in")
    expect(getSession).toHaveBeenCalledTimes(2)
  })
  it("keeps server failures as errors instead of granting access or looping through sign-in", async () => {
    const error = new Error("Session service unavailable")
    getSession.mockRejectedValue(error)
    await expect(requireSignedIn(createContext())).rejects.toBe(error)
    expect(getSession).toHaveBeenCalledOnce()
  })
  it("allows unprefixed app paths through locale handling before their route guard", () => {
    expect(handleLocaleMiddleware(new Request("http://localhost/app"))).toEqual({})
  })
  it("does not treat unknown prefixes as locales", () => {
    expect(handleLocaleMiddleware(new Request("http://localhost/xx/admin"))).toEqual({})
  })
  it("canonicalizes existing short locale links before routing", () => {
    expect(handleLocaleMiddleware(new Request("http://localhost/pl/docs")).redirect?.headers.get("location")).toBe(
      "http://localhost/pl-PL/docs",
    )
  })
})
