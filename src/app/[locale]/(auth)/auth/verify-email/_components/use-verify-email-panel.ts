"use client"

import { type ChangeEvent, useCallback, useEffect, useRef, useState } from "react"

import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { sendVerificationEmail } from "~/src/modules/verification/use-cases/send-verification-email.use-case"
import { verifyEmail } from "~/src/modules/verification/use-cases/verify-email.use-case"

import { useRouter } from "~/src/integrations/next-intl/i18n.navigation"

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

      if (result.serverError) {
        setStatus("error")
        toast.error(result.serverError.message)
        return
      }

      setStatus("success")
      toast.success(t("form.success"))
      await redirectAfterAuth()
    })()
  }, [redirectAfterAuth, t, token])

  const handleResend = useCallback(async () => {
    if (resendEmail.length === 0) {
      toast.error(t("form.emailRequired"))
      return
    }

    const result = await sendVerificationEmail({ email: resendEmail })

    if (result.serverError) {
      toast.error(result.serverError.message)
      return
    }

    toast.success(t("form.resendSuccess"))
  }, [resendEmail, t])

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
