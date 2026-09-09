import type { JSX } from "react"

import { useTranslations } from "use-intl/react"

const ASSURANCE_IDS = ["coverage", "pricing", "ownership"] as const

export const AuthGateFrame = ({ isSignUp = false }: Readonly<{ isSignUp?: boolean }>): JSX.Element => {
  const t = useTranslations("auth.gate")

  return (
    <div className="relative hidden flex-col justify-between overflow-hidden border-r border-border bg-background p-12 lg:flex xl:p-16">
      <div aria-hidden className="field-grid pointer-events-none absolute inset-0" />

      <p className="relative max-w-md text-display-gate text-balance text-foreground">{t(isSignUp ? "signUpHeadline" : "headline")}</p>

      <ul className="relative flex flex-col gap-5">
        {ASSURANCE_IDS.map((id) => (
          <li className="flex items-start gap-3" key={id}>
            <span aria-hidden className="mt-2 size-1.25 shrink-0 rounded-xs bg-ring" />
            <span className="font-mono text-spec text-muted-foreground">{t(`assurances.${id}`)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
