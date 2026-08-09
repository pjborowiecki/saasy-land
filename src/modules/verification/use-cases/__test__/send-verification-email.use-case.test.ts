import type * as NextHeadersModule from "next/headers"

import { sendVerificationEmail } from "~/src/modules/verification/use-cases/send-verification-email.use-case"

import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

const HEADERS = new Headers()

type AuthApi = typeof auth.api

const sendVerificationEmailMock = vi.hoisted(() => vi.fn<AuthApi["sendVerificationEmail"]>())

vi.mock(import("server-only"), () => ({}))

const redisMocks = vi.hoisted(() => {
  const FIRST_COUNT = 1
  return {
    expire: vi.fn<() => Promise<number>>(() => Promise.resolve(FIRST_COUNT)),
    incr: vi.fn<() => Promise<number>>(() => Promise.resolve(FIRST_COUNT)),
  }
})

// @ts-expect-error Vitest module mock factory is not inferred for the redis client export.
vi.mock(import("~/src/integrations/redis/redis.config"), () => ({ redis: redisMocks }))

vi.mock(
  import("next/headers"),
  (): Partial<typeof NextHeadersModule> => ({
    headers: vi.fn<() => Promise<Headers>>(() => Promise.resolve(HEADERS)),
  }),
)

describe("send-verification-email", () => {
  it("calls auth.api.sendVerificationEmail", async () => {
    expect.hasAssertions()
    sendVerificationEmailMock.mockReset()
    sendVerificationEmailMock.mockResolvedValue({ status: true })
    vi.spyOn(authServer.auth.api, "sendVerificationEmail").mockImplementation(sendVerificationEmailMock)

    await expect(sendVerificationEmail({ callbackURL: "https://example.com/en/app", email: "ada@example.com" })).resolves.toMatchObject({
      data: { status: true },
    })
    expect(sendVerificationEmailMock).toHaveBeenCalledWith({
      body: { callbackURL: "https://example.com/en/app", email: "ada@example.com" },
      headers: HEADERS,
    })
  })
})
