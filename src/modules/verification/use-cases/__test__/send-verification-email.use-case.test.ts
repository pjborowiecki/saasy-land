import type * as NextHeadersModule from "next/headers"

import { sendVerificationEmail } from "~/src/modules/verification/use-cases/send-verification-email.use-case"

import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

const HEADERS = new Headers()

type AuthApi = typeof auth.api

const sendVerificationEmailMock = vi.hoisted(() => vi.fn<AuthApi["sendVerificationEmail"]>())

vi.mock(import("server-only"), () => ({}))

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

    await expect(sendVerificationEmail({ email: "ada@example.com" })).resolves.toMatchObject({ data: { status: true } })
    expect(sendVerificationEmailMock).toHaveBeenCalledWith({ body: { email: "ada@example.com" }, headers: HEADERS })
  })
})
