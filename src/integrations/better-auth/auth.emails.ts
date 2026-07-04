import "server-only"

import type { JSX } from "react"

import { createTranslator } from "next-intl"

import type { Locale } from "~/src/constants/types"

import { resolveLocaleFromAuthRequest } from "~/src/integrations/next-intl/i18n.locale"
import { ChangeEmailConfirmationEmail } from "~/src/integrations/resend/templates/change-email-confirmation"
import { ResetPasswordEmail } from "~/src/integrations/resend/templates/reset-password"
import { VerifyEmail } from "~/src/integrations/resend/templates/verify-email"

import { sendEmail } from "~/src/lib/_utils/email"

export const AUTH_EMAIL_KINDS = {
  RESET_PASSWORD: "resetPassword",
  VERIFY_EMAIL: "verifyEmail",
} as const

export type AuthEmailKind = (typeof AUTH_EMAIL_KINDS)[keyof typeof AUTH_EMAIL_KINDS]

interface BetterAuthEmailPayload {
  readonly token: string
  readonly url: string
  readonly user: { readonly email: string; readonly name: string }
}

interface ChangeEmailConfirmationPayload extends BetterAuthEmailPayload {
  readonly newEmail: string
}

interface AuthEmailRenderParams {
  readonly actionUrl: string
  readonly locale: Locale
  readonly name: string
}

interface AuthEmailRenderResult {
  readonly react: JSX.Element
  readonly subject: string
}

type AuthEmailRenderer = (params: Readonly<AuthEmailRenderParams>) => Promise<AuthEmailRenderResult>

async function loadMessages(locale: Locale) {
  const { default: messages } = await import(`~/src/integrations/next-intl/messages/${locale}.json`)

  return messages
}

async function renderResetPasswordEmail({ actionUrl, locale, name }: Readonly<AuthEmailRenderParams>): Promise<AuthEmailRenderResult> {
  const messages = await loadMessages(locale)
  const t = createTranslator({ locale, messages, namespace: "emails.resetPassword" })

  return {
    react: await ResetPasswordEmail({ locale, name, resetPasswordUrl: actionUrl }),
    subject: t("subject"),
  }
}

async function renderVerifyEmail({ actionUrl, locale, name }: Readonly<AuthEmailRenderParams>): Promise<AuthEmailRenderResult> {
  const messages = await loadMessages(locale)
  const t = createTranslator({ locale, messages, namespace: "emails.verifyEmail" })

  return {
    react: await VerifyEmail({ locale, name, verifyUrl: actionUrl }),
    subject: t("subject"),
  }
}

async function renderChangeEmailConfirmationEmail({
  actionUrl,
  locale,
  name,
  newEmail,
}: Readonly<AuthEmailRenderParams & { newEmail: string }>): Promise<AuthEmailRenderResult> {
  const messages = await loadMessages(locale)
  const t = createTranslator({ locale, messages, namespace: "emails.changeEmailConfirmation" })

  return {
    react: await ChangeEmailConfirmationEmail({ confirmUrl: actionUrl, locale, name, newEmail }),
    subject: t("subject"),
  }
}

const AUTH_EMAIL_RENDERERS = {
  [AUTH_EMAIL_KINDS.RESET_PASSWORD]: renderResetPasswordEmail,
  [AUTH_EMAIL_KINDS.VERIFY_EMAIL]: renderVerifyEmail,
} as const satisfies Record<AuthEmailKind, AuthEmailRenderer>

async function deliverAuthEmail(kind: AuthEmailKind, { user, url }: Readonly<BetterAuthEmailPayload>, request?: Request): Promise<void> {
  const locale = resolveLocaleFromAuthRequest(request, url)
  const { react, subject } = await AUTH_EMAIL_RENDERERS[kind]({ actionUrl: url, locale, name: user.name })
  const result = await sendEmail({ react, subject, to: user.email })

  if (!result.success) {
    console.error(`[Auth] Failed to send ${kind} email`, { email: user.email, error: result.error })
    throw new Error(result.error)
  }
}

async function sendResetPasswordEmail(payload: Readonly<BetterAuthEmailPayload>, request?: Request): Promise<void> {
  await deliverAuthEmail(AUTH_EMAIL_KINDS.RESET_PASSWORD, payload, request)
}

async function sendVerificationEmail(payload: Readonly<BetterAuthEmailPayload>, request?: Request): Promise<void> {
  await deliverAuthEmail(AUTH_EMAIL_KINDS.VERIFY_EMAIL, payload, request)
}

async function sendChangeEmailConfirmationEmail(payload: Readonly<ChangeEmailConfirmationPayload>, request?: Request): Promise<void> {
  const locale = resolveLocaleFromAuthRequest(request, payload.url)
  const { react, subject } = await renderChangeEmailConfirmationEmail({
    actionUrl: payload.url,
    locale,
    name: payload.user.name,
    newEmail: payload.newEmail,
  })
  const result = await sendEmail({ react, subject, to: payload.user.email })

  if (!result.success) {
    console.error("[Auth] Failed to send changeEmailConfirmation email", { email: payload.user.email, error: result.error })
    throw new Error(result.error)
  }
}

export const authEmailHandlers = {
  sendChangeEmailConfirmationEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
}
