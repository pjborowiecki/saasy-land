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

import { AUTH_SECONDARY_BUTTON_CLASS } from "~/src/app/[locale]/(auth)/auth/_constants/auth-styles"
import { ROUTES } from "~/src/routes"

/*
 * Hairline, never a fill: the one filled surface on each page belongs to the submit.
 * The marks keep their own brand colours because Google and GitHub are identity, not
 * decoration, and they lead the label from the left edge so both buttons align on one
 * vertical.
 */
const OAUTH_BUTTON_STYLES = "justify-start px-4"

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
      className={cn(AUTH_SECONDARY_BUTTON_CLASS, OAUTH_BUTTON_STYLES, className)}
      {...rest}
    >
      {isPending ? <Loader2 aria-hidden className="size-4 animate-spin" strokeWidth={1.5} /> : <Icon className="size-4" />}
      {tAuth(`oauth.${provider}`)}
    </Button>
  )
}
