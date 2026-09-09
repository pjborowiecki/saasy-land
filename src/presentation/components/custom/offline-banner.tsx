import { type JSX, useEffect, useState } from "react"

import { useTranslations } from "use-intl/react"

export const OfflineBanner = (): JSX.Element | undefined => {
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

  if (!isOffline) {
    return undefined
  }

  return (
    <output className="sticky top-0 z-100 block w-full bg-amber-500/15 px-4 py-2 text-center text-sm text-foreground backdrop-blur-sm">
      {t("message")}
    </output>
  )
}
