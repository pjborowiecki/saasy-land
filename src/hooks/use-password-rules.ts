import { useFormContext, useWatch } from "react-hook-form"

const MIN_PASSWORD_LENGTH = 8
const SPECIAL_CHAR_PATTERN = /[^A-Za-z0-9]/u
const UPPERCASE_PATTERN = /[A-Z]/u

export function usePasswordRules(): {
  isMinLength: boolean
  hasUppercase: boolean
  hasSpecialChar: boolean
} {
  const { control } = useFormContext<{ password?: string }>()
  const password = useWatch({ control, defaultValue: "", name: "password" }) ?? ""

  return {
    hasSpecialChar: SPECIAL_CHAR_PATTERN.test(password),
    hasUppercase: UPPERCASE_PATTERN.test(password),
    isMinLength: password.length >= MIN_PASSWORD_LENGTH,
  }
}
