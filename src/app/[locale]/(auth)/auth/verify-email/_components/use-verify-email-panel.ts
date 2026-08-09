"use client"

import { type ChangeEvent, useCallback, useEffect, useRef, useState } from "react"

import { useLocale, useTranslations } from "next-intl"
import { toast } from "sonner"

import { env } from "~/src/platform/env"

import { sendVerificationEmail } from "~/src/modules/verification/use-cases/send-verification-email.use-case"
import { verifyEmail } from "~/src/modules/verification/use-cases/verify-email.use-case"

import { getPathname, useRouter } from "~/src/integrations/next-intl/i18n.navigation"

import { useActionError } from "~/src/hooks/use-action-error"
import { usePostAuthRedirect } from "~/src/hooks/use-post-auth-redirect"

import { ROUTES } from "~/src/routes"

export type VerifyEmailStatus = "error" | "pending" | "success" | "verifying"

interface UseVerifyEmailPanelOptions {
  readonly email?: string
  readonly token?: string
}

interface UseVerifyEmailPanelResult {
  readonly handleBackToSignIn: () => void
  readonly handleContinue: () => void
  readonly handleEmailChange: (event: ChangeEvent<HTMLInputElement>) => void
  readonly handleResendClick: () => void
  readonly resendEmail: string
  readonly status: VerifyEmailStatus
  readonly t: ReturnType<typeof useTranslations<"pages.auth.verify-email">>
}

export function useVerifyEmailPanel({ email, token }: Readonly<UseVerifyEmailPanelOptions>): UseVerifyEmailPanelResult {
  const router = useRouter()
  const t = useTranslations("pages.auth.verify-email")
  const locale = useLocale()
  const actionError = useActionError()
  const redirectAfterAuth = usePostAuthRedirect()
  const [status, setStatus] = useState<VerifyEmailStatus>(token === undefined ? "pending" : "verifying")
  const [resendEmail, setResendEmail] = useState(email ?? "")
  const hasVerifiedRef = useRef(false)

  useEffect(() => {
    if (token === undefined || hasVerifiedRef.current) {
      return
    }

    hasVerifiedRef.current = true
    setStatus("verifying")

    void (async () => {
      const result = await verifyEmail({ token })

      const error = actionError(result)

      if (error) {
        setStatus("error")
        toast.error(error)
        return
      }

      setStatus("success")
      toast.success(t("form.success"))
      await redirectAfterAuth()
    })()
  }, [actionError, redirectAfterAuth, t, token])

  const handleResend = useCallback(async () => {
    if (resendEmail.length === 0) {
      toast.error(t("form.emailRequired"))
      return
    }

    const callbackURL = `${env.NEXT_PUBLIC_APP_URL}${getPathname({ href: ROUTES.APP, locale })}`
    const result = await sendVerificationEmail({ callbackURL, email: resendEmail })

    const error = actionError(result)

    if (error) {
      toast.error(error)
      return
    }

    toast.success(t("form.resendSuccess"))
  }, [actionError, locale, resendEmail, t])

  const handleContinue = useCallback(() => {
    void redirectAfterAuth()
  }, [redirectAfterAuth])

  const handleResendClick = useCallback(() => {
    void handleResend()
  }, [handleResend])

  const handleEmailChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setResendEmail(event.currentTarget.value)
  }, [])

  const handleBackToSignIn = useCallback(() => {
    router.push(ROUTES.SIGN_IN)
  }, [router])

  return {
    handleBackToSignIn,
    handleContinue,
    handleEmailChange,
    handleResendClick,
    resendEmail,
    status,
    t,
  }
}
