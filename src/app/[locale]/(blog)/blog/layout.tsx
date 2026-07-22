import { notFound } from "next/navigation"
import type React from "react"

import { hasLocale } from "next-intl"

import { I18N } from "~/src/integrations/next-intl/i18n.config"

export default async function BlogLayout({ children, params }: Readonly<LayoutProps<"/[locale]/blog">>): Promise<React.ReactNode> {
  const { locale } = await params

  if (!hasLocale(I18N.LOCALES, locale)) {
    notFound()
  }

  return children
}
