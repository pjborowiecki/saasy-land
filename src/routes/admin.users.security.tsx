import type { JSX } from "react"

import { createFileRoute } from "@tanstack/react-router"

import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"

import { UsersSecurityTab } from "~/src/presentation/components/custom/admin/users/security/components/users-security-tab"

const SecurityPage = (): JSX.Element => <UsersSecurityTab />

export const Route = createFileRoute("/admin/users/security")({
  component: SecurityPage,
  head: routeHead,
  loader: ({ context }) =>
    loadRouteMessages({
      metadataNamespace: "pages.admin.users",
      namespaces: ["auth.errors", "auth.validations", "pages.admin", "pages.admin.sidebar", "pages.admin.users", "user.validations"],
      pathname: "/admin/users/security",
      queryClient: context.queryClient,
    }),
  staticData: {
    namespaces: ["auth.errors", "auth.validations", "pages.admin", "pages.admin.sidebar", "pages.admin.users", "user.validations"],
  },
})
