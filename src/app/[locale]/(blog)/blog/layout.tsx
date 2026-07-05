import { notFound } from "next/navigation"
import type React from "react"

import { hasLocale } from "next-intl"

import { CONSTANTS } from "~/src/constants"

export default async function BlogLayout({ children, params }: Readonly<LayoutProps<"/[locale]/blog">>): Promise<React.ReactNode> {
  const { locale } = await params

  if (!hasLocale(CONSTANTS.I18N.LOCALES, locale)) {
    notFound()
  }

  return children
}
