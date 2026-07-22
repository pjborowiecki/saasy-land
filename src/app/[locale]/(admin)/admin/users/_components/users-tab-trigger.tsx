"use client"

import { type ComponentProps, type JSX, type ReactNode, useMemo } from "react"

import { Link, usePathname } from "~/src/integrations/next-intl/i18n.navigation"

import { TabsTrigger } from "~/src/presentation/components/shadcn/tabs"

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
      function renderUsersTabLink(props: ComponentProps<"a"> | ComponentProps<"div">) {
        if (!("href" in props)) {
          throw new Error("UsersTabTrigger expected link props with href")
        }

        const { href: _href, ...linkProps } = props
        return <Link {...linkProps} href={href} prefetch />
      },
    [href],
  )

  return (
    <TabsTrigger href={href} id={tab} render={linkRender} {...(className === undefined ? {} : { className })}>
      {children}
    </TabsTrigger>
  )
}
