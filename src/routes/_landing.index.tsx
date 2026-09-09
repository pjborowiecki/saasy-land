import type { JSX } from "react"

import { createFileRoute } from "@tanstack/react-router"

import { blogPostsQuery } from "~/src/integrations/fumadocs/fumadocs.blog"
import { starCountQuery } from "~/src/integrations/github/github.queries"
import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"

import { CasesSection } from "~/src/presentation/components/custom/landing-page/sections/cases-section"
import { CliSection } from "~/src/presentation/components/custom/landing-page/sections/cli-section"
import { CompareSection } from "~/src/presentation/components/custom/landing-page/sections/compare-section"
import { FaqSection } from "~/src/presentation/components/custom/landing-page/sections/faq-section"
import { GateSection } from "~/src/presentation/components/custom/landing-page/sections/gate-section"
import { HeroSection } from "~/src/presentation/components/custom/landing-page/sections/hero-section"
import { LineSection } from "~/src/presentation/components/custom/landing-page/sections/line-section"
import { ManifestSection } from "~/src/presentation/components/custom/landing-page/sections/manifest-section"
import { ManifestoSection } from "~/src/presentation/components/custom/landing-page/sections/manifesto-section"
import { NotesSection } from "~/src/presentation/components/custom/landing-page/sections/notes-section"
import { PricingSection } from "~/src/presentation/components/custom/landing-page/sections/pricing-section"
import { ProofSection } from "~/src/presentation/components/custom/landing-page/sections/proof-section"
import { QualitySection } from "~/src/presentation/components/custom/landing-page/sections/quality-section"
import { RallySection } from "~/src/presentation/components/custom/landing-page/sections/rally-section"
import { RecordSection } from "~/src/presentation/components/custom/landing-page/sections/record-section"
import { StackSection } from "~/src/presentation/components/custom/landing-page/sections/stack-section"
import { StudioSection } from "~/src/presentation/components/custom/landing-page/sections/studio-section"

const LandingPage = (): JSX.Element => (
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

export const Route = createFileRoute("/_landing/")({
  component: LandingPage,
  head: routeHead,
  loader: async ({ context }) => {
    const [metadata] = await Promise.all([
      loadRouteMessages({
        metadataNamespace: "pages.landing",
        namespaces: [
          "auth.errors",
          "auth.form",
          "auth.gate",
          "auth.layout",
          "auth.oauth",
          "auth.validations",
          "locales",
          "pages.blog",
          "pages.landing",
          "product.errors",
          "product.validations",
        ],
        pathname: "/",
        queryClient: context.queryClient,
      }),
      context.queryClient.query(blogPostsQuery()),
      context.queryClient.query(starCountQuery).catch(() => {}),
    ])
    return metadata
  },
  staticData: {
    namespaces: [
      "auth.errors",
      "auth.form",
      "auth.gate",
      "auth.layout",
      "auth.oauth",
      "auth.validations",
      "locales",
      "pages.blog",
      "pages.landing",
      "product.errors",
      "product.validations",
    ],
  },
})
