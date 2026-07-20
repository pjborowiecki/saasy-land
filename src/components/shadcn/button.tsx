"use client"

import type { RefAttributes } from "react"

import {
  Button as ButtonPrimitive,
  Link as LinkPrimitive,
  type ButtonProps as ButtonPrimitiveProps,
  type LinkProps as LinkPrimitiveProps,
} from "react-aria-components"

import { cn } from "~/src/lib/utils"

import { buttonVariants, type ButtonVariantProps } from "~/src/components/shadcn/_lib/button-variants"

type ButtonProps = Omit<ButtonPrimitiveProps, "className"> &
  RefAttributes<HTMLButtonElement> &
  ButtonVariantProps & {
    className?: string
  }

function Button({ className, size = "default", variant = "default", ...props }: ButtonProps) {
  return (
    <ButtonPrimitive
      className={cn(buttonVariants({ className, size, variant }))}
      data-size={size}
      data-slot="button"
      data-variant={variant}
      {...props}
    />
  )
}

type LinkButtonProps = Omit<LinkPrimitiveProps, "className"> &
  ButtonVariantProps & {
    className?: string
  }

function LinkButton({ className, size = "default", variant = "default", ...props }: LinkButtonProps) {
  return (
    <LinkPrimitive
      className={cn(buttonVariants({ className, size, variant }))}
      data-size={size}
      data-slot="button"
      data-variant={variant}
      {...props}
    />
  )
}

export { Button, LinkButton }
export type { ButtonProps, LinkButtonProps }
export { buttonVariants, type ButtonVariantProps } from "~/src/components/shadcn/_lib/button-variants"
