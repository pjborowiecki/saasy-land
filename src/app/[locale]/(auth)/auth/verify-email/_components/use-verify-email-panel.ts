"use client"

import { type ChangeEvent, useCallback, useEffect, useRef, useState } from "react"

import { useLocale, useTranslations } from "next-intl"
import { toast } from "sonner"

import { getSession, sendVerificationEmail, verifyEmail } from "~/src/modules/identity-access/infrastructure/auth/auth._client"
import { hasAdminAccess } from "~/src/modules/identity-access/infrastructure/auth/auth.access"
import { authErrorKey } from "~/src/modules/identity-access/infrastructure/auth/auth.errors"

import { getPathname, useRouter } from "~/src/integrations/next-intl/i18n.navigation"

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
  const locale = useLocale()
  const t = useTranslations("pages.auth.verify-email")
  const tErrors = useTranslations("auth.errors")
  const [status, setStatus] = useState<VerifyEmailStatus>(token === undefined ? "pending" : "verifying")
  const [resendEmail, setResendEmail] = useState(email ?? "")
  const hasVerifiedRef = useRef(false)

  const redirectAfterVerification = useCallback(async () => {
    const { data: session } = await getSession()
    let href: string = ROUTES.APP

    if (hasAdminAccess(session?.user.role)) {
      href = ROUTES.ADMIN
    }

    router.push(getPathname({ href, locale }))
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
