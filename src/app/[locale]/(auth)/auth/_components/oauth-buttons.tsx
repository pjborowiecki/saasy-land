"use client"

import type { ComponentPropsWithoutRef, JSX } from "react"

import { cn } from "~/src/lib/utils"

import { Icons } from "~/src/components/custom/icons"

import { OAuthButton } from "~/src/app/[locale]/(auth)/auth/_components/oauth-button"

export function OAuthButtons({ className, ...rest }: Readonly<ComponentPropsWithoutRef<"div">>): JSX.Element {
  return (
    <div className={cn("flex flex-col gap-2", className)} {...rest}>
      <OAuthButton provider="google" Icon={Icons.Google} />
      <OAuthButton provider="github" Icon={Icons.Github} />
    </div>
  )
}
