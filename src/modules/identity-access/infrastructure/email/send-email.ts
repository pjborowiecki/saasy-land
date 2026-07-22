import "server-only"

import type { JSX } from "react"

import { env } from "~/src/platform/env"

import { sendResendEmail } from "~/src/modules/identity-access/infrastructure/email/send-resend-email"

interface SendEmailOptions {
  readonly from?: string
  readonly react: JSX.Element
  readonly subject: string
  readonly to: string
}

export type SendEmailResult = { readonly success: true; readonly id: string } | { readonly success: false; readonly error: string }

export async function sendEmail({ from, react, subject, to }: Readonly<SendEmailOptions>): Promise<SendEmailResult> {
  const fromEmail = from ?? env.RESEND_EMAIL_FROM

  try {
    const result = await sendResendEmail({ from: fromEmail, react, subject, to })

    if (!result.ok) {
      return { error: result.error, success: false }
    }

    return { id: result.id, success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error sending email"
    return { error: message, success: false }
  }
}
