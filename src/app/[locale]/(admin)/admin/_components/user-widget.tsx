import type { JSX } from "react"

import { getCurrentSession } from "~/src/integrations/better-auth/auth.guards"

import { UserWidgetClient } from "~/src/app/[locale]/(admin)/admin/_components/user-widget-client"

export async function UserWidget(): Promise<JSX.Element | undefined> {
  const session = await getCurrentSession()
  if (session === undefined || session === null) {
    return undefined
  }

  const name = session.user.name ?? session.user.email
  const { email } = session.user

  return <UserWidgetClient email={email} name={name} />
}
