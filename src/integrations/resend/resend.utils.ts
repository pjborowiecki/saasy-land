import "@tanstack/react-start/server-only"

import { env } from "cloudflare:workers"

import type { JSX } from "react"

import { resend } from "~/src/integrations/resend/resend.config"

interface SendEmailOptions {
  readonly from?: string
  readonly idempotencyKey: string
  readonly react: JSX.Element
  readonly subject: string
  readonly to: string
}

export const sendEmail = async ({
  from = env.RESEND_EMAIL_FROM,
  idempotencyKey,
  react,
  subject,
  to,
}: Readonly<SendEmailOptions>): Promise<string> => {
  const { data, error } = await resend.emails.send({ from, react, subject, to }, { idempotencyKey })

  if (error) {
    throw new Error(`Failed to send "${subject}" to ${to}: ${error.message}`)
  }

  return data.id
}
