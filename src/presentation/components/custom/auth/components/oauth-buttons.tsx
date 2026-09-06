import type { ComponentPropsWithoutRef, JSX } from "react"

import { cn } from "~/src/lib/cn"

import { OAuthButton } from "~/src/presentation/components/custom/auth/components/oauth-button"
import { Icons } from "~/src/presentation/components/custom/icons"

type OAuthButtonsProps = ComponentPropsWithoutRef<"div"> & { readonly intent?: "sign-in" | "sign-up" }

export const OAuthButtons = ({ className, intent = "sign-in", ...rest }: Readonly<OAuthButtonsProps>): JSX.Element => (
  <div className={cn("flex flex-col gap-3", className)} {...rest}>
    <OAuthButton intent={intent} provider="google" Icon={Icons.Google} />
    <OAuthButton intent={intent} provider="github" Icon={Icons.Github} />
  </div>
)
