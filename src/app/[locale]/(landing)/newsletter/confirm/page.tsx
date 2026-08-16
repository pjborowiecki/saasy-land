import type { Metadata } from "next"
import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { NEWSLETTER_TOKEN_LENGTH } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.schema"
import { confirmNewsletterSubscription } from "~/src/modules/newsletter-subscriber/use-cases/confirm-newsletter-subscription.use-case"

import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { ROUTES } from "~/src/routes"

export const instant = false

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.newsletter.confirm")

  return {
    description: t("description"),
    robots: { follow: false, index: false },
    title: t("title"),
  }
}

export default async function ConfirmNewsletterPage({ searchParams }: PageProps<"/[locale]/newsletter/confirm">): Promise<JSX.Element> {
  const { token } = await searchParams
  const t = await getTranslations("pages.newsletter.confirm")

  const result =
    typeof token === "string" && token.length === NEWSLETTER_TOKEN_LENGTH ? await confirmNewsletterSubscription({ token }) : undefined

  const state = result?.data?.confirmed === true ? "confirmed" : "expired"

  return (
    <section className="relative">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-6 py-32 text-center md:py-40">
        <h1 className="text-headline-peak text-balance text-foreground">{t(`${state}.title`)}</h1>
        <p className="mt-5 text-lead text-pretty text-muted-foreground">{t(`${state}.body`)}</p>
        <p className="mt-8 text-body-sm text-pretty text-muted-foreground">{t(`${state}.note`)}</p>
        <Link
          className="mt-10 rounded-sm text-body-sm font-medium text-foreground underline underline-offset-4 transition-colors duration-200 ease-exp hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          href={ROUTES.HOME}
        >
          {t(`${state}.action`)}
        </Link>
      </div>
    </section>
  )
}
