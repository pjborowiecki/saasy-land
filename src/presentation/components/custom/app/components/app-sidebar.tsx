import { type JSX, type ReactNode, useCallback } from "react"

import { Link, useRouterState } from "@tanstack/react-router"
import { BookOpen, Mail } from "lucide-react"
import { useLocale, useTranslations } from "use-intl/react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/src/presentation/components/shadcn/sidebar"

import { APP_NAVIGATION } from "~/src/presentation/components/custom/app/constants/navigation"
import { LocaleSwitch } from "~/src/presentation/components/custom/locale-switch"
import { Wordmark } from "~/src/presentation/components/custom/wordmark"

import { CONTACT_EMAIL } from "~/src/presentation/branding"
import { ROUTES } from "~/src/routes"

interface AppSidebarProps {
  readonly children: ReactNode
}

export const AppSidebar = ({ children }: AppSidebarProps): JSX.Element => {
  const t = useTranslations("pages.app.navigation")
  const locale = useLocale()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const { setOpenMobile } = useSidebar()
  const closeMobile = useCallback(() => {
    setOpenMobile(false)
  }, [setOpenMobile])

  return (
    <Sidebar>
      <SidebarHeader className="h-14 justify-center border-b border-sidebar-border px-3 py-0">
        <Link
          className="flex h-9 items-center rounded-md px-2 transition-colors duration-200 hover:bg-sidebar-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          onClick={closeMobile}
          to={ROUTES.APP}
        >
          <Wordmark />
        </Link>
      </SidebarHeader>
      <SidebarContent className="custom-scrollbar gap-6 px-2 pt-4">
        <nav aria-label={t("label")}>
          <SidebarGroup className="p-0">
            <SidebarMenu className="gap-1">
              {APP_NAVIGATION.map((item) => {
                const isActive = pathname === item.url || (item.url !== ROUTES.APP && pathname.startsWith(`${item.url}/`))

                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      aria-current={isActive ? "page" : undefined}
                      className="h-9 gap-2.5 rounded-md px-2 text-body-sm data-active:font-medium"
                      href={item.url}
                      isActive={isActive}
                      onPress={closeMobile}
                    >
                      <item.icon aria-hidden className={isActive ? "text-ring" : "text-muted-foreground"} strokeWidth={1.5} />
                      <span>{t(item.label)}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        </nav>
        <nav aria-label={t("resources")}>
          <SidebarGroup className="p-0">
            <p className="mb-1.5 px-2 font-mono text-label text-muted-foreground uppercase">{t("resources")}</p>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton className="h-9 gap-2.5 text-body-sm text-muted-foreground" href={ROUTES.DOCS} onPress={closeMobile}>
                  <BookOpen aria-hidden strokeWidth={1.5} />
                  <span>{t("documentation")}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="h-9 gap-2.5 text-body-sm text-muted-foreground" href={`mailto:${CONTACT_EMAIL}`}>
                  <Mail aria-hidden strokeWidth={1.5} />
                  <span>{t("support")}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </nav>
      </SidebarContent>
      <SidebarFooter className="gap-3 border-t border-sidebar-border p-3">
        <LocaleSwitch locale={locale} />
        {children}
      </SidebarFooter>
    </Sidebar>
  )
}
