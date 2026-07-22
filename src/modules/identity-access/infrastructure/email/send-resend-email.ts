import "server-only"

import type { CreateEmailOptions } from "resend"

import { resend } from "~/src/modules/identity-access/infrastructure/email/resend.config"

export type ResendEmailResult = { readonly ok: true; readonly id: string } | { readonly ok: false; readonly error: string }

/** Null-free shape used inside the app; Resend's SDK nulls are normalized at the boundary. */
export interface EmailSendResponse {
  readonly data?: { readonly id?: string }
  readonly error?: { readonly message: string }
}

export type EmailSendFn = (options: CreateEmailOptions) => Promise<EmailSendResponse>

async function sendViaResend(options: CreateEmailOptions): Promise<EmailSendResponse> {
  const response = await resend.emails.send(options)

  if (response.error) {
    return { error: { message: response.error.message } }
  }

  const { data } = response
  // Resend uses `null` for empty payloads; reject non-objects without a `null` literal.
  if (data === undefined || typeof data !== "object" || !(data instanceof Object)) {
    return {}
  }

  return { data }
}

/** Maps the email provider response into a null-free app result. */
export async function sendResendEmail(options: CreateEmailOptions, send: EmailSendFn = sendViaResend): Promise<ResendEmailResult> {
  const { data, error } = await send(options)

  if (error) {
    return { error: error.message, ok: false }
  }

  if (data?.id === undefined || data.id.length === 0) {
    return { error: "Resend returned no email id", ok: false }
  }

  return { id: data.id, ok: true }
}
