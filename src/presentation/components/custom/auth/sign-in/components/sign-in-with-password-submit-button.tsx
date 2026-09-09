import { type JSX } from "react"

import { Loader2 } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { Button } from "~/src/presentation/components/shadcn/button"

import { AUTH_PRIMARY_BUTTON_CLASS } from "~/src/presentation/components/custom/auth/constants/auth-styles"

export const SignInSubmitButton = ({ isPending = false }: Readonly<{ isPending?: boolean }>): JSX.Element => {
  const t = useTranslations("pages.auth.sign-in")

  return (
    <Button
      aria-label={t("form.submit")}
      className={AUTH_PRIMARY_BUTTON_CLASS}
      data-testid="sign-in-form-submit-button"
      isDisabled={isPending}
      type="submit"
    >
      {isPending && <Loader2 aria-hidden="true" className="size-4 animate-spin" strokeWidth={1.5} />}
      {isPending ? t("form.submitting") : t("form.submit")}
    </Button>
  )
}
