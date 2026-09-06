import type { JSX } from "react"

import { Check } from "lucide-react"
export const TierFeature = ({ label }: Readonly<{ label: string }>): JSX.Element => (
  <li className="flex items-start gap-3">
    <Check aria-hidden className="mt-0.5 size-3.5 shrink-0 text-ring" strokeWidth={2.25} />
    <span className="text-body-sm text-pretty text-muted-foreground">{label}</span>
  </li>
)
