import { getPasswordRuleState } from "~/src/integrations/better-auth/auth.constraints"

export const usePasswordRules = (
  password = "",
): {
  isMinLength: boolean
  hasUppercase: boolean
  hasSpecialChar: boolean
} => getPasswordRuleState(password)
