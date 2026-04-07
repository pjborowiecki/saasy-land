import { useEffect, useState } from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)

  useEffect(function subscribeToMobileBreakpointChanges() {
    const mql = globalThis.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    function syncIsMobileFromViewport() {
      setIsMobile(globalThis.innerWidth < MOBILE_BREAKPOINT)
    }

    mql.addEventListener("change", syncIsMobileFromViewport)
    syncIsMobileFromViewport()

    return function unsubscribeFromMobileBreakpointChanges() {
      mql.removeEventListener("change", syncIsMobileFromViewport)
    }
  }, [])

  return !!isMobile
}
