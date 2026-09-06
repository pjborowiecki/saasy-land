import type { RefAttributes } from "react"

import {
  Button as ButtonPrimitive,
  type ButtonProps as ButtonPrimitiveProps,
  Link as LinkPrimitive,
  type LinkProps as LinkPrimitiveProps,
} from "react-aria-components"

import { cn } from "~/src/lib/cn"

import { type ButtonVariantProps, buttonVariants } from "~/src/presentation/components/shadcn/_lib/button-variants"

type ButtonProps = Omit<ButtonPrimitiveProps, "className"> &
  RefAttributes<HTMLButtonElement> &
  ButtonVariantProps & {
    className?: string
  }

const Button = ({ className, size = "default", variant = "default", ...props }: ButtonProps) => (
  <ButtonPrimitive
    className={cn(buttonVariants({ className, size, variant }))}
    data-size={size}
    data-slot="button"
    data-variant={variant}
    {...props}
  />
)

type LinkButtonProps = Omit<LinkPrimitiveProps, "className"> &
  ButtonVariantProps & {
    className?: string
  }

const LinkButton = ({ className, size = "default", variant = "default", ...props }: LinkButtonProps) => (
  <LinkPrimitive
    className={cn(buttonVariants({ className, size, variant }))}
    data-size={size}
    data-slot="button"
    data-variant={variant}
    {...props}
  />
)

export { buttonVariants, type ButtonVariantProps } from "~/src/presentation/components/shadcn/_lib/button-variants"
export { Button, LinkButton }
export type { ButtonProps, LinkButtonProps }
