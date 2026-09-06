import { describe, expect, it, vi } from "vite-plus/test"

import { ERROR_CODES } from "~/src/modules/_core/constants/errors"
import { newsletterRequestOrigin } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.server"

vi.mock(import("@tanstack/react-start/server-only"), () => ({}))

describe("newsletter request origin", () => {
  it.each([
    "http://localhost:3000",
    "http://127.0.0.1:3020",
    "https://localhost:4443",
    "http://[::1]:3000",
    "https://saasyland.com",
    "https://preview.saasyland.com",
    "https://saasyland-preview.pjborowiecki.workers.dev",
  ])("accepts the actual trusted deployment URL: %s", (origin) => {
    const request = new Request(`${origin}/_serverFn/subscribe?unrelated=value`)
    expect(newsletterRequestOrigin(request)).toBe(origin)
  })

  it.each([
    "https://example.test",
    "https://saasyland.com.example.test",
    "https://fakesaasyland.com",
    "https://saasyland-preview.pjborowiecki.workers.dev.example.test",
    "https://other-account.workers.dev",
    "http://saasyland.com",
    "ftp://localhost",
  ])("rejects an untrusted host or protocol: %s", (origin) => {
    expect(() => newsletterRequestOrigin(new Request(origin))).toThrow(ERROR_CODES.FORBIDDEN)
  })

  it("ignores attacker-controlled origin and forwarding headers", () => {
    const request = new Request("http://localhost:3000/_serverFn/subscribe", {
      headers: {
        host: "attacker.example",
        origin: "https://attacker.example",
        "x-forwarded-host": "attacker.example",
        "x-forwarded-proto": "https",
      },
    })
    expect(newsletterRequestOrigin(request)).toBe("http://localhost:3000")
  })
})
