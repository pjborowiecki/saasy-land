import "server-only"

import type { JSX } from "react"

import type { CreateEmailOptions, CreateEmailResponse } from "resend"

import { env } from "~/src/platform/env"

import { resend } from "~/src/integrations/resend/resend.config"

export interface SendEmailOptions {
  readonly from?: string
  readonly react: JSX.Element
  readonly subject: string
  readonly to: string
}

export type SendEmailResult = { readonly success: true; readonly id: string } | { readonly success: false; readonly error: string }

export type EmailSendFn = typeof resend.emails.send

function mapSendResult(response: CreateEmailResponse): SendEmailResult {
  if (response.error) {
    return { error: response.error.message, success: false }
  }

  const id = response.data?.id
  if (id === undefined || id.length === 0) {
    return { error: "Resend returned no email id", success: false }
  }

  return { id, success: true }
}

export async function sendEmail(
  { from, react, subject, to }: Readonly<SendEmailOptions>,
  send: EmailSendFn = (options: CreateEmailOptions) => resend.emails.send(options),
): Promise<SendEmailResult> {
  const fromEmail = from ?? env.RESEND_EMAIL_FROM

  try {
    const response = await send({ from: fromEmail, react, subject, to })
    return mapSendResult(response)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error sending email"
    return { error: message, success: false }
  }
}
