import { type JSX } from "react"

import { useSuspenseQuery } from "@tanstack/react-query"

import { getCurrentSessionQuery } from "~/src/integrations/better-auth/auth.session"

import { UserWidgetClient } from "~/src/presentation/components/custom/admin/components/user-widget-client"

export const UserWidget = (): JSX.Element | undefined => {
  const session = useSuspenseQuery(getCurrentSessionQuery).data
  if (session === null) {
    return undefined
  }

  const name = session.user.name || session.user.email
  const { email } = session.user

  return <UserWidgetClient email={email} name={name} />
}
