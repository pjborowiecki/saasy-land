import { redirect } from "~/src/integrations/next-intl/i18n.navigation"
import { getRootLocale } from "~/src/integrations/next-intl/i18n.root-params"

import { ROUTES } from "~/src/routes"

export default async function UsersIndexPage(): Promise<void> {
  redirect({ href: ROUTES.ADMIN_USERS_ALL, locale: await getRootLocale() })
}
