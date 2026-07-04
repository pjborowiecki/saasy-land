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
      return { success: false, error: error.message }
    }

    if (!data?.id) {
      return { success: false, error: "Resend returned no email id" }
    }

    return { success: true, id: data.id }
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : "Unknown error sending email"
    return { success: false, error: message }
  }
}
