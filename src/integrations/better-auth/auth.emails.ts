import "server-only"

import { resolveLocaleFromAuthRequest } from "~/src/integrations/next-intl/i18n.locale"
import { ChangeEmailConfirmationEmail as changeEmailConfirmationEmailTemplate } from "~/src/integrations/resend/templates/change-email-confirmation"
import { ResetPasswordEmail as resetPasswordEmailTemplate } from "~/src/integrations/resend/templates/reset-password"
import { VerifyEmail as verifyEmailTemplate } from "~/src/integrations/resend/templates/verify-email"

import { sendEmail } from "~/src/lib/_utils/email"
import { createRootTranslator, loadLocaleMessages } from "~/src/lib/_utils/i18n"

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
  const messages = await loadLocaleMessages(locale)
  const t = createRootTranslator(messages, locale)
  const react = await resetPasswordEmailTemplate({
    locale,
    name: payload.user.name,
    resetPasswordUrl: payload.url,
  })
  const result = await sendEmail({
    react,
    subject: t("emails.resetPassword.subject"),
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
  const messages = await loadLocaleMessages(locale)
  const t = createRootTranslator(messages, locale)
  const react = await verifyEmailTemplate({
    locale,
    name: payload.user.name,
    verifyUrl: payload.url,
  })
  const result = await sendEmail({
    react,
    subject: t("emails.verifyEmail.subject"),
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
  const messages = await loadLocaleMessages(locale)
  const t = createRootTranslator(messages, locale)
  const react = await changeEmailConfirmationEmailTemplate({
    confirmUrl: payload.url,
    locale,
    name: payload.user.name,
    newEmail: payload.newEmail,
  })
  const result = await sendEmail({
    react,
    subject: t("emails.changeEmailConfirmation.subject"),
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
