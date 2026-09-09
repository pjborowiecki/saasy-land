import { Home, KeyRound } from "lucide-react"

import { ROUTES } from "~/src/routes"

export const APP_NAVIGATION = [
  { icon: Home, label: "overview", url: ROUTES.APP },
  { icon: KeyRound, label: "license", url: ROUTES.APP_LICENSE },
] as const
