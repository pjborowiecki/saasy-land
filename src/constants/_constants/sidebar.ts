import { BarChart, BookOpen, CreditCard, Home, MonitorSmartphone, Package, Settings, ShieldAlert, Tags, Users } from "lucide-react"

import { ROUTES } from "./routes"

export const SIDEBAR_CONFIG = [
  {
    titleKey: "overview",
    items: [
      { titleKey: "dashboard", url: ROUTES.ADMIN, icon: Home },
      { titleKey: "analytics", url: ROUTES.ADMIN_ANALYTICS, icon: BarChart },
    ],
  },
  {
    titleKey: "offerings",
    items: [
      { titleKey: "products", url: ROUTES.ADMIN_PRODUCTS, icon: Package },
      { titleKey: "pricingModels", url: ROUTES.ADMIN_PRICING, icon: Tags },
    ],
  },
  {
    titleKey: "content",
    items: [
      { titleKey: "blog", url: ROUTES.ADMIN_BLOG, icon: BookOpen },
      { titleKey: "landingPage", url: ROUTES.ADMIN_LANDING_PAGE, icon: MonitorSmartphone },
    ],
  },
  {
    titleKey: "administration",
    items: [
      { titleKey: "userManagement", url: ROUTES.ADMIN_USERS, icon: Users },
      { titleKey: "activeSessions", url: ROUTES.ADMIN_SESSIONS, icon: ShieldAlert, badgeKey: "activeSessionsBadge" },
      { titleKey: "payments", url: ROUTES.ADMIN_PAYMENTS, icon: CreditCard },
      { titleKey: "settings", url: ROUTES.ADMIN_SETTINGS, icon: Settings },
    ],
  },
] as const
