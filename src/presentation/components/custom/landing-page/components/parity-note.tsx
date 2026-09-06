import type { JSX } from "react"

import { useTranslations } from "use-intl/react"

export const ParityNote = (): JSX.Element => {
  const t = useTranslations("pages.landing.pricing")

  return (
    <p className="mt-4 min-h-6 text-body-sm text-ring">
      <span className="ppp-note">{t("pppActive")}</span>
    </p>
  )
}
