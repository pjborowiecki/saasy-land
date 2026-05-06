import { useFormContext, useWatch } from "react-hook-form"

export function usePasswordRules(): {
  isMinLength: boolean
  hasUppercase: boolean
  hasSpecialChar: boolean
} {
  const { control } = useFormContext<{ password?: string }>()
  const password = useWatch({ control, name: "password", defaultValue: "" }) ?? ""

  return {
    isMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(password),
  }
}
