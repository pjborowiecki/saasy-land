import { getRequest } from "@tanstack/react-start/server"
import { afterEach, expect, it, vi } from "vite-plus/test"

import { getCookie, readCookie, serializeCookie } from "~/src/lib/cookie"

afterEach(() => vi.unstubAllEnvs())
it.each([undefined, null, "", "other=one", "broken", "=empty-key", "locale=%E0%A4%A"])(
  "ignores absent or invalid cookies: %s",
  (header) => {
    expect(readCookie({ header, name: "locale" })).toBeUndefined()
  },
)
it("decodes the matching cookie and ignores surrounding whitespace", () => {
  expect(readCookie({ header: "other=one; locale= pl%2DPL ; third=x", name: "locale" })).toBe("pl-PL")
})
it("reads cookies from the active server request", () => {
  vi.mocked(getRequest).mockReturnValue(new Request("http://localhost/", { headers: { cookie: "locale=pl-PL" } }))
  expect(getCookie("locale")).toBe("pl-PL")
})
it("serializes defaults in development", () => {
  vi.stubEnv("PROD", false)
  expect(serializeCookie({ name: "locale", value: "pl PL" })).toBe("locale=pl%20PL; Path=/; Max-Age=31536000; SameSite=Lax")
})
it("uses secure cookies by default in production", () => {
  vi.stubEnv("PROD", true)
  expect(serializeCookie({ name: "locale", value: "pl-PL" })).toContain("; Secure")
})
it("honors explicit cookie attributes", () => {
  expect(
    serializeCookie({
      name: "locale",
      options: { httpOnly: true, maxAge: 0, path: "/app", sameSite: "Strict", secure: false },
      value: "x",
    }),
  ).toBe("locale=x; Path=/app; Max-Age=0; SameSite=Strict; HttpOnly")
})
it("requires Secure for SameSite=None even when explicitly disabled", () => {
  expect(serializeCookie({ name: "locale", options: { sameSite: "None", secure: false }, value: "x" })).toContain("; Secure")
})
