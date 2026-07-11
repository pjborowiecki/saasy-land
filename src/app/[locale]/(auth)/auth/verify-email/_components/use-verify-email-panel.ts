"use client"

import { type ChangeEvent, useCallback, useEffect, useRef, useState } from "react"

import { useLocale, useTranslations } from "next-intl"
import { toast } from "sonner"

import { CONSTANTS } from "~/src/constants"

import { getSession, sendVerificationEmail, verifyEmail } from "~/src/integrations/better-auth/auth._client"
import { getPostAuthRedirect } from "~/src/integrations/better-auth/auth.access"
import { authErrorKey } from "~/src/integrations/better-auth/auth.errors"
import { getPathname, useRouter } from "~/src/integrations/next-intl/i18n.navigation"

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
  const locale = useLocale()
  const t = useTranslations("pages.auth.verify-email")
  const tErrors = useTranslations("auth.errors")
  const [status, setStatus] = useState<VerifyEmailStatus>(token === undefined ? "pending" : "verifying")
  const [resendEmail, setResendEmail] = useState(email ?? "")
  const hasVerifiedRef = useRef(false)

  const redirectAfterVerification = useCallback(async () => {
    const { data: session } = await getSession()
    router.push(
      getPathname({
        href: getPostAuthRedirect(session?.user.role),
        locale,
      }),
    )
  }, [locale, router])

  useEffect(() => {
    if (token === undefined || hasVerifiedRef.current) {
      return
    }

    hasVerifiedRef.current = true
    setStatus("verifying")

    void verifyEmail({
      fetchOptions: {
        onError: (ctx) => {
          setStatus("error")
          toast.error(tErrors(authErrorKey(ctx.error)))
        },
        onSuccess: async () => {
          setStatus("success")
          toast.success(t("form.success"))
          await redirectAfterVerification()
        },
      },
      query: { token },
    })
  }, [redirectAfterVerification, t, tErrors, token])

  const handleResend = useCallback(async () => {
    if (resendEmail.length === 0) {
      toast.error(t("form.emailRequired"))
      return
    }

    await sendVerificationEmail({
      email: resendEmail,
      fetchOptions: {
        onError: (ctx) => {
          toast.error(tErrors(authErrorKey(ctx.error)))
        },
        onSuccess: () => {
          toast.success(t("form.resendSuccess"))
        },
      },
    })
  }, [resendEmail, t, tErrors])

  const handleContinue = useCallback(() => {
    void redirectAfterVerification()
  }, [redirectAfterVerification])

  const handleResendClick = useCallback(() => {
    void handleResend()
  }, [handleResend])

  const handleEmailChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setResendEmail(event.currentTarget.value)
  }, [])

  const handleBackToSignIn = useCallback(() => {
    router.push(CONSTANTS.ROUTES.SIGN_IN)
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
