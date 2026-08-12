import { connection } from "next/server"
import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

export async function FooterCopyright(): Promise<JSX.Element> {
  // Reading the clock is dynamic; awaiting connection() declares that intent so the build
  // stops flagging `new Date()` as accidental dynamic usage under cacheComponents.
  await connection()
  const t = await getTranslations("common")

  return <span className="ml-2 text-xs text-muted-foreground">{t("copyright", { year: new Date().getFullYear() })}</span>
}
