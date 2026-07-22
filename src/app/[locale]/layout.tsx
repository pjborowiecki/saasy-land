import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { JSX } from "react"

import { hasLocale } from "next-intl"

import { env } from "~/src/platform/env"

import { ThemeProvider } from "~/src/providers/theme-provider"
import { TooltipProvider } from "~/src/providers/tooltip-provider"
import { TranslationsProvider } from "~/src/providers/translations-provider"

import type { Locale } from "~/src/integrations/next-intl/i18n.config"
import { routing } from "~/src/integrations/next-intl/i18n.routing"

import { cn } from "~/src/utils"

import { Toaster } from "~/src/presentation/components/shadcn/sonner"

import { VercelObservability } from "~/src/presentation/components/custom/vercel-observability"

import "~/src/presentation/styles/globals.css"

import { APP_NAME } from "~/src/presentation/branding"
import { geistMono, geistSans } from "~/src/presentation/fonts"

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

export default async function RootLayout({ children, params }: Readonly<LayoutProps<"/[locale]">>): Promise<JSX.Element> {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  return (
    <html
      lang={locale}
      className={cn(geistSans.variable, geistMono.variable, "h-full bg-background text-foreground antialiased")}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning className="flex min-h-full flex-col">
        <TranslationsProvider>
          <ThemeProvider>
            <TooltipProvider>
              {children}
              <Toaster />
              <VercelObservability />
            </TooltipProvider>
          </ThemeProvider>
        </TranslationsProvider>
      </body>
    </html>
  )
}
