import { type JSX, useCallback, useTransition } from "react"

import { createClientOnlyFn } from "@tanstack/react-start"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useTranslations } from "use-intl/react"

import { authClient } from "~/src/integrations/better-auth/auth.client"
import { authErrorKey } from "~/src/integrations/better-auth/auth.errors"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import { localizePathname } from "~/src/integrations/use-intl/i18n.paths"
import { getCurrentLocale } from "~/src/integrations/use-intl/i18n.utils"

import { cn } from "~/src/lib/cn"

import { Button, type ButtonProps } from "~/src/presentation/components/shadcn/button"

import { AUTH_SECONDARY_BUTTON_CLASS } from "~/src/presentation/components/custom/auth/constants/auth-styles"

import { ROUTES } from "~/src/routes"

/*
 * Hairline, never a fill: the one filled surface on each page belongs to the submit.
 * The marks keep their own brand colours because Google and GitHub are identity, not
 * decoration, and they lead the label from the left edge so both buttons align on one
 * vertical.
 */
const OAUTH_BUTTON_STYLES = "justify-start px-4"
const OAUTH_PROVIDER_NAMES = { github: "GitHub", google: "Google" } as const

interface OAuthButtonProps extends Omit<ButtonProps, "children" | "type" | "variant"> {
  intent?: "sign-in" | "sign-up"
  provider: keyof typeof auth.options.socialProviders
  Icon: (props: Readonly<{ className?: string }>) => JSX.Element
}

const signInSocial = createClientOnlyFn((data: Parameters<typeof authClient.signIn.social>[0]) => authClient.signIn.social(data))

export const OAuthButton = ({ provider, Icon, className, intent = "sign-in", ...rest }: Readonly<OAuthButtonProps>): JSX.Element => {
  const [isPending, startTransition] = useTransition()
  const tAuth = useTranslations("auth")
  const label =
    intent === "sign-up" ? tAuth("oauth.continueWith", { provider: OAUTH_PROVIDER_NAMES[provider] }) : tAuth(`oauth.${provider}`)

  const handleSignIn = useCallback(() => {
    startTransition(async () => {
      await signInSocial({
        callbackURL: localizePathname({ locale: getCurrentLocale(), pathname: ROUTES.AUTH_CALLBACK }),
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
      aria-label={label}
      className={cn(AUTH_SECONDARY_BUTTON_CLASS, OAUTH_BUTTON_STYLES, className)}
      {...rest}
    >
      {isPending ? <Loader2 aria-hidden className="size-4 animate-spin" strokeWidth={1.5} /> : <Icon className="size-4" />}
      {label}
    </Button>
  )
}
