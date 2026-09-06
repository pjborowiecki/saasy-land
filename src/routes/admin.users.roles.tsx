import type { JSX } from "react"

import { createFileRoute } from "@tanstack/react-router"

import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"

import { UsersRolesTab } from "~/src/presentation/components/custom/admin/users/roles/components/users-roles-tab"

const RolesPage = (): JSX.Element => <UsersRolesTab />

export const Route = createFileRoute("/admin/users/roles")({
  component: RolesPage,
  head: routeHead,
  loader: ({ context }) =>
    loadRouteMessages({
      metadataNamespace: "pages.admin.users",
      namespaces: ["auth.errors", "auth.validations", "pages.admin", "pages.admin.sidebar", "pages.admin.users", "user.validations"],
      pathname: "/admin/users/roles",
      queryClient: context.queryClient,
    }),
  staticData: {
    namespaces: ["auth.errors", "auth.validations", "pages.admin", "pages.admin.sidebar", "pages.admin.users", "user.validations"],
  },
})
