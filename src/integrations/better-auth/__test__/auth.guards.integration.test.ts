import { describe, expect, it, vi } from "vite-plus/test"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { redirectAfterAuth, requireAdmin, requireSession } from "~/src/integrations/better-auth/auth.guards"
import { getCurrentSession } from "~/src/integrations/better-auth/auth.session"
import { handleLocaleMiddleware } from "~/src/integrations/use-intl/i18n.middleware"

vi.mock(import("~/src/integrations/better-auth/auth.session"), async (importOriginal) => ({
  ...(await importOriginal()),
  getCurrentSession: vi.fn<typeof getCurrentSession>(),
}))
const session = (role: "admin" | "customer") => vi.mocked(getCurrentSession).mockResolvedValue(createAuthSessionFixture({ role }))
const signedOut = () => vi.mocked(getCurrentSession).mockResolvedValue(null)

describe("route authorization and locale handling", () => {
  it("redirects a signed-out callback to sign-in", async () => {
    signedOut()
    await expect(redirectAfterAuth()).rejects.toHaveProperty("options.to", "/auth/sign-in")
  })
  it("redirects an admin callback to the admin area", async () => {
    session("admin")
    await expect(redirectAfterAuth()).rejects.toHaveProperty("options.to", "/admin")
  })
  it("redirects a customer callback to the app area", async () => {
    session("customer")
    await expect(redirectAfterAuth()).rejects.toHaveProperty("options.to", "/app")
  })
  it("protects app routes", async () => {
    signedOut()
    await expect(requireSession()).rejects.toHaveProperty("options.to", "/auth/sign-in")
  })
  it("protects admin routes", async () => {
    signedOut()
    await expect(requireAdmin()).rejects.toHaveProperty("options.to", "/auth/sign-in")
  })
  it("redirects customers out of the admin area", async () => {
    session("customer")
    await expect(requireAdmin()).rejects.toHaveProperty("options.to", "/app")
  })
  it("allows admins and supplies the route session", async () => {
    session("admin")
    await expect(requireAdmin()).resolves.toHaveProperty("session.user.role", "admin")
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
