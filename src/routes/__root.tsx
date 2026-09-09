import { type ReactNode, Suspense } from "react"

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from "@tanstack/react-router"
import { ThemeScript } from "@wrksz/themes/script"

import { AppRouterProvider } from "~/src/providers/app-router-provider"
import { ThemeProvider } from "~/src/providers/theme-provider"
import { TranslationsProvider } from "~/src/providers/translations-provider"

import { ROOT_NAMESPACES, preloadNamespaces } from "~/src/integrations/use-intl/i18n.messages"
import { getCurrentLocale } from "~/src/integrations/use-intl/i18n.utils"

import { THEME } from "~/src/presentation/theme"

import { Toaster } from "~/src/presentation/components/shadcn/sonner"

import { GlobalError } from "~/src/presentation/components/custom/default-error"
import { OfflineBanner } from "~/src/presentation/components/custom/offline-banner"

import globalsCss from "~/src/presentation/styles/globals.css?url"

import type { RouterContext } from "~/src/router"

const RootComponent = () => (
  <TranslationsProvider>
    <AppRouterProvider>
      <ThemeProvider>
        <TooltipPrimitive.Provider data-slot="tooltip-provider" delay={0}>
          <OfflineBanner />
          <Suspense>
            <Outlet />
          </Suspense>
          <Toaster />
        </TooltipPrimitive.Provider>
      </ThemeProvider>
    </AppRouterProvider>
  </TranslationsProvider>
)

const RootDocument = ({ children }: Readonly<{ children: ReactNode }>) => (
  <html
    lang={getCurrentLocale()}
    className="h-full bg-background text-foreground antialiased"
    data-scroll-behavior="smooth"
    suppressHydrationWarning
  >
    <head>
      <meta charSet="utf-8" />
      <ThemeScript defaultTheme={THEME.DEFAULT_THEME} storage="localStorage" storageKey={THEME.STORAGE_KEY} />
      <HeadContent />
    </head>
    <body className="flex min-h-full flex-col" suppressHydrationWarning>
      {children}
      <Scripts />
    </body>
  </html>
)

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: ({ context }) =>
    preloadNamespaces({ locale: getCurrentLocale(), namespaces: ROOT_NAMESPACES, queryClient: context.queryClient }),
  component: RootComponent,
  errorComponent: GlobalError,
  head: () => ({
    links: [
      { href: globalsCss, rel: "stylesheet" },
      { as: "font", crossOrigin: "anonymous", href: "/fonts/caa3a2e1cccd8315-s.p.0wgildi0cnwt9.woff2", rel: "preload", type: "font/woff2" },
      { as: "font", crossOrigin: "anonymous", href: "/fonts/7178b3e590c64307-s.p.21jp631_3pja2.woff2", rel: "preload", type: "font/woff2" },
    ],
    meta: [
      { content: "width=device-width, initial-scale=1", name: "viewport" },
      ...(import.meta.env.MODE === "production" ? [] : [{ content: "noindex, nofollow", name: "robots" }]),
    ],
  }),
  shellComponent: RootDocument,
})
