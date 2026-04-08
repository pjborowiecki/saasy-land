import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { JSX } from "react"

import { hasLocale } from "next-intl"

import { env } from "~/src/environment"

import { CONSTANTS } from "~/src/constants"
import type { Locale } from "~/src/constants/types"

import { ThemeProvider } from "~/src/providers/theme-provider"
import { TooltipProvider } from "~/src/providers/tooltip-provider"
import { TranslationsProvider } from "~/src/providers/translations-provider"

import { routing } from "~/src/integrations/next-intl/i18n.routing"

import { geistMono, geistSans } from "~/src/lib/fonts"
import { cn } from "~/src/lib/utils"

import { Toaster } from "~/src/components/shadcn/sonner"

import "~/src/styles/globals.css"

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: {
      default: CONSTANTS.APP_NAME,
      template: `%s | ${CONSTANTS.APP_NAME}`,
    },
  }
}

export function generateStaticParams(): Array<{ locale: Locale }> {
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
      <body className="flex min-h-full flex-col">
        <TranslationsProvider>
          <ThemeProvider>
            <TooltipProvider>
              {children}
              <Toaster />
            </TooltipProvider>
          </ThemeProvider>
        </TranslationsProvider>
      </body>
    </html>
  )
}
