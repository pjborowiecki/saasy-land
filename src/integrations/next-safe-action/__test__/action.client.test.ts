import type * as NextHeadersModule from "next/headers"

import { ForbiddenError } from "~/src/modules/_core/errors/forbidden.error"

import { publicActionClient } from "~/src/integrations/next-safe-action/action.client"

vi.mock(import("server-only"), () => ({}))

vi.mock(
  import("next/headers"),
  (): Partial<typeof NextHeadersModule> => ({
    headers: vi.fn<() => Promise<Headers>>(() => Promise.resolve(new Headers())),
  }),
)

describe("action clients", () => {
  it("returns data on success", async () => {
    expect.hasAssertions()

    const succeed = publicActionClient.action(() => Promise.resolve("done"))

    await expect(succeed()).resolves.toMatchObject({ data: "done" })
  })

  it("maps domain errors to serverError", async () => {
    expect.hasAssertions()

    const fail = publicActionClient.action(() => {
      throw new ForbiddenError("nope")
    })

    await expect(fail()).resolves.toMatchObject({
      serverError: { code: "FORBIDDEN", message: "nope" },
    })
  })

  it("rethrows unexpected errors", async () => {
    expect.hasAssertions()

    const boom = publicActionClient.action(() => {
      throw new Error("boom")
    })

    await expect(boom()).rejects.toThrow("boom")
  })
})
