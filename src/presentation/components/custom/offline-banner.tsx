"use client"

import { type JSX, useEffect, useState } from "react"

import { useTranslations } from "next-intl"

/**
 * Offline notice, self-contained.
 *
 * This used to read `useOffline()` from `next/offline`, which required
 * `experimental.useOffline` — a router mode that holds a failed navigation, RSC fetch or Server
 * Action *pending for retry rather than surfacing it*. In production that turned every failed
 * fetch — an auth wall, a half-deployed build, a flaky network — into a click that changed the
 * URL and then did nothing, with no error anywhere. An offline banner is not worth that trade:
 * the browser's own online/offline events cover the banner's actual job.
 */
export function OfflineBanner(): JSX.Element | undefined {
  const t = useTranslations("components.custom.offline-banner")
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    setIsOffline(!navigator.onLine)

    const handleOffline = (): void => {
      setIsOffline(true)
    }
    const handleOnline = (): void => {
      setIsOffline(false)
    }

    globalThis.addEventListener("offline", handleOffline)
    globalThis.addEventListener("online", handleOnline)

    return () => {
      globalThis.removeEventListener("offline", handleOffline)
      globalThis.removeEventListener("online", handleOnline)
    }
  }, [])

  /*
   * One-time recovery for browsers the retired offline mode already touched.
   *
   * Its machinery persists in site data and keeps interfering with navigation long after the
   * flag is gone, surviving reloads and new deployments. Unregistering every service worker and
   * dropping CacheStorage restores a clean slate; in an untouched browser both loops are empty
   * and this is a no-op. Failures are swallowed because recovery must never be louder than the
   * disease.
   */
  useEffect(() => {
    const recover = async (): Promise<void> => {
      try {
        const registrations = (await navigator.serviceWorker?.getRegistrations()) ?? []
        await Promise.all(registrations.map((registration) => registration.unregister()))

        const cacheKeys = (await globalThis.caches?.keys()) ?? []
        await Promise.all(cacheKeys.map((key) => globalThis.caches.delete(key)))
      } catch {
        // Recovery is best-effort by design.
      }
    }
    void recover()
  }, [])

  if (!isOffline) {
    return undefined
  }

  return (
    <output className="sticky top-0 z-100 block w-full bg-amber-500/15 px-4 py-2 text-center text-sm text-foreground backdrop-blur-sm">
      {t("message")}
    </output>
  )
}
