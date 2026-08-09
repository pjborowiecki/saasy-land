import type { Metadata, Viewport } from "next"
import { notFound } from "next/navigation"
import { locale as rootLocale } from "next/root-params"
import { type JSX } from "react"

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
        </TranslationsProvider>
      </body>
    </html>
  )
}
