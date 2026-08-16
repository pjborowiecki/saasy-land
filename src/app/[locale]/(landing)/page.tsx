import type { Metadata } from "next"
import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { CasesSection } from "~/src/app/[locale]/(landing)/_components/sections/cases-section"
import { CliSection } from "~/src/app/[locale]/(landing)/_components/sections/cli-section"
import { CompareSection } from "~/src/app/[locale]/(landing)/_components/sections/compare-section"
import { FaqSection } from "~/src/app/[locale]/(landing)/_components/sections/faq-section"
import { GateSection } from "~/src/app/[locale]/(landing)/_components/sections/gate-section"
import { HeroSection } from "~/src/app/[locale]/(landing)/_components/sections/hero-section"
import { LineSection } from "~/src/app/[locale]/(landing)/_components/sections/line-section"
import { ManifestSection } from "~/src/app/[locale]/(landing)/_components/sections/manifest-section"
import { ManifestoSection } from "~/src/app/[locale]/(landing)/_components/sections/manifesto-section"
import { NotesSection } from "~/src/app/[locale]/(landing)/_components/sections/notes-section"
import { PricingSection } from "~/src/app/[locale]/(landing)/_components/sections/pricing-section"
import { ProofSection } from "~/src/app/[locale]/(landing)/_components/sections/proof-section"
import { QualitySection } from "~/src/app/[locale]/(landing)/_components/sections/quality-section"
import { RallySection } from "~/src/app/[locale]/(landing)/_components/sections/rally-section"
import { RecordSection } from "~/src/app/[locale]/(landing)/_components/sections/record-section"
import { StackSection } from "~/src/app/[locale]/(landing)/_components/sections/stack-section"
import { StudioSection } from "~/src/app/[locale]/(landing)/_components/sections/studio-section"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.landing")

  return {
    description: t("metadata.description"),
  }
}

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
      <RallySection />
      <ManifestSection />
      <StudioSection />
      <RecordSection />
      <CasesSection />
      <CompareSection />
      <PricingSection />
      <FaqSection />
      <NotesSection />
      <GateSection />
    </>
  )
}
