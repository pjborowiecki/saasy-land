import "@tanstack/react-start/server-only"

import { env } from "cloudflare:workers"

import type { JSX } from "react"

import { createEmailVerificationToken } from "better-auth/api"

import { sendEmail } from "~/src/integrations/resend/resend.utils"
import { type Locale } from "~/src/integrations/use-intl/i18n.config"
import { resolveLocaleFromAuthRequest } from "~/src/integrations/use-intl/i18n.locale"
import { localizePathname } from "~/src/integrations/use-intl/i18n.paths"

import { APP_URL } from "~/src/presentation/branding"
import {
  ChangeEmailConfirmationEmail as changeEmailConfirmationEmail,
  changeEmailConfirmationSubject,
} from "~/src/presentation/emails/change-email-confirmation.email-template"
import { ResetPasswordEmail as resetPasswordEmail, resetPasswordSubject } from "~/src/presentation/emails/reset-password.email-template"
import { VerifyEmail as verifyEmail, verifyEmailSubject } from "~/src/presentation/emails/verify-email.email-template"
import { ROUTES } from "~/src/routes"

interface AuthEmailPayload {
  readonly token: string
  readonly url: string
  readonly user: { readonly email: string; readonly name: string }
}

/** Adapts a localized template to Better Auth's `(payload, request)` email callback contract. */
const createAuthEmailHandler =
  <Payload extends AuthEmailPayload>(
    kind: string,
    subject: (locale: Locale) => string,
    render: (payload: Readonly<Payload>, locale: Locale) => JSX.Element,
  ) =>
  async (payload: Readonly<Payload>, request?: Request): Promise<void> => {
    const locale = resolveLocaleFromAuthRequest(request, payload.url)

    await sendEmail({
      idempotencyKey: `${kind}/${payload.token}`,
      react: render(payload, locale),
      subject: subject(locale),
      to: payload.user.email,
    })
  }

const appVerificationUrl = ({ locale, token, url }: Readonly<{ locale: Locale; token: string; url: string }>): string => {
  const target = new URL(localizePathname({ locale, pathname: ROUTES.VERIFY_EMAIL }), url)
  target.searchParams.set("token", token)

  return target.toString()
}

const sendVerificationEmail = createAuthEmailHandler("verify-email", verifyEmailSubject, (payload: Readonly<AuthEmailPayload>, locale) =>
  verifyEmail({
    locale,
    name: payload.user.name,
    verifyUrl: appVerificationUrl({ locale, token: payload.token, url: payload.url }),
  }),
)

const signUpActionUrl = async (request?: Request): Promise<URL> => {
  const url = new URL(request?.url ?? APP_URL)
  const body: unknown = await request?.json().catch(() => {})
  if (typeof body === "object" && body !== null && "callbackURL" in body && typeof body.callbackURL === "string") {
    url.searchParams.set("callbackURL", body.callbackURL)
  }
  return url
}

// Better Auth deliberately returns generic success for duplicate signups; unverified users still need a usable link.
const sendExistingUserVerificationEmail = async (
  { user }: Readonly<{ user: AuthEmailPayload["user"] & { readonly emailVerified: boolean } }>,
  request?: Request,
): Promise<void> => {
  if (user.emailVerified) {
    return
  }
  const actionUrl = await signUpActionUrl(request)
  const locale = resolveLocaleFromAuthRequest(request, actionUrl.toString())
  const url = new URL(localizePathname({ locale, pathname: ROUTES.VERIFY_EMAIL }), actionUrl.origin).toString()
  const token = await createEmailVerificationToken(env.AUTH_SECRET, user.email)
  await sendVerificationEmail({ token, url, user }, request)
}

export const authEmailHandlers = {
  sendChangeEmailConfirmationEmail: createAuthEmailHandler(
    "change-email-confirmation",
    changeEmailConfirmationSubject,
    (payload: Readonly<AuthEmailPayload & { readonly newEmail: string }>, locale) =>
      changeEmailConfirmationEmail({ confirmUrl: payload.url, locale, name: payload.user.name, newEmail: payload.newEmail }),
  ),
  sendExistingUserVerificationEmail,
  sendResetPasswordEmail: createAuthEmailHandler("reset-password", resetPasswordSubject, (payload: Readonly<AuthEmailPayload>, locale) =>
    resetPasswordEmail({ locale, name: payload.user.name, resetPasswordUrl: payload.url }),
  ),
  sendVerificationEmail,
}
