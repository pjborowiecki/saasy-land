import { type JSX } from "react"

import { getTranslations } from "next-intl/server"

import { UsersNavTabs } from "~/src/app/[locale]/(admin)/admin/users/_components/users-nav-tabs"

export default async function AdminUsersLayout({ children }: Readonly<LayoutProps<"/[locale]/admin/users">>): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.users")

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

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pt-5 md:px-6 md:pt-6">{children}</div>
    </div>
  )
}
