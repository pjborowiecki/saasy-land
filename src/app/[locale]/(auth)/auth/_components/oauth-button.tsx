"use client"

import { type ComponentPropsWithoutRef, type ComponentType, type JSX, type SVGProps, useTransition } from "react"

import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { CONSTANTS } from "~/src/constants"

import { authClient } from "~/src/integrations/better-auth/auth._client"
import type { auth } from "~/src/integrations/better-auth/auth._server"
import { AUTH_ERRORS } from "~/src/integrations/better-auth/auth.errors"

import { cn } from "~/src/lib/utils"

import { Button } from "~/src/components/shadcn/button"

const OAUTH_BUTTON_STYLES =
  "h-11 w-full gap-2 rounded-xl border-white/10 bg-white/5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-md hover:bg-white/10"

interface OAuthButtonProps extends ComponentPropsWithoutRef<"button"> {
  provider: keyof typeof auth.options.socialProviders
  label: string
  Icon: ComponentType<SVGProps<SVGElement>>
}

export function OAuthButton({ provider, label, Icon, className, ...rest }: Readonly<OAuthButtonProps>): JSX.Element {
  const [isPending, startTransition] = useTransition()
  const t = useTranslations()

  function handleSignIn() {
    startTransition(async () => {
      await authClient.signIn.social({
        provider,
        callbackURL: CONSTANTS.ROUTES.AUTH_CALLBACK,
        fetchOptions: {
          onError: (ctx) => {
            const key = AUTH_ERRORS[ctx.error.code as keyof typeof AUTH_ERRORS] ?? AUTH_ERRORS.UNKNOWN_ERROR
            toast.error(t(`auth.errors.${key}`))
          },
          onSuccess: () => {
            toast.success(t("auth.oAuth.success"))
          },
        },
      })
    })
  }

  return (
    <Button
      type="button"
      variant="outline"
      disabled={isPending}
      onClick={handleSignIn}
      id={`oauth-button-${provider}`}
      aria-label={t(`auth.oAuth.${provider}`)}
      className={cn(OAUTH_BUTTON_STYLES, className)}
      {...rest}
    >
      {isPending ? <Loader2 className="size-4 animate-spin" /> : <Icon className="size-4" />}
      {label}
    </Button>
  )
}
