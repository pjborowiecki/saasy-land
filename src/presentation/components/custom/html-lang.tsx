"use client"

import { useEffect } from "react"

/**
 * Sets `<html lang>` after locale params resolve inside Suspense.
 * Keeps the root layout sync so Cache Components can prerender a static shell.
 */
export function HtmlLang({ locale }: Readonly<{ locale: string }>): undefined {
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])
}
