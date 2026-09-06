import { type JSX } from "react"

import { Loader2 } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { Button } from "~/src/presentation/components/shadcn/button"

import { AUTH_PRIMARY_BUTTON_CLASS } from "~/src/presentation/components/custom/auth/constants/auth-styles"

export const SignUpSubmitButton = ({ isPending = false }: Readonly<{ isPending?: boolean }>): JSX.Element => {
  const t = useTranslations("pages.auth.sign-up")
  const isLoading = isPending

  return (
    <Button
      aria-label={t("form.submit")}
      className={AUTH_PRIMARY_BUTTON_CLASS}
      isDisabled={isLoading}
      id="sign-up-form-submit-button"
      type="submit"
    >
      {isLoading && <Loader2 aria-hidden="true" className="size-4 animate-spin" strokeWidth={1.5} />}
      {isLoading ? t("form.submitting") : t("form.submit")}
    </Button>
  )
}
