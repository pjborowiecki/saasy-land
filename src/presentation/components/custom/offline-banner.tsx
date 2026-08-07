"use client"

import { useOffline } from "next/offline"
import type { JSX } from "react"

import { useTranslations } from "next-intl"

/**
 * `experimental.useOffline` keeps a failed navigation, RSC fetch, or Server Action
 * pending and retries it on reconnect, rather than throwing. Without this banner that
 * looks identical to a slow server, so the user gets no explanation for the wait.
 */
export function OfflineBanner(): JSX.Element | undefined {
  const t = useTranslations("components.custom.offline-banner")
  const isOffline = useOffline()

  if (!isOffline) {
    return undefined
  }

  return (
    <output className="sticky top-0 z-100 block w-full bg-amber-500/15 px-4 py-2 text-center text-sm text-foreground backdrop-blur-sm">
      {t("message")}
    </output>
  )
}
