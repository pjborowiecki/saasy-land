import { createNavigation } from "next-intl/navigation"

import { routing } from "~/src/integrations/next-intl/i18n.routing"

export const { Link, redirect, permanentRedirect, useRouter, usePathname, getPathname } = createNavigation(routing)
