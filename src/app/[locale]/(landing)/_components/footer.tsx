import { type JSX, type ReactNode, Suspense } from "react"

import { getTranslations } from "next-intl/server"

import { I18N, type Locale } from "~/src/integrations/next-intl/i18n.config"
import { getPathname, Link } from "~/src/integrations/next-intl/i18n.navigation"
import { getRootLocale } from "~/src/integrations/next-intl/i18n.root-params"

import { cn } from "~/src/utils"

import { Wordmark } from "~/src/presentation/components/custom/wordmark"

import { BuildLogForm } from "~/src/app/[locale]/(landing)/_components/build-log-form"
import { FooterCopyright } from "~/src/app/[locale]/(landing)/_components/footer-copyright"
import { APP_GITHUB_URL, APP_NAME, CONTACT_EMAIL } from "~/src/presentation/branding"

const COLUMN_HEADING_CLASSNAME = "font-mono text-label text-muted-foreground uppercase"

const FOOTER_LINK_CLASSNAME =
  "inline-block rounded-sm py-1.5 text-body-sm text-muted-foreground transition-colors duration-200 ease-exp hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const FIRST_LETTER = 0
const AFTER_FIRST_LETTER = 1

interface LocaleOption {
  readonly code: Locale
  readonly href: string
  readonly name: string
}

/**
 * A locale's own name for itself, resolved from ICU instead of typed into the message files.
 * The page claims the product ships 54 locales; the switcher below is the one place it can
 * demonstrate rather than assert, and hardcoding the endonyms would undercut the claim the
 * moment a third locale is enabled.
 */
function localeEndonym(code: Locale): string {
  const [language] = code.split("-")
  const name = new Intl.DisplayNames([code], { type: "language" }).of(language ?? code) ?? code
  return name.charAt(FIRST_LETTER).toLocaleUpperCase(code) + name.slice(AFTER_FIRST_LETTER)
}

/**
 * Endonyms and hrefs depend only on the enabled locale set, so they resolve once per process.
 *
 * `getPathname` rather than a hand-built prefix: it is the same resolver the router uses, so the
 * `as-needed` rule that leaves en-US unprefixed stays in one place. Plain `<a>` rather than
 * next-intl's `Link`: passing `locale` to `Link` switches it to a variant that reads
 * `usePathname()` to sync the locale cookie, and URL data in a Client Component blocks the route
 * from prerendering under Cache Components. Locale detection is off in this app, so the cookie
 * buys nothing the URL does not already say.
 */
const LOCALE_OPTIONS: readonly LocaleOption[] = I18N.LOCALES.map((code) => ({
  code,
  href: getPathname({ href: "/", locale: code }),
  name: localeEndonym(code),
}))

interface LinkColumnProps {
  readonly children: ReactNode
  readonly heading: string
}

function LinkColumn({ children, heading }: LinkColumnProps): JSX.Element {
  return (
    <div>
      <h3 className={COLUMN_HEADING_CLASSNAME}>{heading}</h3>
      <ul className="mt-4">{children}</ul>
    </div>
  )
}

/** Server-rendered, zero client JS: two real links, the active one carrying the accent dot. */
function LocaleSwitch({
  current,
  label,
  options,
}: Readonly<{ current: Locale; label: string; options: readonly LocaleOption[] }>): JSX.Element {
  return (
    <nav aria-label={label} className="flex items-center gap-1">
      {options.map((option) => (
        <a
          aria-current={option.code === current ? "true" : undefined}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-body-sm transition-colors duration-200 ease-exp focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            option.code === current ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground",
          )}
          href={option.href}
          hrefLang={option.code}
          key={option.code}
        >
          {option.code === current ? <span aria-hidden className="size-1 rounded-full bg-ring" /> : undefined}
          {option.name}
        </a>
      ))}
    </nav>
  )
}

export async function Footer(): Promise<JSX.Element> {
  const t = await getTranslations("pages.landing.components.footer")
  const locale = await getRootLocale()

  return (
    <footer className="relative z-10 border-t border-border bg-background">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        {/*
         * The capture band, as the footer's opening movement rather than as a fourth column.
         * It is the last thing the page asks for, and it asks it of the visitor who is not
         * buying today, so it gets a full row instead of a corner.
         */}
        <div className="grid gap-x-16 gap-y-8 border-b border-border py-14 md:grid-cols-2 md:items-end md:py-16">
          <div>
            <h2 className="text-headline-support text-foreground">{t("buildLog.title")}</h2>
            <p className="mt-3 max-w-136 text-body text-pretty text-muted-foreground">{t("buildLog.body")}</p>
          </div>
          <BuildLogForm
            button={t("buildLog.button")}
            error={t("buildLog.error")}
            label={t("buildLog.label")}
            locale={locale}
            note={t("buildLog.note")}
            placeholder={t("buildLog.placeholder")}
            success={t("buildLog.success")}
          />
        </div>

        <div className="grid grid-cols-2 items-start gap-x-8 gap-y-12 py-14 md:grid-cols-[1.7fr_1fr_1fr] md:gap-x-12 md:py-16">
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

          <LinkColumn heading={t("product")}>
            <li>
              <a className={FOOTER_LINK_CLASSNAME} href="/#line">
                {t("links.line")}
              </a>
            </li>
            <li>
              <a className={FOOTER_LINK_CLASSNAME} href="/#pricing">
                {t("links.pricing")}
              </a>
            </li>
            <li>
              <a className={FOOTER_LINK_CLASSNAME} href="/#faq">
                {t("links.faq")}
              </a>
            </li>
            <li>
              <Link className={FOOTER_LINK_CLASSNAME} href="/docs">
                {t("links.docs")}
              </Link>
            </li>
            <li>
              <Link className={FOOTER_LINK_CLASSNAME} href="/blog">
                {t("links.blog")}
              </Link>
            </li>
          </LinkColumn>

          <LinkColumn heading={t("legal")}>
            <li>
              <Link className={FOOTER_LINK_CLASSNAME} href="/privacy">
                {t("links.privacy")}
              </Link>
            </li>
            <li>
              <Link className={FOOTER_LINK_CLASSNAME} href="/terms">
                {t("links.terms")}
              </Link>
            </li>
          </LinkColumn>
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
            <LocaleSwitch current={locale} label={t("language")} options={LOCALE_OPTIONS} />
          </div>
        </div>
      </div>
    </footer>
  )
}
