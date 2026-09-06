import { type JSX, Suspense } from "react"

import { useTranslations } from "use-intl/react"

import { getCurrentLocale } from "~/src/integrations/use-intl/i18n.utils"

import { LEGAL_LINKS, PRODUCT_LINKS } from "~/src/data/marketing-footer"

import { FooterCopyright } from "~/src/presentation/components/custom/landing-page/components/footer-copyright"
import { FooterLink } from "~/src/presentation/components/custom/landing-page/components/footer-link"
import { FooterLinkColumn } from "~/src/presentation/components/custom/landing-page/components/footer-link-column"
import { NewsletterSubscriptionForm } from "~/src/presentation/components/custom/landing-page/components/newsletter-subscription-form"
import { LocaleSwitch } from "~/src/presentation/components/custom/locale-switch"
import { Wordmark } from "~/src/presentation/components/custom/wordmark"

import { APP_GITHUB_URL, APP_NAME, CONTACT_EMAIL } from "~/src/presentation/branding"

export const Footer = (): JSX.Element => {
  const t = useTranslations("pages.landing.components.footer")
  const locale = getCurrentLocale()

  return (
    <footer className="relative z-10 border-t border-border bg-background">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        <div className="grid gap-x-16 gap-y-8 border-b border-border py-14 md:grid-cols-2 md:items-end md:py-16">
          <div>
            <h2 className="text-headline-support text-foreground">{t("buildLog.title")}</h2>
            <p className="mt-3 max-w-136 text-body text-pretty text-muted-foreground">{t("buildLog.body")}</p>
          </div>
          <NewsletterSubscriptionForm />
        </div>

        <div className="grid grid-cols-2 items-start gap-x-8 gap-y-12 py-14 md:grid-cols-[1.5fr_1.3fr_1fr] md:gap-x-12 md:py-16">
          <div className="col-span-2 md:col-span-1">
            <Wordmark />
            <p className="mt-4 max-w-[24rem] text-body text-pretty text-muted-foreground">{t("tagline")}</p>
            <a
              className="mt-6 inline-block rounded-sm font-mono text-spec text-muted-foreground transition-colors duration-200 ease-exp hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              href={`mailto:${CONTACT_EMAIL}`}
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          <FooterLinkColumn className="grid grid-cols-2 gap-x-8" heading={t("product")}>
            {PRODUCT_LINKS.map((link) => (
              <li key={link.href}>
                <FooterLink href={link.href} label={t(link.labelKey)} />
              </li>
            ))}
          </FooterLinkColumn>

          <FooterLinkColumn heading={t("legal")}>
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <FooterLink href={link.href} label={t(link.labelKey)} />
              </li>
            ))}
          </FooterLinkColumn>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-border py-7">
          <p className="font-mono text-spec text-muted-foreground">
            <span>{APP_NAME}</span>
            <Suspense>
              <FooterCopyright />
            </Suspense>
            <span className="ml-2">{t("rights")}</span>
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <a
              className="rounded-sm py-1.5 text-body-sm text-muted-foreground transition-colors duration-200 ease-exp hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              href={APP_GITHUB_URL}
              rel="noreferrer"
              target="_blank"
            >
              {t("links.github")}
            </a>
            <span aria-hidden className="h-4 w-px bg-border" />
            <LocaleSwitch appearance="compact" locale={locale} />
          </div>
        </div>
      </div>
    </footer>
  )
}
