export const AUTH_FORM_IDS = {
  FORGOT_PASSWORD: "forgot-password",
  RESET_PASSWORD: "reset-password",
  SIGN_IN: "sign-in",
  SIGN_UP: "sign-up",
} as const

export type AuthFormId = (typeof AUTH_FORM_IDS)[keyof typeof AUTH_FORM_IDS]

export function authFormElementId(formId: AuthFormId): `${AuthFormId}-form` {
  return `${formId}-form`
}
