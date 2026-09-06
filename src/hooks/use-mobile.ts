import { useEffect, useState } from "react"

const MOBILE_BREAKPOINT = 768
const MOBILE_MEDIA_OFFSET = 1

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState<boolean | undefined>()

  useEffect(() => {
    const mql = globalThis.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - MOBILE_MEDIA_OFFSET}px)`)

    const syncIsMobileFromViewport = () => {
      setIsMobile(globalThis.innerWidth < MOBILE_BREAKPOINT)
    }

    mql.addEventListener("change", syncIsMobileFromViewport)
    syncIsMobileFromViewport()

    return function unsubscribeFromMobileBreakpointChanges() {
      mql.removeEventListener("change", syncIsMobileFromViewport)
    }
  }, [])

  return Boolean(isMobile)
}
