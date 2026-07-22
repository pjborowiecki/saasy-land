import "server-only"

import { createTranslator } from "next-intl"

import { sendEmail } from "~/src/modules/identity-access/infrastructure/email/send-email"
import { ChangeEmailConfirmationEmail as changeEmailConfirmationEmailTemplate } from "~/src/modules/identity-access/infrastructure/email/templates/change-email-confirmation"
import { ResetPasswordEmail as resetPasswordEmailTemplate } from "~/src/modules/identity-access/infrastructure/email/templates/reset-password"
import { VerifyEmail as verifyEmailTemplate } from "~/src/modules/identity-access/infrastructure/email/templates/verify-email"

import { resolveLocaleFromAuthRequest } from "~/src/integrations/next-intl/i18n.locale"
import { loadLocaleMessagesFromDir } from "~/src/integrations/next-intl/i18n.utils"

interface BetterAuthEmailPayload {
  readonly token: string
  readonly url: string
  readonly user: { readonly email: string; readonly name: string }
}

interface ChangeEmailConfirmationPayload extends BetterAuthEmailPayload {
  readonly newEmail: string
}

async function sendResetPasswordEmail(payload: Readonly<BetterAuthEmailPayload>, request?: Request): Promise<void> {
  const locale = resolveLocaleFromAuthRequest(request, payload.url)
  const messages = loadLocaleMessagesFromDir(locale)
  const t = createTranslator({ locale, messages, namespace: "emails.resetPassword" })
  const react = resetPasswordEmailTemplate({
    locale,
    name: payload.user.name,
    resetPasswordUrl: payload.url,
  })
  const result = await sendEmail({
    react,
    subject: t("subject"),
    to: payload.user.email,
  })

  if (!result.success) {
    console.error("[Auth] Failed to send resetPassword email", {
      email: payload.user.email,
      error: result.error,
    })
    throw new Error(result.error)
  }
}

async function sendVerificationEmail(payload: Readonly<BetterAuthEmailPayload>, request?: Request): Promise<void> {
  const locale = resolveLocaleFromAuthRequest(request, payload.url)
  const messages = loadLocaleMessagesFromDir(locale)
  const t = createTranslator({ locale, messages, namespace: "emails.verifyEmail" })
  const react = verifyEmailTemplate({
    locale,
    name: payload.user.name,
    verifyUrl: payload.url,
  })
  const result = await sendEmail({
    react,
    subject: t("subject"),
    to: payload.user.email,
  })

  if (!result.success) {
    console.error("[Auth] Failed to send verifyEmail email", {
      email: payload.user.email,
      error: result.error,
    })
    throw new Error(result.error)
  }
}

async function sendChangeEmailConfirmationEmail(payload: Readonly<ChangeEmailConfirmationPayload>, request?: Request): Promise<void> {
  const locale = resolveLocaleFromAuthRequest(request, payload.url)
  const messages = loadLocaleMessagesFromDir(locale)
  const t = createTranslator({ locale, messages, namespace: "emails.changeEmailConfirmation" })
  const react = changeEmailConfirmationEmailTemplate({
    confirmUrl: payload.url,
    locale,
    name: payload.user.name,
    newEmail: payload.newEmail,
  })
  const result = await sendEmail({
    react,
    subject: t("subject"),
    to: payload.user.email,
  })

  if (!result.success) {
    console.error("[Auth] Failed to send changeEmailConfirmation email", {
      email: payload.user.email,
      error: result.error,
    })
    throw new Error(result.error)
  }
}

export const authEmailHandlers = {
  sendChangeEmailConfirmationEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
}
