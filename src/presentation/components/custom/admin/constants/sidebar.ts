import { BarChart, BookOpen, CreditCard, Home, MonitorSmartphone, Package, Settings, Tags, Users } from "lucide-react"

import { ROUTES } from "~/src/routes"

export const SIDEBAR_CONFIG = [
  {
    items: [
      { icon: Home, titleKey: "dashboard", url: ROUTES.ADMIN },
      { icon: BarChart, titleKey: "analytics", url: ROUTES.ADMIN_ANALYTICS },
    ],
    titleKey: "overview",
  },
  {
    items: [
      { icon: Package, titleKey: "products", url: ROUTES.ADMIN_PRODUCTS },
      { icon: Tags, titleKey: "pricingModels", url: ROUTES.ADMIN_PRICING },
    ],
    titleKey: "offerings",
  },
  {
    items: [
      { icon: BookOpen, titleKey: "blog", url: ROUTES.ADMIN_BLOG },
      { icon: MonitorSmartphone, titleKey: "landingPage", url: ROUTES.ADMIN_LANDING_PAGE },
    ],
    titleKey: "content",
  },
  {
    items: [
      { icon: Users, titleKey: "userManagement", url: ROUTES.ADMIN_USERS },
      { icon: CreditCard, titleKey: "payments", url: ROUTES.ADMIN_PAYMENTS },
      { icon: Settings, titleKey: "settings", url: ROUTES.ADMIN_SETTINGS },
    ],
    titleKey: "administration",
  },
] as const

export type SidebarNavItem = (typeof SIDEBAR_CONFIG)[number]["items"][number]
