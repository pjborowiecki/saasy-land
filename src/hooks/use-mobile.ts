import { useEffect, useState } from "react"

const MOBILE_BREAKPOINT = 768
const LARGEST_MOBILE_WIDTH_OFFSET = 1

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mql = globalThis.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - LARGEST_MOBILE_WIDTH_OFFSET}px)`)

    const syncIsMobileFromViewport = () => {
      setIsMobile(globalThis.innerWidth < MOBILE_BREAKPOINT)
    }

    mql.addEventListener("change", syncIsMobileFromViewport)
    syncIsMobileFromViewport()

    return function unsubscribeFromMobileBreakpointChanges() {
      mql.removeEventListener("change", syncIsMobileFromViewport)
    }
  }, [])

  return isMobile
}
