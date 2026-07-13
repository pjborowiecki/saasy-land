"use client"

import { type ComponentProps, type JSX, type ReactNode, useMemo } from "react"

import { Link, usePathname } from "~/src/integrations/next-intl/i18n.navigation"

import { TabsTrigger } from "~/src/components/shadcn/tabs"

import { getUsersPageTabHref, type UsersPageTab } from "~/src/app/[locale]/(admin)/admin/users/_lib/users-page-tabs"

interface UsersTabTriggerProps {
  readonly children: ReactNode
  readonly className?: string
  readonly tab: UsersPageTab
}

export function UsersTabTrigger({ children, className, tab }: Readonly<UsersTabTriggerProps>): JSX.Element {
  const pathname = usePathname()
  const href = getUsersPageTabHref(pathname, tab)

  const linkRender = useMemo(
    () =>
      function renderUsersTabLink(props: ComponentProps<"a">) {
        return <Link {...props} href={href} prefetch />
      },
    [href],
  )

  return (
    <TabsTrigger value={tab} nativeButton={false} render={linkRender} className={className}>
      {children}
    </TabsTrigger>
  )
}
