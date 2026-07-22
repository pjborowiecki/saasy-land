"use client"

import { use, type ComponentProps } from "react"

import { OTPInput, OTPInputContext } from "input-otp"
import { MinusIcon } from "lucide-react"

import { cn } from "~/src/presentation/utils"

function InputOTP({
  className,
  containerClassName,
  ...props
}: ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  return (
    <OTPInput
      className={cn("disabled:cursor-not-allowed", className)}
      containerClassName={cn("cn-input-otp flex items-center has-disabled:opacity-50", containerClassName)}
      data-slot="input-otp"
      spellCheck={false}
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center rounded-lg has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40",
        className,
      )}
      data-slot="input-otp-group"
      {...props}
    />
  )
}

function InputOTPSlot({
  className,
  index,
  ...props
}: ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = use(OTPInputContext)
  const slot = inputOTPContext.slots[index]
  const char = slot?.char
  const hasFakeCaret = slot?.hasFakeCaret
  const isActive = slot?.isActive

  return (
    <div
      className={cn(
        "relative flex size-8 items-center justify-center border-y border-r border-input text-sm transition-all outline-none first:rounded-l-lg first:border-l last:rounded-r-lg aria-invalid:border-destructive data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-3 data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-destructive/20 dark:bg-input/30 dark:data-[active=true]:aria-invalid:ring-destructive/40",
        className,
      )}
      data-active={isActive}
      data-slot="input-otp-slot"
      {...props}
    >
      {char}
      {hasFakeCaret === true ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      ) : undefined}
    </div>
  )
}

function InputOTPSeparator({ ...props }: ComponentProps<"div">) {
  return (
    <div aria-hidden="true" className="flex items-center [&_svg:not([class*='size-'])]:size-4" data-slot="input-otp-separator" {...props}>
      <MinusIcon />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot }
