import type * as StartServerModule from "@tanstack/react-start/server"
import { describe, expect, it, vi } from "vite-plus/test"

import { executeMutation } from "~/src/platform/testing/lib/query"

import { NEWSLETTER_TOKEN_LENGTH } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.schema"
import { unsubscribeFromNewsletterMutation } from "~/src/modules/newsletter-subscriber/use-cases/unsubscribe-from-newsletter"

const HEADERS = new Headers()
const TOKEN = "b".repeat(NEWSLETTER_TOKEN_LENGTH)
const SINGLE_CALL = 1

const dbMocks = vi.hoisted(() => {
  const where = vi.fn<() => Promise<void>>().mockResolvedValue()
  const set = vi.fn<() => { where: typeof where }>().mockReturnValue({ where })
  const updateMock = vi.fn<() => { set: typeof set }>().mockReturnValue({ set })

  return { set, updateMock, where }
})

vi.mock(import("@tanstack/react-start/server-only"), () => ({}))

vi.mock(import("~/src/integrations/drizzle-orm/drizzle.database"), async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, db: Object.assign(actual.db, { update: dbMocks.updateMock }) }
})

vi.mock(import("@tanstack/react-start/server"), (): Partial<typeof StartServerModule> => ({
  getRequest: vi.fn(() => new Request("http://127.0.0.1:3000/", { headers: HEADERS })),
}))

describe("unsubscribe-from-newsletter", () => {
  it("marks the row unsubscribed without a session", async () => {
    expect.hasAssertions()
    dbMocks.updateMock.mockClear()

    await expect(executeMutation(unsubscribeFromNewsletterMutation, { token: TOKEN })).resolves.toMatchObject({ unsubscribed: true })

    expect(dbMocks.updateMock).toHaveBeenCalledTimes(SINGLE_CALL)
    expect(dbMocks.set).toHaveBeenCalledWith(expect.objectContaining({ status: "unsubscribed" }))
  })

  it("reports success for a token that matches nothing", async () => {
    expect.hasAssertions()
    dbMocks.updateMock.mockClear()

    await expect(executeMutation(unsubscribeFromNewsletterMutation, { token: "c".repeat(NEWSLETTER_TOKEN_LENGTH) })).resolves.toMatchObject(
      {
        unsubscribed: true,
      },
    )
  })

  it("rejects a token of the wrong length before it reaches a query", async () => {
    expect.hasAssertions()
    dbMocks.updateMock.mockClear()

    await expect(executeMutation(unsubscribeFromNewsletterMutation, { token: "short" })).rejects.toThrow("VALIDATION")
    expect(dbMocks.updateMock).not.toHaveBeenCalled()
  })
})
