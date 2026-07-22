"use client"

import { type JSX, useCallback, useTransition } from "react"

import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { authClient } from "~/src/integrations/better-auth/auth.client"
import { authErrorKey } from "~/src/integrations/better-auth/auth.errors"
import type { auth } from "~/src/integrations/better-auth/auth.server"

import { cn } from "~/src/utils"

import { Button, type ButtonProps } from "~/src/presentation/components/shadcn/button"

import { ROUTES } from "~/src/routes"

const OAUTH_BUTTON_STYLES =
  "h-11 w-full gap-2 rounded-xl border-white/10 bg-white/5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-md hover:bg-white/10"

interface OAuthButtonProps extends Omit<ButtonProps, "children" | "type" | "variant"> {
  provider: keyof typeof auth.options.socialProviders
  Icon: (props: Readonly<{ className?: string }>) => JSX.Element
}

export function OAuthButton({ provider, Icon, className, ...rest }: Readonly<OAuthButtonProps>): JSX.Element {
  const [isPending, startTransition] = useTransition()
  const tAuth = useTranslations("auth")

  const handleSignIn = useCallback(() => {
    startTransition(async () => {
      await authClient.signIn.social({
        callbackURL: ROUTES.AUTH_CALLBACK,
        fetchOptions: {
          onError: (ctx) => {
            toast.error(tAuth(`errors.${authErrorKey(ctx.error)}`))
          },
          onSuccess: () => {
            toast.success(tAuth("oauth.success"))
          },
        },
        provider,
      })
    })
  }, [provider, startTransition, tAuth])

  return (
    <Button
      type="button"
      variant="outline"
      isDisabled={isPending}
      onPress={handleSignIn}
      id={`oauth-button-${provider}`}
      aria-label={tAuth(`oauth.${provider}`)}
      className={cn(OAUTH_BUTTON_STYLES, className)}
      {...rest}
    >
      {isPending ? <Loader2 className="size-4 animate-spin" /> : <Icon className="size-4" />}
      {tAuth(`oauth.${provider}`)}
    </Button>
  )
}
