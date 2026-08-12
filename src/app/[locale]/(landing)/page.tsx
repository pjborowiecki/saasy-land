import type { Metadata } from "next"
import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { CliSection } from "~/src/app/[locale]/(landing)/_components/sections/cli-section"
import { CompareSection } from "~/src/app/[locale]/(landing)/_components/sections/compare-section"
import { FaqSection } from "~/src/app/[locale]/(landing)/_components/sections/faq-section"
import { GateSection } from "~/src/app/[locale]/(landing)/_components/sections/gate-section"
import { HeroSection } from "~/src/app/[locale]/(landing)/_components/sections/hero-section"
import { LineSection } from "~/src/app/[locale]/(landing)/_components/sections/line-section"
import { ManifestSection } from "~/src/app/[locale]/(landing)/_components/sections/manifest-section"
import { ManifestoSection } from "~/src/app/[locale]/(landing)/_components/sections/manifesto-section"
import { PricingSection } from "~/src/app/[locale]/(landing)/_components/sections/pricing-section"
import { ProofSection } from "~/src/app/[locale]/(landing)/_components/sections/proof-section"
import { QualitySection } from "~/src/app/[locale]/(landing)/_components/sections/quality-section"
import { RecordSection } from "~/src/app/[locale]/(landing)/_components/sections/record-section"
import { StackSection } from "~/src/app/[locale]/(landing)/_components/sections/stack-section"
import { StudioSection } from "~/src/app/[locale]/(landing)/_components/sections/studio-section"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.landing")

  return {
    description: t("metadata.description"),
  }
}

/*
 * The order is the argument.
 *
 * Show the product, count what is in it, name what it runs on. State the problem in four
 * sentences, then answer it in the only order that works: first how you get a project at all (the
 * CLI and its five questions), then what already runs inside it (the line). Spend the middle
 * proving those claims, hand over the receipt (Record), and only then ask for money (Compare,
 * Pricing), because this page's whole position is that its numbers can be checked before anyone
 * pays.
 *
 * Sections are not individually Suspense-wrapped: they all read the same static message bundle,
 * so streaming them separately buys nothing and would grow the document under anyone who started
 * scrolling immediately.
 *
 * No two adjacent sections share a layout family: hero, stat band, marquee, statement, choice
 * matrix, lattice, split-with-terminal, ledger, media cards, receipt, table, priced frame, sticky
 * FAQ, closer.
 */
export default function LandingPage(): JSX.Element {
  return (
    <>
      <HeroSection />
      <ProofSection />
      <StackSection />
      <ManifestoSection />
      <CliSection />
      <LineSection />
      <QualitySection />
      <ManifestSection />
      <StudioSection />
      <RecordSection />
      <CompareSection />
      <PricingSection />
      <FaqSection />
      <GateSection />
    </>
  )
}
