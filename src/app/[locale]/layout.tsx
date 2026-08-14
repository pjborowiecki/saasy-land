import type { Metadata, Viewport } from "next"
import { notFound } from "next/navigation"
import { locale as rootLocale } from "next/root-params"
import { Suspense, type JSX } from "react"

import { hasLocale } from "next-intl"
import { getMessages } from "next-intl/server"

import { env } from "~/src/platform/env"

import { AppRouterProvider } from "~/src/providers/app-router-provider"
import { ThemeProvider } from "~/src/providers/theme-provider"
import { TooltipProvider } from "~/src/providers/tooltip-provider"
import { TranslationsProvider } from "~/src/providers/translations-provider"

import { toClientMessages } from "~/src/integrations/next-intl/i18n.client-messages"
import type { Locale } from "~/src/integrations/next-intl/i18n.config"
import { routing } from "~/src/integrations/next-intl/i18n.routing"

import { cn } from "~/src/utils"

import { Toaster } from "~/src/presentation/components/shadcn/sonner"

import { OfflineBanner } from "~/src/presentation/components/custom/offline-banner"
import { VercelObservability } from "~/src/presentation/components/custom/vercel-observability"

import "~/src/presentation/styles/globals.css"

import { APP_NAME } from "~/src/presentation/branding"
import { geistMono, geistSans } from "~/src/presentation/fonts"

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
}

export function generateMetadata(): Metadata {
  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: {
      default: APP_NAME,
      template: `%s | ${APP_NAME}`,
    },
  }
}

export function generateStaticParams(): { locale: Locale }[] {
  return routing.locales.map((locale) => ({ locale }))
}

/** The page's own ground, so the shell paints the right colour before anything streams in. */
const ROOT_SHELL_FALLBACK = <div className="min-h-svh bg-background" />

export default async function RootLayout({ children }: Readonly<LayoutProps<"/[locale]">>): Promise<JSX.Element> {
  const locale = await rootLocale()

  // The only locale guard in the tree: every segment below inherits this 404.
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const messages = toClientMessages(await getMessages())

  return (
    <html
      lang={locale}
      className={cn(geistSans.variable, geistMono.variable, "h-full bg-background text-foreground antialiased")}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning className="flex min-h-full flex-col">
        <TranslationsProvider locale={locale} messages={messages}>
          {/*
           * `AppRouterProvider` reads the URL, so it cannot be part of the prerendered shell.
           *
           * It renders react-aria's `RouterProvider`, whose `navigate` comes from next-intl's
           * `useRouter()` — and that calls `usePathname()` internally to keep the locale cookie in
           * step. Under Cache Components a Client Component reading URL data must sit inside a
           * `<Suspense>`, or Next cannot complete a static shell and bails the route out of
           * prerendering entirely.
           *
           * This is invisible almost everywhere: where a pathname is known at build time the
           * prerender succeeds regardless. It only bites a render that is genuinely dynamic — a
           * cold ISR miss on Vercel — which is why every local build passed while /docs returned
           * 500 in production. Verified from the minified stack: chunk frame `102:21269` is this
           * component.
           */}
          <Suspense fallback={ROOT_SHELL_FALLBACK}>
            <AppRouterProvider>
              <ThemeProvider>
                <TooltipProvider>
                  <OfflineBanner />
                  {children}
                  <Toaster />
                  <VercelObservability />
                </TooltipProvider>
              </ThemeProvider>
            </AppRouterProvider>
          </Suspense>
        </TranslationsProvider>
      </body>
    </html>
  )
}
