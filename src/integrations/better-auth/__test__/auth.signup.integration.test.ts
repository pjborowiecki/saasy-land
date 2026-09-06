import { env } from "cloudflare:workers"

import { getRequest } from "@tanstack/react-start/server"
import { eq } from "drizzle-orm"
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test"
import * as zod from "zod"

import { executeMutation } from "~/src/platform/testing/lib/query"

import { auth } from "~/src/integrations/better-auth/auth.server"
import { db } from "~/src/integrations/drizzle-orm/drizzle.database"
import { I18N } from "~/src/integrations/use-intl/i18n.config"

import { signUpWithPasswordMutation } from "~/src/modules/account/use-cases/sign-up-with-password"
import { user } from "~/src/modules/user/user.schema"

const ORIGIN = "http://127.0.0.1:3000"
const EMAIL_SCHEMA = zod.object({ from: zod.string(), html: zod.string(), subject: zod.string(), to: zod.string() })
const deliveries: { body: zod.infer<typeof EMAIL_SCHEMA>; idempotencyKey: string | null }[] = []
let failDelivery = false

const createSignUp = () => ({
  callbackURL: "/pl-PL/app",
  confirmPassword: "SignupPassword123!",
  email: `signup-${crypto.randomUUID()}@example.test`,
  name: "Test Customer",
  password: "SignupPassword123!",
})

const signUp = async (body: ReturnType<typeof createSignUp>, cookie = `${I18N.COOKIE_NAME}=pl-PL`) => {
  const request = new Request(`${ORIGIN}/_serverFn/sign-up`, {
    body: JSON.stringify({ data: body }),
    headers: {
      "content-type": "application/json",
      cookie,
      host: "127.0.0.1:3000",
      origin: ORIGIN,
    },
    method: "POST",
  })
  await request.json()
  vi.mocked(getRequest).mockReturnValue(request)
  return executeMutation(signUpWithPasswordMutation, body)
}

const verifyDeliveredEmail = async () => {
  const verificationLink = deliveries[0]?.body.html.match(/href="(?<url>[^"]+\/auth\/verify-email\?token=[^"]+)"/u)?.groups?.["url"]
  expect(verificationLink).toBeDefined()
  const verificationUrl = new URL(verificationLink!)
  const token = verificationUrl.searchParams.get("token")
  expect(token).toBeTruthy()
  await auth.api.verifyEmail({ headers: getRequest().headers, query: { token: token! } })
}

beforeEach(() => {
  deliveries.length = 0
  failDelivery = false
  vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
    const request = new Request(input, init)
    expect(request.url).toBe("https://api.resend.com/emails")
    expect(request.method).toBe("POST")
    const body = EMAIL_SCHEMA.parse(await request.json())
    if (failDelivery) {
      return Response.json({ message: "Provider temporarily unavailable", name: "application_error" }, { status: 503 })
    }
    deliveries.push({ body, idempotencyKey: request.headers.get("idempotency-key") })
    return Response.json({ id: crypto.randomUUID() })
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe("production signup verification delivery", () => {
  it("sends a rendered, localized verification email before signup completes", async () => {
    const body = createSignUp()

    const result = await signUp(body)

    expect(result.token).toBeNull()
    expect(result.user).toMatchObject({ email: body.email, emailVerified: false })
    expect(deliveries).toHaveLength(1)
    expect(deliveries[0]?.body).toMatchObject({
      from: env.RESEND_EMAIL_FROM,
      subject: "Potwierdź adres e-mail",
      to: body.email,
    })
    expect(deliveries[0]?.body.html).toContain(`${ORIGIN}/pl-PL/auth/verify-email?token=`)
    expect(deliveries[0]?.idempotencyKey).toMatch(/^verify-email\//u)
    expect(deliveries[0]?.body.html).toContain('lang="pl-PL"')

    await verifyDeliveredEmail()
    const verified = await db.select().from(user).where(eq(user.id, result.user.id))
    expect(verified[0]?.emailVerified).toBe(true)
  })

  it.each(["", `${I18N.COOKIE_NAME}=de-DE`])("preserves the requested locale on repeated signup with cookie %j", async (cookie) => {
    const body = createSignUp()
    const first = await signUp(body, cookie)
    deliveries.length = 0

    const repeated = await signUp(body, cookie)

    expect(repeated.token).toBeNull()
    expect(repeated.user.email).toBe(body.email)
    expect(repeated.user.id).not.toBe(first.user.id)
    expect(deliveries).toHaveLength(1)
    expect(deliveries[0]?.body.to).toBe(body.email)
    expect(deliveries[0]?.body.html).toContain(`${ORIGIN}/pl-PL/auth/verify-email?token=`)
    const accounts = await db.select().from(user).where(eq(user.email, body.email))
    expect(accounts).toHaveLength(1)
    expect(accounts[0]?.id).toBe(first.user.id)
  })

  it("recovers a failed initial email delivery when signup is retried and lets the customer verify and sign in", async () => {
    const body = createSignUp()
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})
    failDelivery = true

    const first = await signUp(body)

    expect(deliveries).toHaveLength(0)
    expect(first.user.emailVerified).toBe(false)
    expect(consoleError.mock.calls.flat().some((value) => String(value).includes("Failed to run background task:"))).toBe(true)
    const accounts = await db.select().from(user).where(eq(user.email, body.email))
    expect(accounts).toHaveLength(1)
    expect(accounts[0]?.emailVerified).toBe(false)
    failDelivery = false

    const repeated = await signUp(body)

    expect(repeated.user.id).not.toBe(first.user.id)
    expect(deliveries).toHaveLength(1)
    expect(deliveries[0]?.body.to).toBe(body.email)
    await verifyDeliveredEmail()
    const session = await auth.api.signInEmail({
      body: { email: body.email, password: body.password },
      headers: getRequest().headers,
    })
    expect(session.token).toBeTypeOf("string")
    expect(session.user).toMatchObject({ email: body.email, emailVerified: true, id: first.user.id })
  })

  it("keeps the generic signup response without sending verification to an already verified account", async () => {
    const body = createSignUp()
    const first = await signUp(body)
    await db.update(user).set({ emailVerified: true }).where(eq(user.id, first.user.id))
    deliveries.length = 0

    const repeated = await signUp(body)

    expect(repeated.token).toBeNull()
    expect(repeated.user.email).toBe(body.email)
    expect(repeated.user.id).not.toBe(first.user.id)
    expect(deliveries).toHaveLength(0)
  })
})
