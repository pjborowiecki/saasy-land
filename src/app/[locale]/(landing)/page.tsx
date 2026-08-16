import type { Metadata } from "next"
import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { CasesSection } from "~/src/app/[locale]/(landing)/_components/cases/cases-section"
import { CliSection } from "~/src/app/[locale]/(landing)/_components/cli/cli-section"
import { CompareSection } from "~/src/app/[locale]/(landing)/_components/compare/compare-section"
import { FaqSection } from "~/src/app/[locale]/(landing)/_components/faq/faq-section"
import { GateSection } from "~/src/app/[locale]/(landing)/_components/gate/gate-section"
import { HeroSection } from "~/src/app/[locale]/(landing)/_components/hero/hero-section"
import { LineSection } from "~/src/app/[locale]/(landing)/_components/line/line-section"
import { ManifestSection } from "~/src/app/[locale]/(landing)/_components/manifest/manifest-section"
import { ManifestoSection } from "~/src/app/[locale]/(landing)/_components/manifesto/manifesto-section"
import { NotesSection } from "~/src/app/[locale]/(landing)/_components/notes/notes-section"
import { PricingSection } from "~/src/app/[locale]/(landing)/_components/pricing/pricing-section"
import { ProofSection } from "~/src/app/[locale]/(landing)/_components/proof/proof-section"
import { QualitySection } from "~/src/app/[locale]/(landing)/_components/quality/quality-section"
import { RallySection } from "~/src/app/[locale]/(landing)/_components/rally/rally-section"
import { RecordSection } from "~/src/app/[locale]/(landing)/_components/record/record-section"
import { StackSection } from "~/src/app/[locale]/(landing)/_components/stack/stack-section"
import { StudioSection } from "~/src/app/[locale]/(landing)/_components/studio/studio-section"

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
