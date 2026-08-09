import "server-only"

import type { JSX } from "react"

import { env } from "~/src/platform/env"

import { resend } from "~/src/integrations/resend/resend.config"

interface SendEmailOptions {
  readonly from?: string
  readonly idempotencyKey: string
  readonly react: JSX.Element
  readonly subject: string
  readonly to: string
}

export async function sendEmail({
  from = env.RESEND_EMAIL_FROM,
  idempotencyKey,
  react,
  subject,
  to,
}: Readonly<SendEmailOptions>): Promise<void> {
  const { error } = await resend.emails.send({ from, react, subject, to }, { idempotencyKey })

  if (error) {
    throw new Error(`Failed to send "${subject}" to ${to}: ${error.message}`)
  }
}
