import type { Metadata } from "next"
import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { LandingSectionSuspense } from "~/src/app/[locale]/(landing)/_components/landing-section-suspense"
import { BenefitsSection } from "~/src/app/[locale]/(landing)/_components/sections/benefits-section"
import { ContactSection } from "~/src/app/[locale]/(landing)/_components/sections/contact-section"
import { FaqSection } from "~/src/app/[locale]/(landing)/_components/sections/faq-section"
import { FeaturesSection } from "~/src/app/[locale]/(landing)/_components/sections/features-section"
import { HeroSection } from "~/src/app/[locale]/(landing)/_components/sections/hero-section"
import { NewsletterSection } from "~/src/app/[locale]/(landing)/_components/sections/newsletter-section"
import { PricingSection } from "~/src/app/[locale]/(landing)/_components/sections/pricing-section"
import { TechSection } from "~/src/app/[locale]/(landing)/_components/sections/tech-section"
import { TestimonialsSection } from "~/src/app/[locale]/(landing)/_components/sections/testimonials-section"

export async function generateMetadata({ params }: Readonly<PageProps<"/[locale]">>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "pages.landing" })

  return {
    description: t("metadata.description"),
  }
}

export default function LandingPage(): JSX.Element {
  return (
    <>
      <HeroSection />
      <TechSection />
      <LandingSectionSuspense>
        <BenefitsSection />
      </LandingSectionSuspense>
      <LandingSectionSuspense>
        <FeaturesSection />
      </LandingSectionSuspense>
      <LandingSectionSuspense>
        <TestimonialsSection />
      </LandingSectionSuspense>
      <LandingSectionSuspense>
        <PricingSection />
      </LandingSectionSuspense>
      <LandingSectionSuspense>
        <FaqSection />
      </LandingSectionSuspense>
      <LandingSectionSuspense>
        <NewsletterSection />
      </LandingSectionSuspense>
      <LandingSectionSuspense>
        <ContactSection />
      </LandingSectionSuspense>
    </>
  )
}
