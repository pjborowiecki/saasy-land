import { notFound } from "next/navigation"
import type { JSX } from "react"

import { hasLocale } from "next-intl"

import { CONSTANTS } from "~/src/constants"

export default async function BlogLayout({ children, params }: Readonly<LayoutProps<"/[locale]/blog">>): Promise<JSX.Element> {
  const { locale } = await params

  if (!hasLocale(CONSTANTS.I18N.LOCALES, locale)) notFound()

  return <>{children}</>
}
