"use client"

import { type JSX, type ReactNode, useState } from "react"

import { Badge } from "~/src/components/shadcn/badge"
import { Switch } from "~/src/components/shadcn/switch"

export function PricingBillingShell({
  children,
  monthlyLabel,
  save20Label,
  yearlyLabel,
}: {
  children: ReactNode
  monthlyLabel: string
  save20Label: string
  yearlyLabel: string
}): JSX.Element {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <>
      <div className="mb-16 flex items-center justify-center gap-4">
        <span className="text-sm font-medium text-muted-foreground">{monthlyLabel}</span>
        <Switch isSelected={isYearly} onChange={setIsYearly} />
        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
          {yearlyLabel}
          <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
            {save20Label}
          </Badge>
        </span>
      </div>

      <div className="group/pricing" data-billing={isYearly ? "yearly" : "monthly"}>
        {children}
      </div>
    </>
  )
}
