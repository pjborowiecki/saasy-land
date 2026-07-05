import "server-only"

import type { JSX } from "react"

import { env } from "~/src/environment"

import { CONSTANTS } from "~/src/constants"

import { resend } from "~/src/integrations/resend/resend.config"

interface SendEmailOptions {
  readonly from?: string
  readonly react: JSX.Element
  readonly subject: string
  readonly to: string
}

export type SendEmailResult = { readonly success: true; readonly id: string } | { readonly success: false; readonly error: string }

export async function sendEmail({ from, react, subject, to }: Readonly<SendEmailOptions>): Promise<SendEmailResult> {
  const fromEmail = from ?? `${CONSTANTS.APP_NAME} <${env.RESEND_EMAIL_FROM}>`

  try {
    const { data, error } = await resend.emails.send({ from: fromEmail, react, subject, to })

    if (error) {
      return { error: error.message, success: false }
    }

    if (!data?.id) {
      return { error: "Resend returned no email id", success: false }
    }

    return { id: data.id, success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error sending email"
    return { error: message, success: false }
  }
}
