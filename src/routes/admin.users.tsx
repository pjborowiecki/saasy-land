import { type JSX } from "react"

import { Outlet, createFileRoute } from "@tanstack/react-router"
import { useTranslations } from "use-intl/react"

import { preloadNamespaces } from "~/src/integrations/use-intl/i18n.messages"
import { getCurrentLocale } from "~/src/integrations/use-intl/i18n.utils"

import { UsersNavTabs } from "~/src/presentation/components/custom/admin/users/components/users-nav-tabs"

const AdminUsersLayout = (): JSX.Element => {
  const t = useTranslations("pages.admin.users")

  return (
    // Negative margins mirror the padding in `admin/layout.tsx`; change the two together.
    <div className="-mx-4 -mt-5 -mb-6 flex min-h-0 w-[calc(100%+2rem)] flex-1 flex-col overflow-hidden md:-mx-6 md:-mt-7 md:-mb-8 md:w-[calc(100%+3rem)]">
      <div className="shrink-0 border-b border-border bg-muted/30 px-4 pt-5 md:px-6 md:pt-7">
        <div className="mb-6">
          <h1 className="text-statement font-semibold text-foreground">{t("title")}</h1>
          <p className="mt-0.5 text-body-sm text-muted-foreground">{t("description")}</p>
        </div>
        <UsersNavTabs />
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pt-5 md:px-6 md:pt-6">
        <Outlet />
      </div>
    </div>
  )
}

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersLayout,
  loader: ({ context }) =>
    preloadNamespaces({
      locale: getCurrentLocale(),
      namespaces: ["auth.errors", "auth.validations", "pages.admin", "pages.admin.sidebar", "pages.admin.users", "user.validations"],
      queryClient: context.queryClient,
    }),
  staticData: {
    namespaces: ["auth.errors", "auth.validations", "pages.admin", "pages.admin.sidebar", "pages.admin.users", "user.validations"],
  },
})
