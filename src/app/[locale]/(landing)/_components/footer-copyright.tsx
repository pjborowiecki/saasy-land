"use client"

import type { JSX } from "react"

import { useTranslations } from "next-intl"

export function FooterCopyright(): JSX.Element {
  const t = useTranslations("common")
  const year = new Date().getFullYear()

  return <span className="ml-2 text-xs text-muted-foreground">{t("copyright", { year })}</span>
}
