import type { APIRequestContext } from "@playwright/test"
import * as zod from "zod"

import { expect } from "./test"

const sentEmailsSchema = zod.array(
  zod.object({
    from: zod.string(),
    html: zod.string(),
    id: zod.string(),
    idempotencyKey: zod.string(),
    subject: zod.string(),
    to: zod.array(zod.string()),
  }),
)

const getSentEmails = async (request: APIRequestContext, recipient: string): Promise<zod.infer<typeof sentEmailsSchema>> => {
  const response = await request.get("/__test/emails", { params: { to: recipient } })
  expect(response.ok()).toBe(true)
  return sentEmailsSchema.parse(await response.json())
}

export const expectVerificationEmail = async (
  request: APIRequestContext,
  recipient: string,
  expectedCount = 1,
): Promise<URL> => {
  await expect.poll(async () => (await getSentEmails(request, recipient)).length).toBe(expectedCount)

  const emails = await getSentEmails(request, recipient)
  const email = emails.at(-1)
  if (!email) throw new Error(`No verification email was sent to ${recipient}`)

  expect(email.subject).toBe("Verify your email address")
  expect(email.to).toEqual([recipient])
  expect(email.html).toContain('lang="en-US"')
  const verificationLink = email.html.match(/href="([^"]*\/auth\/verify-email\?token=[^"]+)"/u)?.[1]
  if (!verificationLink) throw new Error("The verification email has no account verification link")

  const verificationUrl = new URL(verificationLink.replaceAll("&amp;", "&"))
  expect(verificationUrl.searchParams.get("token")).toBeTruthy()
  expect(email.idempotencyKey).toBe(`verify-email/${verificationUrl.searchParams.get("token")}`)
  return verificationUrl
}
