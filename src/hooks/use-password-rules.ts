import { useFormContext, useWatch } from "react-hook-form"

import { getPasswordRuleState } from "~/src/integrations/better-auth/auth.constraints"

export function usePasswordRules(): {
  isMinLength: boolean
  hasUppercase: boolean
  hasSpecialChar: boolean
} {
  const { control } = useFormContext<{ password?: string }>()
  const password = useWatch({ control, name: "password" }) ?? ""

  return getPasswordRuleState(password)
}
