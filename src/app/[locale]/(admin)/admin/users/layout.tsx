import { type JSX } from "react"

import { getTranslations } from "next-intl/server"

import { UsersNavTabs } from "~/src/app/[locale]/(admin)/admin/users/_components/users-nav-tabs"

export default async function AdminUsersLayout({ children }: Readonly<LayoutProps<"/[locale]/admin/users">>): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.users")

  return (
    <div className="-mx-4 -mt-4 -mb-2 flex min-h-0 w-[calc(100%+2rem)] flex-1 flex-col overflow-hidden md:-mx-6 md:-mt-6 md:-mb-3 md:w-[calc(100%+3rem)]">
      <div className="shrink-0 border-b border-border bg-secondary/20 px-4 pt-4 md:px-6 md:pt-6">
        <div className="mb-8">
          <h1 className="mb-1 text-2xl font-medium tracking-tight text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
        <UsersNavTabs />
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pt-4 md:px-6 md:pt-6">{children}</div>
    </div>
  )
}
