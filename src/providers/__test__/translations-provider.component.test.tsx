import { Suspense } from "react"

import { screen } from "@testing-library/react"
import { useTranslations } from "use-intl/react"
import { expect, it } from "vite-plus/test"

import { renderWithRouter } from "~/src/platform/testing/lib/render"

import { TranslationsProvider } from "~/src/providers/translations-provider"

import { getTestMessages } from "~/src/integrations/use-intl/__test__/fixtures/messages"

const Probe = () => {
  const t = useTranslations("common")
  return <span>{t("loading")}</span>
}
it("loads shared translations through React Query before rendering consumers", async () => {
  renderWithRouter(
    <Suspense fallback="pending">
      <TranslationsProvider>
        <Probe />
      </TranslationsProvider>
    </Suspense>,
  )
  expect(await screen.findByText(getTestMessages("en-US").common.loading)).toBeInTheDocument()
})
