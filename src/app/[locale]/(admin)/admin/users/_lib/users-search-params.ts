import { createLoader, parseAsStringLiteral } from "nuqs/server"

import { USERS_PAGE_DEFAULT_TAB, USERS_PAGE_TABS } from "~/src/app/[locale]/(admin)/admin/users/_lib/users-page-tabs"

const usersPageSearchParams = {
  tab: parseAsStringLiteral(USERS_PAGE_TABS).withDefault(USERS_PAGE_DEFAULT_TAB),
}

export const loadUsersPageSearchParams = createLoader(usersPageSearchParams)
