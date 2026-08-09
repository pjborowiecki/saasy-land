import "server-only"

import type { JSX } from "react"

import { type Locale } from "~/src/integrations/next-intl/i18n.config"
import { resolveLocaleFromAuthRequest } from "~/src/integrations/next-intl/i18n.locale"
import { sendEmail } from "~/src/integrations/resend/resend.utils"

import {
  ChangeEmailConfirmationEmail as changeEmailConfirmationEmail,
  changeEmailConfirmationSubject,
} from "~/src/presentation/emails/change-email-confirmation.email-template"
import { ResetPasswordEmail as resetPasswordEmail, resetPasswordSubject } from "~/src/presentation/emails/reset-password.email-template"
import { VerifyEmail as verifyEmail, verifyEmailSubject } from "~/src/presentation/emails/verify-email.email-template"

interface AuthEmailPayload {
  readonly token: string
  readonly url: string
  readonly user: { readonly email: string; readonly name: string }
}

/** Adapts a localized template to Better Auth's `(payload, request)` email callback contract. */
function createAuthEmailHandler<Payload extends AuthEmailPayload>(
  kind: string,
  subject: (locale: Locale) => string,
  render: (payload: Readonly<Payload>, locale: Locale) => JSX.Element,
) {
  return async (payload: Readonly<Payload>, request?: Request): Promise<void> => {
    const locale = resolveLocaleFromAuthRequest(request, payload.url)

    await sendEmail({
      idempotencyKey: `${kind}/${payload.token}`,
      react: render(payload, locale),
      subject: subject(locale),
      to: payload.user.email,
    })
  }
}

export const authEmailHandlers = {
  sendChangeEmailConfirmationEmail: createAuthEmailHandler(
    "change-email-confirmation",
    changeEmailConfirmationSubject,
    (payload: Readonly<AuthEmailPayload & { readonly newEmail: string }>, locale) =>
      changeEmailConfirmationEmail({ confirmUrl: payload.url, locale, name: payload.user.name, newEmail: payload.newEmail }),
  ),
  sendResetPasswordEmail: createAuthEmailHandler("reset-password", resetPasswordSubject, (payload: Readonly<AuthEmailPayload>, locale) =>
    resetPasswordEmail({ locale, name: payload.user.name, resetPasswordUrl: payload.url }),
  ),
  sendVerificationEmail: createAuthEmailHandler("verify-email", verifyEmailSubject, (payload: Readonly<AuthEmailPayload>, locale) =>
    verifyEmail({ locale, name: payload.user.name, verifyUrl: payload.url }),
  ),
}
