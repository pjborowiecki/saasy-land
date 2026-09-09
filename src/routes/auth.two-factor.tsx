import { type JSX } from "react"

import { createFileRoute } from "@tanstack/react-router"
import { useTranslations } from "use-intl/react"

import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"

import { AuthPageShell } from "~/src/presentation/components/custom/auth/components/auth-page-shell"
import { TwoFactorForm } from "~/src/presentation/components/custom/auth/two-factor/components/two-factor-form"

const TwoFactorPage = (): JSX.Element => {
  const t = useTranslations("pages.auth.two-factor")

  return (
    <AuthPageShell description={t("form.description")} title={t("form.title")}>
      <TwoFactorForm />
    </AuthPageShell>
  )
}

export const Route = createFileRoute("/auth/two-factor")({
  component: TwoFactorPage,
  head: routeHead,
  loader: ({ context }) =>
    loadRouteMessages({
      metadataNamespace: "pages.auth.two-factor",
      namespaces: [
        "auth.errors",
        "auth.form",
        "auth.gate",
        "auth.layout",
        "auth.oauth",
        "auth.validations",
        "pages.auth.two-factor",
        "verification.validations",
      ],
      pathname: "/auth/two-factor",
      queryClient: context.queryClient,
    }),
  staticData: {
    namespaces: [
      "auth.errors",
      "auth.form",
      "auth.gate",
      "auth.layout",
      "auth.oauth",
      "auth.validations",
      "pages.auth.two-factor",
      "verification.validations",
    ],
  },
})
